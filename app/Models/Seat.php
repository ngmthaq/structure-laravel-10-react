<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Seat extends Model
{
    use HasFactory;

    protected $fillable = [
        'table_id',
    ];

    public function table()
    {
        return $this->belongsTo(Table::class, 'table_id', 'id');
    }

    public function bills()
    {
        return $this->belongsToMany(Bill::class, 'bills_seats', 'seat_id', 'bill_id');
    }
}
