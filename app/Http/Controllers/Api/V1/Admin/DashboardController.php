<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Helpers\FailedValidateResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\V1\Admin\DashboardRequest;
use App\Models\Bill;
use App\Models\Staff;
use App\Models\Table;
use App\Models\User;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public const TYPE_YEAR = 'year';
    public const TYPE_MONTH = 'month';
    public const TYPE_DAY = 'day';
    public const TYPES = [self::TYPE_YEAR, self::TYPE_MONTH, self::TYPE_DAY];

    protected User $user;
    protected Staff $staff;
    protected Table $table;
    protected Bill $bill;

    public function __construct()
    {
        $this->user = new User();
        $this->staff = new Staff();
        $this->table = new Table();
        $this->bill = new Bill();
    }

    public function index(DashboardRequest $request)
    {
        $value = $request->query("time");
        $new_users = $this->getNewUsers($value);
        $new_bills = $this->getNewBills($value);
        $user_reservation_rate = $this->getUserReservationRate($value);
        $table_reservation_rate = $this->getTableReservationRate($value);
        $new_staffs = $this->getNewStaffs($value);
        $fired_staffs = $this->getFiredStaffs($value);

        return response()->json(compact(
            "new_users",
            "new_bills",
            "user_reservation_rate",
            "table_reservation_rate",
            "new_staffs",
            "fired_staffs"
        ));
    }

    protected function getNewUsers(string $year)
    {
        $labels = [];
        $data = [];
        $users = $this->user->whereYear("created_at", $year)->get();

        foreach (__("months") as $key => $month) {
            $labels[] = $month;
            $data[$key] = 0;
        }

        $users->each(function ($user) use (&$data) {
            $month = date("m", strtotime($user->created_at));
            $data[$month] = $data[$month] + 1;
        });

        $data = array_values($data);

        return compact("labels", "data");
    }

    protected function getNewBills(string $year)
    {
        $labels = [];
        $data = [];
        $bills = $this->bill->whereYear("created_at", $year)->get();

        foreach (__("months") as $key => $month) {
            $labels[] = $month;
            $data[$key] = 0;
        }

        $bills->each(function ($bill) use (&$data) {
            $month = date("m", strtotime($bill->created_at));
            $data[$month] = $data[$month] + 1;
        });

        $data = array_values($data);

        return compact("labels", "data");
    }

    protected function getUserReservationRate(string $year)
    {
        $labels = [];
        $data = [];
        $percent = [];
        $colors = [];

        $bills = $this->bill
            ->with("user")
            ->whereYear("created_at", $year)
            ->get();

        foreach ($bills as $bill) {
            $labels[$bill->user->id] = $bill->user->name;
            $colors[$bill->user->id] = $this->color();
            if (empty($data[$bill->user->id])) {
                $data[$bill->user->id] = 1;
            } else {
                $data[$bill->user->id] = $data[$bill->user->id] + 1;
            }
        }

        foreach ($data as $key => $value) {
            $rate = round($value / count($bills) * 100, 2);
            $percent[$key] = $rate;
        }

        $labels = array_values($labels);
        $data = array_values($data);
        $percent = array_values($percent);
        $colors = array_values($colors);

        return compact("labels", "data", "percent", "colors");
    }

    protected function getTableReservationRate(string $year)
    {
        $labels = [];
        $data = [];
        $percent = [];
        $colors = [];

        $bills = $this->bill
            ->with("seats.table")
            ->whereYear("created_at", $year)
            ->get();

        $tables = $bills->reduce(function ($carry, $bill) {
            $seats = $bill->seats;
            $seat_tables = $seats->map(function ($seat) {
                return $seat->table;
            })->unique("id")->toArray();

            $carry = array_merge($carry, $seat_tables);

            return $carry;
        }, []);

        foreach ($tables as $table) {
            $labels[$table["id"]] = "Table " . $table["id"];
            $colors[$table["id"]] = $this->color();
            if (empty($data[$table["id"]])) {
                $data[$table["id"]] = 1;
            } else {
                $data[$table["id"]] = $data[$table["id"]] + 1;
            }
        }

        foreach ($data as $key => $value) {
            $rate = round($value / count($bills) * 100, 2);
            $percent[$key] = $rate;
        }

        $labels = array_values($labels);
        $data = array_values($data);
        $percent = array_values($percent);
        $colors = array_values($colors);

        return compact("labels", "data", "percent", "colors");
    }

    protected function getNewStaffs(string $year)
    {
        $labels = [];
        $data = [];
        $staffs = $this->staff->whereYear("created_at", $year)->get();

        foreach (__("months") as $key => $month) {
            $labels[] = $month;
            $data[$key] = 0;
        }

        $staffs->each(function ($staff) use (&$data) {
            $month = date("m", strtotime($staff->created_at));
            $data[$month] = $data[$month] + 1;
        });

        $data = array_values($data);

        return compact("labels", "data");
    }

    protected function getFiredStaffs(string $year)
    {
        $labels = [];
        $data = [];
        $staffs = $this->staff
            ->withTrashed()
            ->whereYear("deleted_at", $year)
            ->get();

        foreach (__("months") as $key => $month) {
            $labels[] = $month;
            $data[$key] = 0;
        }

        $staffs->each(function ($staff) use (&$data) {
            $month = date("m", strtotime($staff->deleted_at));
            $data[$month] = $data[$month] + 1;
        });

        $data = array_values($data);

        return compact("labels", "data");
    }

    protected function color()
    {
        return sprintf('#%06X', mt_rand(0, 0xFFFFFF));
    }
}
