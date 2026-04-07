<?php

namespace App\Services\CargoSAAS;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;

abstract class Client
{
    /**
     * Geçit kimliği
     *
     * @var string
     */
    protected $id;

    /**
     * @var Http
     */
    public $httpClient;

    /**
     * @var GatewayResponse
     */
    public $gatewayResponse;

    /**
     * @var string
     */
    public $appUrl;

    /**
     * @var array
     */
    public $headers = [];

    public function __construct($apiKey = null)
    {
        $token = $apiKey ? $apiKey : Auth::user()->api_key;
        $this->httpClient = new Http();

        $this->headers = [
            'Content-Type' => 'application/json',
            'Accept' => 'application/json',
            'Authorization' => "Bearer {$token}",
        ];
    }

    public function setHeaders($headers)
    {
        $this->headers = $headers;

        return $this;
    }

    public function getHeaders()
    {
        return $this->headers;
    }

    public function httpClient()
    {
        return $this->httpClient::timeout(60)->withHeaders($this->headers)
            ->baseUrl(
                config('app.env') !== 'production' ? 'https://staging.kargoentegrator.com/api' : 'https://app.kargoentegrator.com/api'
            );
    }

    public function getData($response)
    {
        $response = $response->json() ? $response->json() : $response->body();

        if (is_array($response) && isset($response['data'])) {
            return $response['data'];
        }

        return $response;
    }
}
