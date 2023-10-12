<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\V1\Admin\CreateUserRequest;
use App\Mail\AdminCreateUserEmail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

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

    public function create(CreateUserRequest $request)
    {
        $user = new User();
        $password = Str::random();
        $user->name = $request->input("name");
        $user->email = $request->input("email");
        $user->phone = $request->input("phone");
        $user->address = $request->input("address");
        $user->date_of_birth = $request->input("date_of_birth");
        $user->password = Hash::make($password);
        $user->remember_token = Str::random(10);
        $user->email_verified_at = now();
        $user->save();
        $user->refresh();

        Mail::to($user->email)->send(new AdminCreateUserEmail($user, $password));

        return response()->json($user);
    }
}
