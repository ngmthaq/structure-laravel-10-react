<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Helpers\FailedValidateResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\V1\Admin\CreateTableRequest;
use App\Models\Table;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TableController extends Controller
{
    protected Table $table;

    public function __construct()
    {
        $this->table = new Table();
    }

    public function getAllTables()
    {
        $tables = $this->table->with('seats')->withTrashed()->get();

        return response()->json($tables);
    }

    public function createTable(CreateTableRequest $request)
    {
        try {
            DB::beginTransaction();
            $table = new Table();
            $table->position_x = 100;
            $table->position_y = 100;
            $table->is_block = false;
            $table->type = $request->input("type");
            $table->direction = $request->input("dir");
            $table->save();
            for ($i = 0; $i < $request->input('seats'); $i++) {
                $table->seats()->create([]);
            }
            $table->refresh();
            $table = $this->table->with('seats')->find($table->id);
            DB::commit();

            return response()->json($table);
        } catch (\Throwable $th) {
            DB::rollBack();

            return FailedValidateResponse::send([
                "error" => __("custom.something-wrong"),
                "message" => $th->getMessage(),
            ]);
        }
    }

    public function changeTablePosition(Request $request, Table $table)
    {
        if ($request->input('x')) {
            $table->position_x = $request->input('x');
        }

        if ($request->input('y')) {
            $table->position_y = $request->input('y');
        }

        $table->save();

        return response()->json($table);
    }

    public function deleteTable(Table $table)
    {
        try {
            DB::beginTransaction();
            $table->seats()->delete();
            $table->delete();
            DB::commit();

            return response()->json(["deleted" => true]);
        } catch (\Throwable $th) {
            DB::rollBack();

            return FailedValidateResponse::send([
                "error" => __("custom.something-wrong"),
                "message" => $th->getMessage(),
            ]);
        }
    }

    public function restoreTable(Table $table)
    {
        try {
            DB::beginTransaction();
            $table->restore();
            $table->seats()->withTrashed()->restore();
            DB::commit();

            return response()->json(["restored" => true]);
        } catch (\Throwable $th) {
            DB::rollBack();

            return FailedValidateResponse::send([
                "error" => __("custom.something-wrong"),
                "message" => $th->getMessage(),
            ]);
        }
    }

    public function updateTable(Request $request, Table $table)
    {
        try {
            DB::beginTransaction();
            $table->is_block = $request->input("is_block");
            $table->type = $request->input("type");
            $table->direction = $request->input("direction");
            $table->save();

            $table->seats()->forceDelete();

            for ($i = 0; $i < $request->input('seat_number'); $i++) {
                $table->seats()->create([]);
            }

            $table->refresh();
            $table = $this->table->with('seats')->find($table->id);
            DB::commit();

            return response()->json($table);
        } catch (\Throwable $th) {
            DB::rollBack();

            return FailedValidateResponse::send([
                "error" => __("custom.something-wrong"),
                "message" => $th->getMessage(),
            ]);
        }
    }
}
