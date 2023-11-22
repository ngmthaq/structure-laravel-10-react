<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ClearOverstay extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:clear-overstay';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Daily clear overstay tables';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $date = Carbon::now()->format('Y-m-d');
        $time = Carbon::now()->toTimeString();
        DB::table("bills")
            ->whereDate("end_at", "<=", $date)
            ->whereTime("end_at", "<", $time)
            ->whereNull("completed_at")
            ->update(["cancel_at" => Carbon::now()]);
    }
}
