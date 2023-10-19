<?php

namespace App\Http\Requests\V1\Bill;

use App\Http\Requests\ApiRequest;
use Illuminate\Foundation\Http\FormRequest;

class StaffCreateBillRequest extends ApiRequest
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
            'user_id' => 'required|exists:users,id',
            'start_at' => 'required|date|after_or_equal:today',
            'end_at' => 'required|date|after_or_equal:today',
            'adults' => 'required|integer',
            'children' => 'required|integer',
            'available_seats' => 'required|array',
            'available_seats.*' => 'required|integer',
        ];
    }
}
