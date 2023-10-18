<?php

namespace App\Http\Controllers\Api\V1\Staff;

use App\Http\Controllers\Controller;
use App\Http\Requests\V1\Staff\GetAvailableTablesRequest;
use App\Models\Bill;
use App\Models\Seat;
use App\Models\Table;
use Illuminate\Http\Request;

class TableController extends Controller
{
    protected Table $table;
    protected Seat $seat;
    protected Bill $bill;

    public function __construct()
    {
        $this->table = new Table();
        $this->seat = new Seat();
        $this->bill = new Bill();
    }

    public function getAvailableTables(GetAvailableTablesRequest $request)
    {
        $bills = $this->bill->with(["seats", "seats.table"])->get();

        $bills = $bills->filter(function ($bill) use ($request) {
            return (
                (strtotime($bill->start_at) < strtotime($request->query("finish_time"))
                    && strtotime($bill->start_at) > strtotime($request->query("start_time")))
                || (strtotime($bill->end_at) > strtotime($request->query("start_time"))
                    && strtotime($bill->end_at) < strtotime($request->query("finish_time")))
                || (strtotime($bill->start_at) < strtotime($request->query("start_time"))
                    && strtotime($bill->end_at) > strtotime($request->query("finish_time")))
                || (strtotime($bill->start_at) > strtotime($request->query("start_time"))
                    && strtotime($bill->end_at) < strtotime($request->query("finish_time")))
            );
        });

        $seated_ids = $bills->map(function ($bill) {
            return $bill->seats->map(function ($seat) {
                return $seat->id;
            });
        });

        $tables = $this->table->with("seats")->get();

        $tables = $tables->map(function ($table) use ($seated_ids) {
            $table->seats = $table->seats->map(function ($seat) use ($seated_ids) {
                $seat->is_seated = in_array($seat->id, $seated_ids->flatten()->unique()->toArray());
            });

            return $table;
        });

        return response()->json($tables);
    }
}
