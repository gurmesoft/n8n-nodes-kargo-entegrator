<?php

namespace App\Http\Controllers\Web;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class AutomaticShipmentSettingController extends Controller
{
    public function store(Request $request)
    {
        $request->user()->automaticShipmentSetting()->updateOrCreate(
            ['user_id' => $request->user()->id],
            [
                'is_enabled' => $request->is_enabled,
                'delay' => $request->delay,
                'fix_address' => $request->fix_address,
            ]
        );

        return back(303);
    }
}
