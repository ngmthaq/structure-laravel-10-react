<?php

use App\Http\Controllers\Api\V1\Table\TableController;
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
    Route::get("table/manager", [TableController::class, "getTableManager"])->name("table.manager");
});
