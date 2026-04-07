<?php

namespace App\Http\Controllers\Web;

use App\Http\Requests\User\Store;
use App\Http\Requests\User\Update;
use Illuminate\Routing\Controller;

class UserController extends Controller
{
    public function store(Store $request)
    {
        $request->user()->update($request->all());

        syncSaasSetting($request->user(), true);

        return back(303);
    }

    public function update(Update $request)
    {
        $request->user()->update($request->all());

        return back(303);
    }
}
