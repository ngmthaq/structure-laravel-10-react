<?php

use App\Http\Controllers\Api\V1\Auth\StaffController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Auth Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// V1 API
Route::prefix("v1")->name("api.v1.")->group(function () {
    // Staff API
    Route::prefix("staff")->name("staff.")->group(function () {
        // GET
        Route::get("info", [StaffController::class, "info"])->middleware("auth.staff")->name("info");

        // POST
        Route::post("login", [StaffController::class, "login"])->name("login");
        Route::post("logout", [StaffController::class, "logout"])->middleware("auth.staff")->name("logout");

        // PUT
        Route::put("password/change", [StaffController::class, "changePassword"])->middleware("auth.staff")->name("password.change");
        Route::put("info/update", [StaffController::class, "updateInfo"])->middleware("auth.staff")->name("info.update");
    });

    // Admin API
    Route::prefix("admin")->name("admin.")->group(function () {
        // POST
        Route::post("staffs/create", [StaffController::class, "register"])->middleware("auth.admin")->name("staffs.create");

        // PUT
        Route::put("staffs/{staff}/password/reset", [StaffController::class, "resetPassword"])->middleware("auth.admin")->name("password.change");
    });

    // User
    Route::prefix("user")->name("user.")->group(function () {
        //
    });
});
