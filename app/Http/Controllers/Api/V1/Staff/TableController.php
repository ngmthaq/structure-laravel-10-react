<?php

namespace App\Http\Controllers\Api\V1\Staff;

use App\Http\Controllers\Controller;
use App\Http\Requests\V1\Staff\GetAvailableTablesRequest;
use App\Models\Bill;
use App\Models\Seat;
use App\Models\Table;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

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

        $bills = $bills->filter(function ($bill) {
            return $bill->cancel_at === null;
        });

        $bills = $bills->map(function ($bill) {
            if ($bill->completed_at === null) {
                if (Carbon::now()->greaterThanOrEqualTo(Carbon::createFromTimeString($bill->end_at))) {
                    $bill->handle_end_at = Carbon::now()->addMinutes(5)->toAtomString();
                } else {
                    $bill->handle_end_at = $bill->end_at;
                }
            } else {
                $bill->handle_end_at = $bill->completed_at;
            }

            return $bill;
        });

        $bills = $bills->filter(function ($bill) use ($request) {
            return (
                (strtotime($bill->start_at) < strtotime($request->query("finish_time"))
                    && strtotime($bill->start_at) > strtotime($request->query("start_time")))
                || (strtotime($bill->handle_end_at) > strtotime($request->query("start_time"))
                    && strtotime($bill->handle_end_at) < strtotime($request->query("finish_time")))
                || (strtotime($bill->start_at) < strtotime($request->query("start_time"))
                    && strtotime($bill->handle_end_at) > strtotime($request->query("finish_time")))
                || (strtotime($bill->start_at) > strtotime($request->query("start_time"))
                    && strtotime($bill->handle_end_at) < strtotime($request->query("finish_time")))
            );
        });

        $seated_ids = $bills->map(function ($bill) {
            return $bill->seats->map(function ($seat) {
                return $seat->id;
            });
        })->flatten();

        $tables = $this->table->with(["seats", "seats.bills", "seats.bills.user", "seats.bills.staff"])->get();

        $tables = $tables->map(function ($table) use ($seated_ids) {
            $table->seats = $table->seats->map(function ($seat) use ($seated_ids) {
                $seat->is_seated = $seated_ids->contains($seat->id);
                return $seat;
            });

            $table->bills = $table->seats
                ->map(function ($seat) {
                    return $seat->bills;
                })->flatten()
                ->unique("id")
                ->filter(function ($bill) {
                    return $bill->cancel_at === null && $bill->completed_at === null;
                })
                ->sortBy('start_at')
                ->values();

            return $table;
        });

        return response()->json($tables);
    }
}
