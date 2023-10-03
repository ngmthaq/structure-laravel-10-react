<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Helpers\FailedValidateResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\V1\Admin\UpdateStaffRequest;
use App\Models\Staff;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StaffController extends Controller
{
    protected Staff $staff;

    public function __construct()
    {
        $this->staff = new Staff();
    }
    public function getAllStaffs(Request $request)
    {
        $query_builder = $this->staff->withTrashed();

        $filter = $request->query("filter");

        if (isset($filter)) {
            $query_builder = $query_builder->where("name", "LIKE", "%" . $filter . "%")
                ->orWhere("email", "LIKE", "%" . $filter . "%")
                ->orWhere("phone", "LIKE", "%" . $filter . "%")
                ->orWhere("address", "LIKE", "%" . $filter . "%")
                ->orWhere("date_of_birth", "LIKE", "%" . $filter . "%");
        }

        $sort_col = $request->query("sort_col");
        $sort_dir = $request->query("sort_dir");

        if (isset($sort_col) && isset($sort_dir)) {
            $query_builder = $query_builder->orderBy($sort_col, $sort_dir);
        }

        $page = $request->query("page", 1);
        $limit = $request->query("limit", 25);
        $data = $query_builder->paginate($limit, ["*"], "page", $page);

        return response()->json($data);
    }

    public function getStaffInfoWithTrash(Staff $staff)
    {
        return response()->json($staff);
    }

    public function getStaffInfo(Staff $staff)
    {
        return response()->json($staff);
    }

    public function blockStaff(Staff $staff)
    {
        if ($staff->role === Staff::ROLE_ADMIN) {
            return FailedValidateResponse::send([
                "forbidden" => __("custom.cannot-block-admin")
            ]);
        }

        $staff->delete();

        return response()->json($staff);
    }

    public function unblockStaff(Staff $staff)
    {
        $staff->restore();

        return response()->json($staff);
    }

    public function updateStaffInfo(UpdateStaffRequest $request, Staff $staff)
    {
        DB::beginTransaction();
        $staff->name = $request->input("name");
        $staff->phone = $request->input("phone");
        $staff->address = $request->input("address");
        $staff->date_of_birth = $request->input("date_of_birth");
        $staff->role = $request->input("role");
        $staff->save();
        $staff->refresh();

        $admins = $this->staff->where('role', Staff::ROLE_ADMIN)->get();
        if ($admins->count() > 0) {
            DB::commit();
            return response()->json($staff);
        }

        DB::rollBack();
        return FailedValidateResponse::send([
            "error" => __("custom.cannot-remove-all-admins")
        ]);
    }
}
