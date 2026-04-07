<?php

namespace App\Http\Controllers\Web;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class MetafieldSettingsController extends Controller
{
    public function update(Request $request)
    {
        $user = $request->user();
        $payload = $request->only([
            'name',
            'surname',
            'phone',
            'address',
            'city',
            'district',
            'email',
            'country',
            'desi',
        ]);

        foreach ($payload as $targetField => $value) {
            if ($value === null || $value === '') {
                $user->metafieldSettings()
                    ->where('target_field', $targetField)
                    ->delete();

                continue;
            }

            $user->metafieldSettings()->updateOrCreate(
                [
                    'target_field' => $targetField,
                ],
                [
                    'user_id' => $user->id,
                    'target_field' => $targetField,
                    'metafield_key' => $value,
                ]
            );
        }

        return back(303);
    }
}
