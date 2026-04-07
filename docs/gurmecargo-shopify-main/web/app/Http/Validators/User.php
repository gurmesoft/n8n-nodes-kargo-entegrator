<?php

namespace App\Http\Validators;

use App\Rules;

class User
{
    public static function store(): array
    {
        return [
            'api_key' => ['required', 'string', new Rules\ValidApiKey()],
        ];
    }

    public static function update(): array
    {
        return [
            'api_key' => ['nullable', 'string'],
        ];
    }

    public static function messages(): array
    {
        return [
            'api_key.required' => 'API anahtarı boş bırakılamaz.',
        ];
    }
}
