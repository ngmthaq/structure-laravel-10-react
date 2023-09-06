<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class StaffController extends Controller
{
    public function login()
    {
        return response()->json(["message" => "Test api"]);
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
