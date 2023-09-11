<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    protected User $user;

    public function __construct()
    {
        $this->user = new User();
    }
    public function getAllUsers(Request $request)
    {
        $query_builder = $this->user->withTrashed();

        $name = $request->query("name");
        if (isset($name)) {
            $query_builder->where("name", "LIKE", "%" . $name . "%");
        }

        $email = $request->query("email");
        if (isset($email)) {
            $query_builder->where("email", "LIKE", "%" . $email . "%");
        }

        $phone = $request->query("phone");
        if (isset($phone)) {
            $query_builder->where("phone", "LIKE", "%" . $phone . "%");
        }

        $address = $request->query("address");
        if (isset($address)) {
            $query_builder->where("address", "LIKE", "%" . $address . "%");
        }

        $date_of_birth = $request->query("date_of_birth");
        if (isset($date_of_birth)) {
            $query_builder->where("date_of_birth", "LIKE", "%" . $date_of_birth . "%");
        }

        $page = $request->query("page", 1);
        $limit = $request->query("limit", 25);
        $data = $query_builder->paginate($limit, ["*"], 'page', $page);

        return response()->json($data);
    }

    public function getUserInfoWithTrash(User $user)
    {
        return response()->json($user);
    }

    public function getUserInfo(User $user)
    {
        return response()->json($user);
    }

    public function blockUser(User $user)
    {
        $user->delete();

        return response()->json($user);
    }

    public function unblockUser(User $user)
    {
        $user->restore();

        return response()->json($user);
    }
}
