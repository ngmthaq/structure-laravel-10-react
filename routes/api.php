<?php

use App\Http\Controllers\Api\V1\Admin\ConfigurationController;
use App\Http\Controllers\Api\V1\Staff\BillController;
use App\Http\Controllers\Api\V1\Staff\TableController;
use App\Http\Controllers\Api\V1\User\ReservationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::prefix("v1")->name("api.v1.")->group(function () {
    Route::prefix("configurations")->group(function () {
        Route::get("/get", [ConfigurationController::class, "get"])->name("configurations.get");
        Route::put("/set", [ConfigurationController::class, "set"])->name("configurations.set")->middleware('auth.admin');
    });

    Route::prefix("users")->group(function () {
        Route::get("/find/phone", [ReservationController::class, "findByPhone"]);
        Route::post("/reservations/create", [ReservationController::class, "create"]);
    });

    Route::prefix("staffs")->name("admin.")->group(function () {
        Route::get("/tables/available", [TableController::class, "getAvailableTables"])->name("getAvailableTables");
        Route::post("/reservations/create", [BillController::class, "create"])->name("createReservation");
    });
});
