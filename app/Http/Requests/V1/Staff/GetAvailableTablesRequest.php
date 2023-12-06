<?php

namespace App\Http\Requests\V1\Staff;

use App\Http\Requests\ApiRequest;
use Illuminate\Foundation\Http\FormRequest;

class GetAvailableTablesRequest extends ApiRequest
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
        if (request()->input('novalidate')) {
            return [];
        }
        $now = date("Y-m-d H:i");
        return [
            "start_time" => "required|date|after_or_equal:" . $now,
            "finish_time" => "required|date|after_or_equal:start_time",
        ];
    }
}
