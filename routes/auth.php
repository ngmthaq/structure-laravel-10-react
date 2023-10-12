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

Route::prefix("v1")->name("api.v1.")->group(function () {
    Route::prefix("staff")->name("staff.")->group(function () {
        Route::get("info", [StaffController::class, "info"])->middleware("auth.staff")->name("info");
        Route::post("login", [StaffController::class, "login"])->name("login");
        Route::post("logout", [StaffController::class, "logout"])->middleware("auth.staff")->name("logout");
        Route::put("password/change", [StaffController::class, "changePassword"])->middleware("auth.staff")->name("password.change");
        Route::put("info/update", [StaffController::class, "updateInfo"])->middleware("auth.staff")->name("info.update");
    });
});
