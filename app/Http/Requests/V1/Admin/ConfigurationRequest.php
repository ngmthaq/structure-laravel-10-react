<?php

namespace App\Http\Requests\V1\Admin;

use App\Http\Requests\ApiRequest;
use Illuminate\Foundation\Http\FormRequest;

class ConfigurationRequest extends ApiRequest
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
            "default_password" => "required|string|min:8|max:32",
            "app_title" => "required|string",
            "app_name" => "required|string",
            "room_width" => "required|numeric|min:10",
            "room_height" => "required|numeric|min:10",
            "app_favicon" => "nullable|file",
            "app_logo" => "nullable|file",
        ];
    }
}
