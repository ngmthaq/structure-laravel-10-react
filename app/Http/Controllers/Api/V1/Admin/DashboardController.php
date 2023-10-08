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
        if (!in_array($request->query("view_by"), self::TYPES)) {
            return FailedValidateResponse::send([
                "error" => __("custom.choose-correct-input-value"),
            ]);
        }

        $type = $request->query("view_by");
        $value = $request->query("time");

        $new_users = $this->getNewUsers($type, $value);

        return response()->json($new_users);
    }

    protected function getNewUsers(string $type, string $value)
    {
        $builder = $this->user;

        $year = date("Y", strtotime($value));
        $month = date("m", strtotime($value));

        if ($type === self::TYPE_DAY) {
            $builder = $builder->whereDate('created_at', '=', $value);
        }

        if ($type === self::TYPE_MONTH) {
            $builder = $builder->whereMonth('created_at', '=', $month)->whereYear('created_at', '=', $year);
        }

        if ($type === self::TYPE_YEAR) {
            $builder = $builder->whereYear('created_at', '=', $year);
        }

        $users = $builder->get();
        $users->each(fn (User $user) => $user->separateCreatedAtDate());

        $output = ["labels" => [], "data" => []];

        if ($type === self::TYPE_DAY) {
            $day = date("d", strtotime($value));
            $output['labels'] = [$day];
            $output['data'] = [$users->count()];
        }

        if ($type === self::TYPE_MONTH) {
            $labels = $users->countBy(fn (User $user) => (int)$user->created_at_day);
            $output['labels'] = array_map(fn (int $label) => $label < 10 ? "0" . $label : $label, array_keys($labels->all()));
            $output['data'] = array_values($labels->all());
        }

        if ($type === self::TYPE_YEAR) {
            $labels = $users->sortBy('created_at_month')->countBy(fn (User $user) => (int)$user->created_at_month);
            $output['labels'] = array_map(fn (int $label) => __("months." . $label), array_keys($labels->all()));
            $output['data'] = array_values($labels->all());
        }

        return $output;
    }
}
