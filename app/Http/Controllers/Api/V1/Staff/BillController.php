<?php

namespace App\Http\Controllers\Api\V1\Staff;

use App\Http\Controllers\Controller;
use App\Http\Requests\V1\Bill\ChangeStatusRequest;
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

            for ($i = 0; $i < $bill->adults + $bill->children; $i++) {
                $seat = $request->input("available_seats")[$i];
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

    public function getAllBills(Request $request)
    {
        $bills = $this->bill
            ->with([
                "user" => function ($user) {
                    $user->withTrashed();
                },
                "staff" => function ($staff) {
                    $staff->withTrashed();
                },
                "seats",
                "seats.table" => function ($table) {
                    $table->withTrashed();
                },
            ])
            ->whereDay("created_at", new Carbon($request->query("date")) ?? Carbon::now())
            ->orderByDesc("id")
            ->get();

        $bills = $bills->map(function ($bill) {
            $bill->tables = array_values(array_unique($bill->seats->pluck("table_id")->toArray()));

            return $bill;
        });

        return response()->json($bills);
    }

    public function changeStatus(ChangeStatusRequest $request, Bill $bill)
    {
        $type = $request->input("type");
        $bill->$type = Carbon::now();
        $bill->save();
        $bill->refresh();

        return response()->json($bill);
    }
}
