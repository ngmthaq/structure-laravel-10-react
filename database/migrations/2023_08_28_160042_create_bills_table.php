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
        Schema::create('bills', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id');
            $table->foreignId('staff_id')->nullable();
            $table->timestamp('start_at');
            $table->timestamp('end_at');
            $table->timestamp('user_started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamp('cancel_at')->nullable();
            $table->timestamp('confirmed_at')->nullable();
            $table->integer('adults');
            $table->integer('children');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bills');
    }
};
