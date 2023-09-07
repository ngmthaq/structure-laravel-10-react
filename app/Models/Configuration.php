<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Configuration extends Model
{
    use HasFactory, SoftDeletes;

    // Verify new user configs
    public const VERIFY_NEW_USER_KEY = "VERIFY_NEW_USER_KEY";
    public const VERIFY_NEW_USER_ENABLE = "VERIFY_NEW_USER_ENABLE";
    public const VERIFY_NEW_USER_DISABLE = "VERIFY_NEW_USER_DISABLE";
    public const DEFAULT_STAFF_PASSWORD_KEY = "DEFAULT_STAFF_PASSWORD_KEY";
    public const SPA_DOCUMENT_TITLE_KEY = "SPA_DOCUMENT_TITLE_KEY";
    public const SPA_DOCUMENT_FAVICON_KEY = "SPA_DOCUMENT_FAVICON_KEY";

    protected $fillable = [
        'key',
        'value'
    ];
}
