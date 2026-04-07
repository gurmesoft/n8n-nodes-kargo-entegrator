<?php

namespace App\Http\Controllers\Web;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Inertia\Inertia;

class OtherProductsController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('other-products/index');
    }
}