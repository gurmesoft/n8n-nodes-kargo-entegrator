<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Routing\Controller;

class SyncController extends Controller
{
    /**
     * SaaS tarafından sync tetiklenince çağrılır (path: sync/{user}).
     */
    public function webhook(string $userId)
    {
        $user = User::find($userId);

        if ($user) {
            syncSaasSetting($user, true);
        }

        return response()->json(['message' => 'Sync completed']);
    }
}
