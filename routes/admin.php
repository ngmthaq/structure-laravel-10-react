<?php

use App\Http\Controllers\Api\V1\Admin\DashboardController;
use App\Http\Controllers\Api\V1\Admin\StaffController;
use App\Http\Controllers\Api\V1\Admin\TableController;
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
        Route::prefix("users")->group(function () {
            Route::get("/", [UserController::class, "getAllUsers"])->name("users");
            Route::get("/{user}", [UserController::class, "getUserInfoWithTrash"])->withTrashed()->name("users.user");
            Route::get("/{user}/strict", [UserController::class, "getUserInfo"])->name("users.user.strict");
            Route::put("/{user}/block", [UserController::class, "blockUser"])->name("users.user.block");
            Route::put("/{user}/unblock", [UserController::class, "unblockUser"])->withTrashed()->name("users.user.unblock");
            Route::post("/create", [UserController::class, "create"])->name("users.create");
        });

        Route::prefix("staffs")->group(function () {
            Route::get("/", [StaffController::class, "getAllStaffs"])->name("staffs");
            Route::get("/{staff}", [StaffController::class, "getStaffInfoWithTrash"])->withTrashed()->name("staffs.staff");
            Route::get("/{staff}/strict", [StaffController::class, "getStaffInfo"])->name("staffs.staff.strict");
            Route::put("/{staff}/block", [StaffController::class, "blockStaff"])->withTrashed()->name("staffs.staff.block");
            Route::put("/{staff}/unblock", [StaffController::class, "unblockStaff"])->withTrashed()->name("staffs.staff.unblock");
            Route::put("/{staff}/update", [StaffController::class, "updateStaffInfo"])->withTrashed()->name("staffs.staff.update");
            Route::put("/{staff}/password/reset", [StaffController::class, "resetPassword"])->name("staffs.staff.password.reset");
            Route::post("/create", [StaffController::class, "create"])->name("staffs.create");
        });

        Route::prefix("dashboard")->group(function () {
            Route::get("/", [DashboardController::class, "index"])->name("dashboard.index");
        });

        Route::prefix("tables")->group(function () {
            Route::get("/", [TableController::class, "getAllTables"])->name("tables.getAllTables");
            Route::put("/{table}/position/update", [TableController::class, "changeTablePosition"])->name("tables.changeTablePosition");
            Route::put("/{table}/restore", [TableController::class, "restoreTable"])->withTrashed()->name("tables.restore");
            Route::post("/create", [TableController::class, "createTable"])->name("tables.create");
            Route::delete("/{table}/delete", [TableController::class, "deleteTable"])->name("tables.delete");
        });
    });
});
