<?php

namespace App\Http\Controllers\Api\V1\User;

use App\Helpers\FailedValidateResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\V1\Bill\StaffCreateBillRequest;
use App\Models\Bill;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Pusher\Pusher;

class ReservationController extends Controller
{
    protected User $user;

    public function __construct()
    {
        $this->user = new User();
    }

    public function findByPhone(Request $request)
    {
        $phone = $request->query("phone");
        $user = $this->user->withTrashed()->where("phone", $phone)->first();

        if ($user && $user->deleted_at) {
            return FailedValidateResponse::send([
                "blocked" => "Your phone number is blocked in our system"
            ]);
        }

        if ($user) {
            return response()->json(compact("user"));
        }

        return response()->json(compact("user"));
    }

    public function create(Request $request)
    {
        try {
            DB::beginTransaction();

            $user = $this->user->where("phone", $request->input("phone"))->first();
            $email = $request->input("email");

            if (empty($user)) {
                $password = Str::random();
                $user = new User();
                $user->name = $request->input("name");
                $user->phone = $request->input("phone");
                $user->password = Hash::make($password);
                $user->remember_token = Str::random(10);
                $user->email = isset($email) ? $email : null;
                $user->email_verified_at = now();
            } else {
                if (empty($user->email)) {
                    $user->email = isset($email) ? $email : null;
                }
            }

            $user->save();
            $user->refresh();

            $bill = new Bill();
            $bill->user_id = $user->id;
            $bill->start_at = $request->input("start_at");
            $bill->end_at = $request->input("end_at");
            $bill->adults = $request->input("adults");
            $bill->children = $request->input("children");
            $bill->save();

            for ($i = 0; $i < $bill->adults + $bill->children; $i++) {
                $seat = $request->input("available_seats")[$i];
                $bill->seats()->attach(["seat_id" => $seat]);
            }

            $bill->refresh();

            DB::commit();

            $options = [
                'cluster' => env('PUSHER_APP_CLUSTER'),
                'host' => env('PUSHER_HOST') ?: 'api-' . env('PUSHER_APP_CLUSTER', 'mt1') . '.pusher.com',
                'port' => env('PUSHER_PORT', 443),
                'scheme' => env('PUSHER_SCHEME', 'https'),
                'encrypted' => true,
                'useTLS' => env('PUSHER_SCHEME', 'https') === 'https',
            ];

            $pusher = new Pusher(
                env("PUSHER_APP_KEY"),
                env("PUSHER_APP_SECRET"),
                env("PUSHER_APP_ID"),
                $options
            );

            $data['session_id'] = $request->input("session_id");
            $data['message'] = 'New reservation created, refresh current resercation';
            $pusher->trigger('public-channel', 'reservation-created-event', $data);

            return response()->json($bill);
        } catch (\Throwable $th) {
            DB::rollBack();

            return response()->json([
                "message" => __("custom.something-wrong"),
                "data" => $th->getMessage(),
                "trace" => $th->getTrace(),
            ], 500);
        }
    }
}
