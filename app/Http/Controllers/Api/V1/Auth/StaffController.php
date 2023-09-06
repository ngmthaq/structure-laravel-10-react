<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\V1\Auth\Staff\LoginRequest;
use App\Models\Staff;
use Illuminate\Http\Request;

class StaffController extends Controller
{

    protected Staff $staff;

    public function __construct()
    {
        $this->staff = new Staff();
    }

    public function login(LoginRequest $request)
    {
        try {
            $is_authenticated = auth("staff")->attempt([
                "email" => $request->input("email"),
                "password" => $request->input("password")
            ]);

            if ($is_authenticated === false) {
                return response()->json(["message" => __("custom.unauthorized")], 401);
            }

            $staff = $this->staff->find(auth("staff")->user()->id);
            $token = $staff->createToken(Staff::AUTH_TOKEN_NAME)->plainTextToken;

            return response()->json([
                "token" => $token,
                "token_type" => "Bearer",
                "expired_after" => config("sanctum.expiration"),
                "message" => __("custom.login-success"),
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                "message" => __("custom.login-failed"),
                "data" => $th->getMessage(),
            ], 500);
        }
    }

    public function logout(Request $request)
    {
        $request->user("staff")->currentAccessToken()->delete();
        auth("staff")->logout();

        return response()->json([
            "message" => __("custom.logout-success"),
        ]);
    }

    public function register()
    {
        //
    }

    public function info()
    {
        //
    }

    public function changePassword()
    {
        //
    }

    public function resetPassword()
    {
        //
    }
}
