<?php

use App\Http\Controllers\Api\V1\Admin\ConfigurationController;
use App\Http\Controllers\Api\V1\Staff\TableController;
use App\Http\Controllers\Api\V1\Staff\UserController;
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

Route::prefix("v1/staffs")->name("api.v1.staffs")->middleware("auth.staff")->group(function () {
    Route::get("/users/filter", [UserController::class, "getUsers"])->name("getUsers");
    Route::get("/users/create", [UserController::class, "quickCreateUser"])->name("quickCreateUser");
    Route::get("/tables/available", [TableController::class, "getAvailableTables"])->name("getAvailableTables");
});
