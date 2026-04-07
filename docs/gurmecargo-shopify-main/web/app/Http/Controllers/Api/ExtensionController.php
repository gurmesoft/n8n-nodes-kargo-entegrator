<?php

namespace App\Http\Controllers\Api;

use App\Services\Shopify;
use App\Services\ValidateAddress\Client;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Services\CargoSAAS\ApiRequests;
use Illuminate\Validation\ValidationException;
use Osiset\ShopifyApp\Objects\Values\ShopDomain;
use Osiset\ShopifyApp\Contracts\Queries\Shop as IShopQuery;

class ExtensionController extends Controller
{
    /**
     * Sipariş bilgilerini tracking için getirir
     */
    public function getOrder(Request $request, IShopQuery $shopQuery)
    {
        try {
            $validated = $request->validate([
                'orderId' => 'required|string',
                'email' => 'required|email',
            ], [
                'orderId.required' => 'Sipariş numarası gereklidir.',
                'email.required' => 'E-mail adresi gereklidir.',
                'email.email' => 'Geçerli bir e-mail adresi giriniz.',
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'error' => collect($e->errors())->flatten()->first(),
            ], 422);
        }

        $orderId = $validated['orderId'];
        $email = $validated['email'];

        $domain = ShopDomain::fromNative($request->get('shop'));
        $user = $shopQuery->getByDomain($domain);
        $data = $user->shipments()
            ->where(function ($query) use ($orderId) {
                $query->where('shipment->platform_d_id', '=', $orderId)
                      ->orWhere('shipment->platform_d_id', '=', '#' . $orderId);
            })
            ->where('shipment->receiver->email', '=', $email)
            ->get();

        if ($data->isEmpty()) {
            return response()->json([
                'error' => 'Gönderi Bulunamadı.',
            ], 404);
        }

        return response()->json([
            'data' => $data,
        ], 200);
    }

    public function getAddress(Request $request)
    {
        $aiUsed = false;
        $response = [
            'address' => '',
            'district' => '',
            'city' => '',
            'country' => '',
        ];
        $validated = $request->validate([
            'address' => 'nullable|string',
            'district' => 'nullable|string',
            'city' => 'nullable|string',
            'country' => 'nullable|string',
            'use_ai' => 'boolean',
        ]);
        try {
            if ($validated['use_ai']) {
                $ai = fixCustomerAddress($validated, $request->user()->api_key);
                if (is_array($ai) && !empty($ai) && $ai['formattedAddress']) {
                    $response = [
                        'address' => $ai['formattedAddress']['fullAddress'],
                        'district' => $ai['formattedAddress']['district'],
                        'city' => $ai['formattedAddress']['city'],
                        'country' => $ai['formattedAddress']['country'],
                    ];
                    $aiUsed = true;
                }
            }


            if ($aiUsed === false) {
                $response = (new Client($validated['address'], $validated['district'], $validated['city'], $validated['country']))->validate();
            }

            return response()->json([
                'data' => $response,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
            ], 422);
        }
    }

    public function storeAddress(Request $request)
    {
        $request->user()->validatedAddresses()->create($request->all());

        return response()->json([
            'success' => true,
        ], 200);
    }
}
