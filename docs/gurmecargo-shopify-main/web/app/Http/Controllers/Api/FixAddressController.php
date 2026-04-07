<?php

namespace App\Http\Controllers\Api;

use App\Services\CargoSAAS\ApiRequests;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class FixAddressController extends Controller
{
    public function fixAddress(Request $request)
    {
        $request->validate([
            'address' => 'nullable|string',
            'district' => 'nullable|string',
            'city' => 'nullable|string',
            'country' => 'nullable|string',
        ]);

        $response = (new ApiRequests())->fixAddress($request->all());

        return response()->json($response);
    }
}
