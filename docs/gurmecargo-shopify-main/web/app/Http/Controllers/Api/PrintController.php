<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class PrintController extends Controller
{
    /**
     * Listeleme.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function print(Request $request)
    {
        $type = $request->get('type');
        $ids = $request->get('ids');

        $apiService = new \App\Services\CargoSAAS\ApiRequests();
        $printResult = $apiService->print($ids, $type);

        return response()->json([
            'print' => $printResult,
        ], 200);
    }
}
