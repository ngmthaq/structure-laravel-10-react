<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Staff extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    public const ROLE_ADMIN = 0;
    public const ROLE_STAFF = 1;

    protected $fillable = [
        'name',
        'email',
        'password',
        'date_of_birth'
    ];

    protected $table = "staffs";

    public function bills()
    {
        return $this->hasMany(Bill::class, 'staff_id', 'id');
    }
}
