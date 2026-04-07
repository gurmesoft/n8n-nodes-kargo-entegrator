<?php

namespace App\Http\Controllers\Web;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class DeliveryProfileMapsController extends Controller
{
    public function update(Request $request)
    {
        $validated = $request->validate([
            'data' => 'sometimes|array',
            'data.*.profile' => 'required_with:data',
            'data.*.cargo_integration_id' => 'required_with:data',
            'data.*.package_type' => 'required_with:data',
            'data.*.payor_type' => 'required_with:data',
            'data.*.payment_type' => 'required_with:data',
        ], [
            'data.*.profile.required_with' => 'Gönderim profili boş bırakılamaz.',
            'data.*.cargo_integration_id.required_with' => 'Kargo hesabı boş bırakılamaz.',
            'data.*.package_type.required_with' => 'Paket tipi boş bırakılamaz.',
            'data.*.payor_type.required_with' => 'Ödeme yapacak taraf boş bırakılamaz.',
            'data.*.payment_type.required_with' => 'Ödeme tipi boş bırakılamaz.',
        ]);

        $request->user()->deliveryProfileMaps()->delete();

        if ($request->has('data')) {
            $request->user()->deliveryProfileMaps()->createMany($validated['data']);
        }
        return back(303);
    }
}
