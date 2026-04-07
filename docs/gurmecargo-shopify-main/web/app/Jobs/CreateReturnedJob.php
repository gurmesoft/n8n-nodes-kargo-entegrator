<?php

namespace App\Jobs;

use App\Services\CargoSAAS\ApiRequests;
use App\Services\CargoSAAS\Resources;
use App\Services\Shopify;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use App\Jobs\Flow\TriggerReturnedCreated;
use App\Jobs\AddTagsJob;

class CreateReturnedJob implements ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    protected array $returnedData;
    protected $user;
    protected bool $autoReturned;

    /**
     * Create a new job instance.
     *
     * @param array $returnedData
     * @param \App\Models\User $user
     * @param bool $autoReturned
     * @return void
     */
    public function __construct(array $returnedData, $user, bool $autoReturned = false)
    {
        $this->returnedData = $returnedData;
        $this->user = $user;
        $this->autoReturned = $autoReturned;
    }

    /**
     * Execute the job.
     *
     * @return array
     * @throws ValidationException
     * @throws \Exception
     */
    public function handle(): array
    {
        $returnedIds = [];
        $returnData = $this->returnedData;
        $returneds = $returnData['returns'];
        unset($returnData['returns']);

        try {
            foreach ($returneds as $returned) {
                $returned = array_merge($returned, $returnData);
                $apiResource = (new Resources\Returneds($this->user->api_key))->store($returned);
                if ($apiResource instanceof \Illuminate\Http\Client\Response) {
                    if ($this->autoReturned && $returned['platform_id']) {
                        AddTagsJob::dispatch(
                            'gid://shopify/Order/' . $returned['platform_id'],
                            ['İade otomatik oluşturulamadı'],
                            $this->user
                        );
                    }
                    throw new \Exception($apiResource->json()['message'] ?? 'İade oluşturulurken bir hata oluştu. Lütfen daha sonra tekrar deneyin');
                }

                $returnedIds[] = $apiResource['id'];

                if ($returned['reverse_fulfillment_order_id']) {
                    $reverseId = $returned['reverse_fulfillment_order_id'];
                } else {
                    $approve = Shopify\Api::graph(
                        Shopify\GraphQL\Query::getReturnApproveRequest(),
                        ['input' => ['id' => 'gid://shopify/Return/' . $returned['return_id']]],
                        user: $this->user
                    );
                    $reverseId = $approve['return']['reverseFulfillmentOrders'][0]['id'];
                }

                $filename = Str::random() . '-' . $apiResource['id'];

                Storage::put(
                    "public/{$filename}.pdf",
                    base64_decode((new ApiRequests($this->user->api_key))->print([$apiResource['id']], 'returneds'))
                );

                Shopify\Api::graph(
                    Shopify\GraphQL\Query::getReverseDeliveryCreateWithShipping(),
                    [
                        'reverseFulfillmentOrderId' => 'gid://shopify/ReverseFulfillmentOrder/' . $reverseId,
                        'labelInput' => [
                            'fileUrl' => asset("storage/{$filename}.pdf"),
                        ],
                        'reverseDeliveryLineItems' => [],
                    ],
                    user: $this->user
                );

                $this->user->returneds()->create([
                    'returned' => $apiResource,
                    'returned_id' => $apiResource['id'],
                    'return_id' => $returned['return_id'],
                    'order_id' => $returned['platform_id'],
                    'reverse_fulfillment_order_id' => $reverseId,
                ]);
                TriggerReturnedCreated::dispatch($apiResource, $this->user);
            }


            return $returnedIds;
        } catch (\Exception $e) {
            throw $e;
        }
    }
}
