<?php

namespace App\Http\Requests\V1\Auth\Staff;

use App\Http\Requests\ApiRequest;
use Illuminate\Foundation\Http\FormRequest;

class StaffChangePasswordRequest extends ApiRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        $min = env("PASSWORD_MIN_LENGTH");
        $max = env("PASSWORD_MAX_LENGTH");
        $password_rules = implode("|", ["required", "string", "min:" . $min,  "max:" . $max]);

        return [
            "password" => $password_rules,
            "new_password" => $password_rules,
        ];
    }
}
