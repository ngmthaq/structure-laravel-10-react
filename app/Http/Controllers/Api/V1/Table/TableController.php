<?php

namespace App\Http\Controllers\Api\V1\Table;

use App\Http\Controllers\Controller;
use App\Http\Requests\V1\Auth\Staff\LoginRequest;
use App\Models\Configuration;
use App\Models\Table;

class TableController extends Controller
{
    //
    protected Table $table;
    protected Configuration $conf;

    public function __construct()
    {
        $this->table = new Table();
        $this->conf = new Configuration();
    }
    public function getTableManager(TabelManagerRequest $request) {
        try {
            $table = $this->table;

        } catch (\Throwable $th) {
            return response()->json([
//                "message" => __("custom.login-failed"),
                "message" => "ERROR",
                "data" => $th->getMessage(),
            ], 500);
        }
    }
}
