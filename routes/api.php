<?php

use App\Http\Controllers\Api\V1\Admin\ConfigurationController;
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
    Route::prefix("configurations")->middleware(['auth.staff'])->group(function () {
        Route::get("/get", [ConfigurationController::class, "get"])->name("configurations.get");
        Route::put("/set", [ConfigurationController::class, "set"])->name("configurations.set")->middleware('auth.admin');
    });
});
