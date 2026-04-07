<?php

namespace App\Jobs\Flow;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;


class TriggerReturnedCreated implements ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    protected $apiResource;

    protected $user;

    /**
     * Create a new job instance.
     *
     * @param  \App\Models\User  $user
     * @return void
     */
    public function __construct(array $apiResource, $user)
    {
        $this->apiResource = $apiResource;
        $this->user = $user;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $mutation = \App\Services\Shopify\GraphQL\Query::getFlowTriggerReceiveMutation();
        $variables = [
            'handle' => 'returned-created',
            'payload' => [
                'order_id' => (int) $this->apiResource['platform_id'],
                'returnedId' => (string) $this->apiResource['id'],
            ],
        ];
        \App\Services\Shopify\Api::graph($mutation, $variables, user: $this->user);
    }
}