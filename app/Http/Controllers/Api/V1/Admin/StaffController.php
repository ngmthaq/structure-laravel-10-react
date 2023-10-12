<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Helpers\FailedValidateResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\V1\Admin\UpdateStaffRequest;
use App\Http\Requests\V1\Auth\Staff\CreateStaffRequest;
use App\Models\Configuration;
use App\Models\Staff;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class StaffController extends Controller
{
    protected Staff $staff;
    protected Configuration $configuration;

    public function __construct()
    {
        $this->staff = new Staff();
        $this->configuration = new Configuration();
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
        $staff->name = $request->input("name");
        $staff->phone = $request->input("phone");
        $staff->address = $request->input("address");
        $staff->date_of_birth = $request->input("date_of_birth");
        $staff->role = $request->input("role");

        if ($staff->id === Staff::SUPER_ADMIN_ID) {
            $staff->role = Staff::ROLE_ADMIN;
        }

        $staff->save();
        $staff->refresh();

        return response()->json($staff);
    }

    public function create(CreateStaffRequest $request)
    {
        $password = $this->configuration->where("key", Configuration::DEFAULT_STAFF_PASSWORD_KEY)->first();

        $staff = new Staff();
        $staff->name = $request->input("name");
        $staff->email = $request->input("email");
        $staff->phone = $request->input("phone");
        $staff->address = $request->input("address");
        $staff->date_of_birth = $request->input("date_of_birth");
        $staff->role = $request->input("role");
        $staff->password = Hash::make($password->value);
        $staff->remember_token = Str::random(10);
        $staff->email_verified_at = now();
        $staff->save();
        $staff->refresh();

        return response()->json($staff);
    }

    public function resetPassword(Staff $staff)
    {
        $password = $this->configuration->where("key", Configuration::DEFAULT_STAFF_PASSWORD_KEY)->first();

        $staff->password = Hash::make($password);
        $staff->save();
        $staff->refresh();

        return response()->json($staff);
    }
}
