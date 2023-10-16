<?php

namespace App\Http\Controllers\Api\V1\Staff;

use App\Http\Controllers\Controller;
use App\Http\Requests\V1\Staff\QuickCreateUserRequest;
use App\Mail\AdminCreateUserEmail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class UserController extends Controller
{
    public User $user;

    public function __construct()
    {
        $this->user = new User();
    }

    public function getUsers(Request $request)
    {
        $builder = $this->user;

        if ($request->query("phone")) {
            $builder = $builder->where("phone", $request->query("phone"));
        }

        $users = $builder->get();

        return response()->json($users);
    }

    public function quickCreateUser(QuickCreateUserRequest $request)
    {
        $user = new User();
        $password = Str::random();
        $user->name = $request->input("name");
        $user->email = $request->input("email");
        $user->phone = $request->input("phone");
        $user->address = fake()->address();
        $user->date_of_birth = fake()->date();
        $user->password = Hash::make($password);
        $user->remember_token = Str::random(10);
        $user->email_verified_at = now();
        $user->save();
        $user->refresh();

        Mail::to($user->email)->send(new AdminCreateUserEmail($user, $password));

        return response()->json($user);
    }
}
