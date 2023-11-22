<?php

namespace App\Rules;

use App\Models\User;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class UserIsNotBlockedRule implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $user = User::withTrashed()->where("phone", $value)->first();
        if (isset($user) && $user->deleted_at !== null) {
            $fail('This user is blocked in our system. Please contact to the administrator to get more information.');
        }
    }
}
