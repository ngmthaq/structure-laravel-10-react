<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Bill extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'staff_id',
        'start_at',
        'end_at',
        'user_started_at',
        'completed_at',
        'cancel_at',
        'confirmed_at',
        'adults',
        'children',
    ];

    protected $casts = [
        'start_at' => 'datetime',
        'end_at' => 'datetime',
        'user_started_at' => 'datetime',
        'completed_at' => 'datetime',
        'cancel_at' => 'datetime',
        'confirmed_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function staff()
    {
        return $this->belongsTo(Staff::class, 'staff_id', 'id');
    }

    public function seats()
    {
        return $this->belongsToMany(Seat::class, 'bills_seats', 'bill_id', 'seat_id');
    }
}
