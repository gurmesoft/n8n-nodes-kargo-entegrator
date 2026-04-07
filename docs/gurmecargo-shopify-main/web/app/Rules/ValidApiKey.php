<?php

namespace App\Rules;

use App\Services\CargoSAAS\ApiRequests;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class ValidApiKey implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $response = (new ApiRequests())->checkConnection($value);
        if ($response->status() !== 200) {
            $fail('Lütfen app.kargoentegrator.com\'dan aldığınız geçerli bir API anahtarı girin.');
        }
    }
}
