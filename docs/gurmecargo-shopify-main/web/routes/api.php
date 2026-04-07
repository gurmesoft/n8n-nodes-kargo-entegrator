<?php

use App\Http\Controllers\Api;
use Illuminate\Support\Facades\Route;

Route::post('/gcargo-notification', [Api\NotificationController::class, 'shipmentNotification'])->name('service-webhook');
Route::post('/gcargo-returned-notification', [Api\NotificationController::class, 'returnedNotification'])->name('service-returned-webhook');
Route::post('/sync/{user}', [Api\SyncController::class, 'webhook'])->name('sync-webhook');

Route::group(['middleware' => 'auth.flow'], function () {
    Route::post('/gcargo-flow-create-shipment', [Api\FlowController::class, 'createShipment'])->name('service-flow-webhook');
    Route::post('/gcargo-flow-create-returned', [Api\FlowController::class, 'createReturned'])->name('service-flow-returned-webhook');
});

Route::get('/track-extension', [Api\ExtensionController::class, 'getOrder'])->name('track-extension');

Route::middleware([
    'verify.shopify',
])->group(function () {
    Route::post('/print', [Api\PrintController::class, 'print'])->name('print');
    Route::post('/fix-address', [Api\FixAddressController::class, 'fixAddress'])->name('fix-address');
    Route::post('/validate-address/get', [Api\ExtensionController::class, 'getAddress'])->name('validate-address-get-address');
    Route::post('/validate-address/store', [Api\ExtensionController::class, 'storeAddress'])->name('validate-address-store');
});
