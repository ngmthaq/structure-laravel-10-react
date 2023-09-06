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
        Route::post("login", [StaffController::class, "login"])->name("login");
    });

    // User
    Route::prefix("user")->name("user.")->group(function () {
        //
    });
});
