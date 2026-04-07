<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class AddTagsJob implements ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    /**
     * @var string
     */
    protected $orderId;

    /**
     * @var array
     */
    protected $tags;

    /**
     * @var \App\Models\User
     */
    protected $user;

    /**
     * @param string $orderId
     * @param array $tags
     * @param \App\Models\User $user
     */
    public function __construct(string $orderId, array $tags, \App\Models\User $user)
    {
        $this->orderId = $orderId;
        $this->tags = $tags;
        $this->user = $user;
    }

    /**
     * Execute the job.
     */
    public function handle()
    {
        $mutation = \App\Services\Shopify\GraphQL\Query::addTagsMutation();
        $variables = [
            'id' => $this->orderId,
            'tags' => $this->tags,
        ];
        \App\Services\Shopify\Api::graph($mutation, $variables, user: $this->user);
    }
}
