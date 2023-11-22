<?php

namespace App\Http\Requests\V1\Staff;

use App\Http\Requests\ApiRequest;
use App\Rules\UserIsNotBlockedRule;
use Illuminate\Foundation\Http\FormRequest;

class QuickCreateUserRequest extends FormRequest
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
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "name" => "required",
            "phone" => ["required", new UserIsNotBlockedRule, "unique:users,phone"],
        ];
    }
}
