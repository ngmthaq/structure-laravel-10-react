<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Storage;

final class Logger
{
    public const STATUS_INFO = "INFO";
    public const STATUS_ERROR = "ERROR";
    public const ROLE_USER = "USER";
    public const ROLE_STAFF = "STAFF";

    public static function write(string $name, string $message, string $status = self::STATUS_INFO, string|null $user = null, string|null $role = null, string|null $path = null)
    {
        $date = gmdate("Y-m-d", time());
        $time = gmdate("H:i:s", time()) . " UTC";
        $file_name = $name . "-" . $date . ".log";
        $content = [
            "time" => $time,
            "status" => $status,
            "user" => $user,
            "role" => $role,
            "path" => $path,
            "message" => $message,
        ];
        Storage::disk('log')->append($file_name, json_encode($content));
    }
}
