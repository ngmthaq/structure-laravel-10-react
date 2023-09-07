<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Helpers\Logger;
use App\Helpers\Server;
use App\Http\Controllers\Controller;
use App\Http\Requests\V1\Auth\Staff\LoginRequest;
use App\Models\Staff;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

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
            $staff = $this->staff->where("email", $request->input("email"))->first();

            $is_authenticated = Hash::check($request->input("password"), $staff->password);

            if ($is_authenticated === false) {
                return response()->json(["message" => __("custom.unauthorized")], 401);
            }

            $token = $staff->createToken(Staff::AUTH_TOKEN_NAME)->accessToken;

            Logger::write("passport", "IP address: " . Server::getUserIP(), Logger::STATUS_INFO, $staff->id, Logger::ROLE_STAFF, $request->getRequestUri());

            return response()->json([
                "token" => $token,
                "token_type" => "Bearer",
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
        $user = $request->user('staff');
        if (isset($user)) {
            $user->token()->revoke();

            return response()->json([
                "message" => __("custom.logout-success"),
            ]);
        }

        return response()->json([
            "message" => __("custom.logout-failed"),
        ], 403);
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
