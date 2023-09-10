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
    public function getAllUsers()
    {
        $users = $this->user->withTrashed()->get();

        return response()->json(compact("users"));
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
