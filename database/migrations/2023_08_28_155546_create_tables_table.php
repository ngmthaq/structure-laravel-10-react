<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tables', function (Blueprint $table) {
            $table->id();
            $table->double('position_x');
            $table->double('position_y');
            $table->tinyInteger('is_block')->comment('0: not blocked | 1: blocked');
            $table->tinyInteger('type')->comment('0: square | 1: circle');
            $table->tinyInteger('direction')->comment('0: horizontal | 1: vertical');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tables');
    }
};
