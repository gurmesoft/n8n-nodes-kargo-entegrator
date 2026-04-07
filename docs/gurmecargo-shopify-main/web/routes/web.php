<?php

use App\Http\Controllers\Web;
use Illuminate\Support\Facades\Route;

Route::post('/api-key/callback', [Web\ApiKeyCallbackController::class, 'callback'])
    ->name('api-key.callback');

Route::middleware([
'verify.shopify',
])->group(function () {
    Route::get('/', [Web\DashboardController::class, 'index'])->name('home');
    Route::post('/user/{id}', [Web\UserController::class, 'store'])->name('user.store');
    Route::patch('/user/{id}', [Web\UserController::class, 'update'])->name('user.update');
    Route::middleware([
    'verify.apikey',
    ])->group(function () {
        Route::resource('/shipment', Web\ShipmentController::class)->only(['create', 'store', 'destroy', 'index']);
        Route::resource('/returned', Web\ReturnedController::class)->only(['create', 'store', 'destroy', 'index']);
        Route::get('/bulk-shipment', [Web\BulkShipmentController::class, 'index']);
        Route::prefix('/location-settings')->group(function () {
            Route::get('/', [Web\LocationSettingsController::class, 'edit'])
            ->name('location-settings.edit');
            Route::patch('/', [Web\LocationSettingsController::class, 'update'])
            ->name('location-settings.update');
        });
        Route::resource('/tracking', Web\TrackingController::class)->only(['index', 'store', 'destroy']);
    });
    Route::get('/settings', [Web\SettingsController::class, 'index'])->name('index');
    Route::post('/settings/automatic-shipment', [Web\AutomaticShipmentSettingController::class, 'store']);
    Route::post('/settings/other-settings', [Web\OtherSettingsController::class, 'store']);
    Route::post('/settings/sync', [Web\SettingsController::class, 'sync'])->name('settings.sync');
    Route::get('/api-key/redirect', [Web\ApiKeyCallbackController::class, 'redirect'])->name('api-key.redirect');
    Route::patch('/settings/metafields', [Web\MetafieldSettingsController::class, 'update'])->name('settings.metafields.update');
    Route::patch('/settings/delivery-profile-maps', [Web\DeliveryProfileMapsController::class, 'update'])->name('settings.delivery-profile-maps.update');
    Route::get('/other-products', [Web\OtherProductsController::class, 'index'])->name('other-products.index');
});
