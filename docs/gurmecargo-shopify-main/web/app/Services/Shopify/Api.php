<?php

namespace App\Services\Shopify;

use Illuminate\Support\Facades\Auth;

class Api
{
    /**
     * @param \Osiset\ShopifyApp\Contracts\ShopModel|null  $user
     */
    public static function graph(string $query, array $variables = [], bool $sync = true, $user = null)
    {
        if ($user === null) {
            $user = Auth::user();
        }
        /** @var \Osiset\ShopifyApp\Contracts\ShopModel $user */
        $response = $user->api()->graph($query, $variables, $sync);

        $response = $response['body']->toArray();

        if (is_array($response) && array_key_exists('data', $response)) {
            $response = $response['data'];
        }

        return self::prepare($response[array_key_first($response)]);
    }

    private static function prepare($data)
    {
        if (! is_array($data)) {
            return $data;
        }

        if (array_key_first($data) === 'nodes') {
            $data = $data['nodes'];

            return self::prepare($data);
        }

        foreach ($data as $key => $value) {
            if (is_array($value) && array_keys($value) === ['nodes']) {
                $data[$key] = $value['nodes'];
                $data[$key] = self::prepare($data[$key]);
            } elseif (is_array($value)) {
                $data[$key] = self::prepare($value);
            }

            if ($key === 'id') {
                $arr = explode('/', $value);
                $data[$key] = end($arr);
            }
        }

        return $data;
    }
}
