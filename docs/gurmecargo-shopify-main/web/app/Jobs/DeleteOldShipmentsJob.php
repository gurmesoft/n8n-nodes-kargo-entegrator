<?php

namespace App\Jobs;

use App\Models\Returned;
use App\Models\Shipment;
use App\Models\Webhook;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class DeleteOldShipmentsJob implements ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    /**
     * Dbde tutulacak gün sayısı
     *
     * @var int
     */
    protected $daysToKeep = 90;

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $deleteDate = Carbon::now()->subDays($this->daysToKeep);

        $shipmentIds = Shipment::withTrashed()->where('created_at', '<', $deleteDate)
            ->pluck('id')->toArray();

        if (! empty($shipmentIds)) {
            try {
                Webhook::whereIn('user_id', function ($query) use ($shipmentIds) {
                    $query->select('user_id')
                        ->from('shipments')
                        ->whereIn('id', $shipmentIds);
                })->delete();

                Shipment::whereIn('id', $shipmentIds)->forceDelete();
            } catch (\Exception $e) {
                throw $e;
            }
        }

        $returnedIds = Returned::withTrashed()->where('created_at', '<', $deleteDate)
            ->pluck('id')->toArray();

        if (! empty($returnedIds)) {
            try {
                Webhook::whereIn('user_id', function ($query) use ($returnedIds) {
                    $query->select('user_id')
                        ->from('returneds')
                        ->whereIn('id', $returnedIds);
                })->delete();

                Returned::whereIn('id', $returnedIds)->forceDelete();
            } catch (\Exception $e) {
                throw $e;
            }
        }

        Shipment::where('created_at', '<', Carbon::now()->subDays(15))
            ->tap(function ($query) {
                $this->deleteRelatedWebhooks($query);
            })
            ->delete();

        Returned::where('created_at', '<', Carbon::now()->subDays(15))
            ->tap(function ($query) {
                $this->deleteRelatedWebhooks($query, 'returned');
            })
            ->delete();
    }

    /**
     * Kayıtlara ait webhook'ları silen fonksiyon
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @param  string  $type
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function deleteRelatedWebhooks($query, $type = 'shipment')
    {
        $userIds = $query->pluck('user_id')->unique()->toArray();

        if (! empty($userIds)) {
            Webhook::whereIn('user_id', $userIds)->delete();
        }

        return $query;
    }
}
