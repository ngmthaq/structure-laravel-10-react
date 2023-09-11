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

        $filter = $request->query("filter");

        if (isset($filter)) {
            $query_builder = $query_builder->where("name", "LIKE", "%" . $filter . "%")
                ->orWhere("email", "LIKE", "%" . $filter . "%")
                ->orWhere("phone", "LIKE", "%" . $filter . "%")
                ->orWhere("address", "LIKE", "%" . $filter . "%")
                ->orWhere("date_of_birth", "LIKE", "%" . $filter . "%");
        }

        $sort_col = $request->query('sort_col');
        $sort_dir = $request->query('sort_dir');

        if (isset($sort_col) && isset($sort_dir)) {
            $query_builder = $query_builder->orderBy($sort_col, $sort_dir);
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
