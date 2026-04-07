<?php

namespace App\Services\CargoSAAS;

/**
 * GurmeCargo istek sınıfı
 */
class ApiRequests extends Client
{
    /**
     * Api Bağlantı testi.
     *
     * @param  string  $api_key  Erişim anahtarı.
     */
    public function checkConnection($api_key)
    {
        return $this->setHeaders(
            [
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
                'Authorization' => 'Bearer ' . $api_key,
            ]
        )->httpClient()->get('/helpers/check-connection');
    }

    /**
     * Kargo firmaları.
     *
     * @return array
     */
    public function getCargoCompanies()
    {
        $companies = [];
        $httpResponse = $this->httpClient()->get('/helpers/cargo-companies');

        if ($httpResponse->status() === 200) {
            $companies = $this->getData($httpResponse);
        }

        return $companies;
    }

    /**
     * Barkod yazdırma.
     *
     * @param  array  $ids  Gönderi kimlikleri.
     * @param  string  $type  Yazdırma tipi.
     * @return mixed
     *
     * @throws \Exception Barko yazdırılamadı.
     */
    public function print($ids, $type = 'shipments')
    {
        $params = [$type => $ids];
        $url = $type === 'shipments' ? '/print-pdf' : '/print-returned-pdf';
        $httpResponse = $this->httpClient()->get($url . '?' . http_build_query($params));
        if ($httpResponse->status() === 200) {
            return base64_encode($httpResponse->body()); //phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions.obfuscation_base64_encode
        }

        throw new \Exception('Barkod yazdırılamadı. Lütfen tekrar deneyin');
    }

    /**
     * Gönderi ayarları kayıt etme.
     *
     * @param  array  $data  Ayarlar.
     * @return mixed
     */
    public function updateShipmentSetting($data)
    {
        $httpResponse = $this->httpClient()->path('/settings/shipment-setting', json_encode($data));
        if ($httpResponse->status() === 200) {
            return $this->getData($httpResponse);
        }
    }

    /**
     * Gönderi ayarları getirme.
     *
     * @return mixed
     */
    public function getShipmentSetting()
    {
        $settings = [];
        $httpResponse = $this->httpClient()->get('/settings/shipment-setting');
        if ($httpResponse->status() === 200) {
            $settings = $this->getData($httpResponse);
        }

        return $settings;
    }

    /**
     * İade ayarları getirme.
     *
     * @return mixed
     */
    public function getReturnedSetting()
    {
        $settings = [];
        $httpResponse = $this->httpClient()->get('/settings/returned-setting');
        if ($httpResponse->status() === 200) {
            $settings = $this->getData($httpResponse);
        }

        return $settings;
    }

    /**
     * Plan getirme.
     *
     * @return array
     */
    public function getProfile()
    {
        $profile = [];
        $httpResponse = $this->httpClient()->get('/helpers/profile');
        if ($httpResponse->status() === 200) {
            $profile = $this->getData($httpResponse);
        }

        return $profile;
    }

    /**
     * Adresi AI ile düzeltme.
     *
     * @param  array  $data  Adres verileri.
     * @return mixed
     */
    public function fixAddress($data)
    {
        $httpResponse = $this->httpClient()->post('/helpers/fix-address', $data);
        if ($httpResponse->status() === 200) {
            return $this->getData($httpResponse);
        } else {
            return $httpResponse->json();
        }
    }

    public function settingsWebhook($data)
    {
        $httpResponse = $this->httpClient()->post('/helpers/settings-webhook', $data);
        if ($httpResponse->status() === 200) {
            return $this->getData($httpResponse);
        } else {
            return $httpResponse->json();
        }
    }
}
