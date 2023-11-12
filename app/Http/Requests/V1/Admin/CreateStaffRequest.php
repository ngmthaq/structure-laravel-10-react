<?php

namespace App\Http\Requests\V1\Admin;

use App\Http\Requests\ApiRequest;
use Illuminate\Foundation\Http\FormRequest;

class CreateStaffRequest extends ApiRequest
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
        return [
            "name" => "required|string",
            "email" => "required|email|unique:staffs,email",
            "phone" => "required|unique:staffs,phone",
            "date_of_birth" => "required|date",
            "address" => "required",
            "role" => "required"
        ];
    }
}
