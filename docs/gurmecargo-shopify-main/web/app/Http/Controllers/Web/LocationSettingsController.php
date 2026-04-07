<?php

namespace App\Http\Controllers\Web;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class LocationSettingsController extends Controller
{
    /**
     * Düzenleme.
     */
    public function update(Request $request)
    {
        foreach ($request->all() as $location) {
            $request->user()->locationSettings()->updateOrCreate(
                ['location_id' => $location['location_id']],
                $location
            );
        }

        return back(303);
    }
}
