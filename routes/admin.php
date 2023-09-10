<?php

use App\Http\Controllers\Api\V1\Admin\UserController;
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
    Route::prefix("admin")->name("admin.")->middleware("auth.admin")->group(function () {
        Route::get("users", [UserController::class, "getAllUsers"])->name("users");
        Route::get("users/{user}", [UserController::class, "getUserInfoWithTrash"])->withTrashed()->name("users.user");
        Route::get("users/{user}/strict", [UserController::class, "getUserInfo"])->name("users.user.strict");
        Route::put("users/{user}/block", [UserController::class, "blockUser"])->name("users.user.block");
        Route::put("users/{user}/unblock", [UserController::class, "unblockUser"])->withTrashed()->name("users.user.unblock");
    });
});
