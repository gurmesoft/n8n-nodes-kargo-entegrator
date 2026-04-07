<?php

namespace App\Services\CargoSAAS\Resources;

use App\Services\CargoSAAS\Client;

/**
 * Gönderici adresleri kaynak sınıfı
 */
abstract class Resource extends Client
{
    /**
     * Kaynak tanımı
     *
     * @var string
     */
    protected $resource;

    /**
     * Kaynak api pathi.
     *
     * @var string
     */
    protected $api_path;

    /**
     * Kaynak kimliği.
     *
     * @var string
     */
    protected $resource_id;

    /**
     * Çağrı adresi.
     *
     * @return string
     */
    private function path()
    {
        $path = "/{$this->api_path}";
        if ($this->resource_id) {
            $path = "{$path}/{$this->resource_id}";
        }

        return $path;
    }

    /**
     * Api isteği yapan method.
     *
     * @param  string  $method  İstek tipi 'POST', 'GET', 'HEAD' ...
     * @param  mixed  $body  İstekte gönderilecek parametreler.
     *
     * @throws \Exception Bağlantı hataları.
     */
    public function request($method, $body = [])
    {
        $response = $this->httpClient()->$method($this->path(), $body);

        return $response;
    }

    /**
     * Apiden kaynak getirme.
     */
    public function index()
    {
        $resources = [];
        $httpResponse = $this->request('get');
        if ($httpResponse->status() === 200) {
            $resources = $this->getData($httpResponse);
        }

        return $resources;
    }

    /**
     * Apiye kaynak ekleme.
     *
     * @param  mixed  $request  Kaynak verileri.
     * @return mixed
     */
    public function store($request)
    {
        $httpResponse = $this->request('post', $request);

        if ($httpResponse->status() === 201) {
            return $this->getData($httpResponse);
        }

        return $httpResponse;
    }

    /**
     * Apiden kaynak getirme.
     *
     * @param  int|string  $id  Güncellenecek veri kimliği.
     * @return mixed
     */
    public function show($id)
    {
        $this->resource_id = $id;
        $resource = [];
        $httpResponse = $this->request('GET');

        if ($httpResponse->status() === 200) {
            $resource = $this->getData($httpResponse);
        }

        return $resource;
    }

    /**
     * Api kaynağını güncelleme ekleme.
     *
     * @param  mixed  $request  Kaynak verileri.
     * @param  int|string  $id  Güncellenecek veri kimliği.
     */
    public function update($request, $id)
    {
        $this->resource_id = $id;
        $resource = [];
        $response = $this->request('PATCH', $request);
        if ($response->status() === 200) {
            $resource = $this->getData($response);
        }

        return $resource;
    }

    /**
     * Api kaynağını siler.
     *
     * @param  int|string  $id  Silinecek veri kimliği.
     *
     * @throws \Exception Silinme hatası.
     */
    public function destroy($id)
    {
        $this->resource_id = $id;
        $resource = false;
        $response = $this->request('DELETE');

        if ($response->status() === 200) {
            $resource = $this->getData($response);

            return $resource;
        }

        return $response;
    }
}
