<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'address',
        'date_of_birth'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function bills()
    {
        return $this->hasMany(Bill::class, 'user_id', 'id');
    }

    public function isBlocked()
    {
        return $this->attributes["deleted_at"] !== null;
    }

    public function separateCreatedAtDate()
    {
        $this->attributes['created_at_year'] = date('Y', strtotime($this->attributes['created_at']));
        $this->attributes['created_at_month'] = date('m', strtotime($this->attributes['created_at']));
        $this->attributes['created_at_day'] = date('d', strtotime($this->attributes['created_at']));
    }
}
