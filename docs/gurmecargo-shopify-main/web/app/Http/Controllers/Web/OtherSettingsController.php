<?php

namespace App\Http\Controllers\Web;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class OtherSettingsController extends Controller
{
    public function store(Request $request)
    {
        $request->user()->otherSettings()->updateOrCreate(
            ['user_id' => $request->user()->id],
            [
                'fulfillment_update' => $request->fulfillment_update,
                'barcode_metafield' => $request->barcode_metafield,
                'barcode_number' => $request->barcode_number,
                'barcode_number_format' => $request->barcode_number_format,
                'package_count_enabled' => $request->package_count_enabled,
                'package_count_per_item' => $request->package_count_per_item,
                'desi_sum_enabled' => $request->desi_sum_enabled,
            ]
        );

        return back(303);
    }
}
