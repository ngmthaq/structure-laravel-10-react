<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Storage;

final class FailedValidateResponse
{
    public static function send(array $message_bag, int $status = 422)
    {
        $errors = [];

        foreach ($message_bag as $key => $message) {
            $errors[$key] = [$message];
        }

        return response()->json([
            "message" => __('custom.api-failed-validation'),
            "errors" => $errors,
        ], $status);
    }
}
