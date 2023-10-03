<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Helpers\FailedValidateResponse;
use App\Helpers\Logger;
use App\Helpers\Server;
use App\Http\Controllers\Controller;
use App\Http\Requests\V1\Auth\Staff\CreateStaffRequest;
use App\Http\Requests\V1\Auth\Staff\LoginRequest;
use App\Http\Requests\V1\Auth\Staff\StaffChangePasswordRequest;
use App\Http\Requests\V1\Auth\Staff\UpdateInfoRequest;
use App\Models\Configuration;
use App\Models\Staff;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;

class StaffController extends Controller
{

    protected Staff $staff;
    protected Configuration $conf;

    public function __construct()
    {
        $this->staff = new Staff();
        $this->conf = new Configuration();
    }

    public function login(LoginRequest $request)
    {
        try {
            $staff = $request->user('staff');

            if (isset($staff)) {
                $staff->token()->revoke();
            }

            $staff = $this->staff->where("email", $request->input("email"))->first();

            $is_authenticated = Hash::check($request->input("password"), $staff->password);

            if ($is_authenticated === false) {
                return FailedValidateResponse::send([
                    "authentication" => __("custom.wrong-email-password")
                ]);
            }

            $token = $staff->createToken(Staff::AUTH_TOKEN_NAME)->accessToken;

            Logger::write("passport", "Login IP address: " . Server::getUserIP(), Logger::STATUS_INFO, $staff->id, Logger::ROLE_STAFF, $request->getRequestUri());

            return response()->json([
                "token" => $token,
                "token_type" => "Bearer",
                "message" => __("custom.login-success"),
                "staff" => $staff,
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                "message" => __("custom.login-failed"),
                "data" => $th->getMessage(),
                "trace" => $th->getTrace(),
            ], 500);
        }
    }

    public function logout(Request $request)
    {
        $staff = $request->user('staff');

        Logger::write("passport", "Logout IP address: " . Server::getUserIP(), Logger::STATUS_INFO, $staff->id, Logger::ROLE_STAFF, $request->getRequestUri());

        $staff->token()->revoke();

        return response()->json([
            "message" => __("custom.logout-success"),
        ]);
    }

    public function register(CreateStaffRequest $request)
    {
        $conf = $this->conf->where("key", Configuration::DEFAULT_STAFF_PASSWORD_KEY)->first();
        $default_password = $conf->value;

        $staff = new Staff();
        $staff->name = $request->input("name");
        $staff->email = $request->input("email");
        $staff->email_verified_at = now();
        $staff->password = Hash::make($default_password);
        $staff->remember_token = Str::random(10);
        $staff->phone = $request->input("phone");
        $staff->address = $request->input("address");
        $staff->date_of_birth = $request->input("date_of_birth");
        $staff->role = Staff::ROLE_STAFF;
        $staff->save();
        $staff->refresh();

        return response()->json(compact("staff"));
    }

    public function info(Request $request)
    {
        $staff = $request->user('staff');

        return response()->json(compact("staff"));
    }

    public function changePassword(StaffChangePasswordRequest $request)
    {
        $auth = $request->user('staff');
        $staff = $this->staff->find($auth->id);

        if (Hash::check($request->input("password"), $staff->password)) {
            $staff->password = Hash::make($request->input("new_password"));
            $staff->save();
            $staff->refresh();

            return response()->json(compact("staff"));
        }

        return FailedValidateResponse::send([
            "password" => __("custom.password-incorrect")
        ]);
    }

    public function resetPassword(Staff $staff)
    {
        $conf = $this->conf->where("key", Configuration::DEFAULT_STAFF_PASSWORD_KEY)->first();
        $default_password = $conf->value;

        $staff->password = Hash::make($default_password);
        $staff->save();
        $staff->refresh();

        return response()->json(compact("staff"));
    }

    public function updateInfo(UpdateInfoRequest $request)
    {
        $auth = $request->user("staff");
        $staff = $this->staff->find($auth->id);
        $staff->name = $request->input("name");
        $staff->phone = $request->input("phone");
        $staff->address = $request->input("address");
        $staff->date_of_birth = $request->input("date_of_birth");
        $staff->save();
        $staff->refresh();

        return response()->json(compact("staff"));
    }
}
