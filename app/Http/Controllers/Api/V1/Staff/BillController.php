<?php

namespace App\Http\Controllers\Api\V1\Staff;

use App\Http\Controllers\Controller;
use App\Http\Requests\V1\Bill\StaffCreateBillRequest;
use App\Models\Bill;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class BillController extends Controller
{
    protected Bill $bill;

    public function __construct()
    {
        $this->bill = new Bill();
    }

    public function create(StaffCreateBillRequest $request)
    {
        try {
            DB::beginTransaction();

            $bill = new Bill();
            $bill->user_id = $request->input("user_id");
            $bill->start_at = $request->input("start_at");
            $bill->end_at = $request->input("end_at");
            $bill->confirmed_at = Carbon::now();
            $bill->adults = $request->input("adults");
            $bill->children = $request->input("children");
            $bill->staff_id = request()->user('staff')->id;
            $bill->save();

            foreach ($request->input("available_seats") as $seat) {
                $bill->seats()->attach(["seat_id" => $seat]);
            }

            $bill->refresh();

            DB::commit();

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
