<?php

namespace App\Http\Controllers\Web;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class ApiKeyCallbackController extends Controller
{
    /**
     * SaaS uygulamasından gelen API key'i alıp veritabanına kaydeder.
     */
    public function callback(Request $request)
    {
        $shop = $request->input('shop');
        $apiKey = $request->input('api_key');

        $user = User::where('name', $shop)->first();

        $user->update(['api_key' => $apiKey]);

        syncSaasSetting($user, true);

        return redirect()->route('index');
    }

    /**
     * SaaS uygulamasına yönlendirme URL'i oluşturur.
     */
    public function redirect(Request $request)
    {
        $shop = $request->user()->name;
        $callbackUrl = route('api-key.callback') . '?shop=' . urlencode($shop);

        $saasBaseUrl = config('app.env') !== 'production'
            ? 'https://staging.kargoentegrator.com'
            : 'https://app.kargoentegrator.com';

        $webhookUrl = route('sync-webhook', ['user' => $request->user()->id]) . '?shop=' . urlencode($shop);
        $redirectUrl = $saasBaseUrl . '/api-key?redirect_url=' . urlencode($callbackUrl) . '&webhook_url=' . urlencode($webhookUrl);

        return response()->json(['redirect_url' => $redirectUrl]);
    }
}
