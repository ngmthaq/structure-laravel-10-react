<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Table extends Model
{
    use HasFactory, SoftDeletes;

    public const TABLE_TYPE_SQUARE = 0;
    public const TABLE_TYPE_CIRCLE = 1;
    public const TABLE_DIR_HORIZONTAL = 0;
    public const TABLE_DIR_VERTICAL = 1;

    protected $fillable = [
        'position_x',
        'position_y',
        'is_block',
        'type',
        'direction',
    ];

    protected $casts = [
        'is_block' => 'boolean',
    ];

    /**
     * Has many seats
     */
    public function seats()
    {
        return $this->hasMany(Seat::class, 'table_id', 'id');
    }
}
