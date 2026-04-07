<?php

namespace App\Mappers;

class Base
{
    /**
     * Request.
     *
     * @var \Illuminate\Http\Request
     */
    public $request;

    /**
     * Shopify order data.
     *
     * @var array
     */
    public $order;

    /**
     * Shopify API instance.
     *
     * @var  \App\Services\Shopify\Api  $api
     */
    public $api;

    /**
     * User instance.
     *
     * @var  \App\Models\User $user
     */
    public $user;

    /**
     * User warehouses.
     *
     * @var array
     */
    public $warehouses;

    /**
     * User saved cargo integrations.
     *
     * @var array
     */
    public $cargoIntegrations;

    /**
     * User default shipment settings.
     *
     * @var array
     */
    public $deliverySetting;

    /**
     * Validated address.
     *
     * @var array
     */
    public $validatedAddress = [];

    /**
     * User other settings.
     *
     * @var \App\Models\OtherSettings
     */
    public $otherSettings;

    public function mapCustomer()
    {
        $this->validatedAddress = $this->user->validatedAddresses()->where('order_id', "gid://shopify/OrderIdentity/{$this->order['id']}")->first()?->toArray();
        $countryCode = $this->getByCustomerKey('countryCodeV2');

        $customerData = [
            'name' => $this->getByCustomerKey('firstName'),
            'surname' => $this->getByCustomerKey('lastName'),
            'phone' => $this->getByCustomerKey('phone'),
            'country' => $this->getByCustomerKey('country'),
            'country_code' => $countryCode,
            'postcode' => $this->getByCustomerKey('zip'),
            'email' => $this->getByCustomerKey('email'),
            'tax_number' => '',
            'tax_office' => '',
        ];

        if ($countryCode === 'TR') {
            $customerData['city'] = $this->getByCustomerKey('city');
            $customerData['district'] = $this->getByCustomerKey('address2');
            $customerData['address'] = $this->getByCustomerKey('address1');
            $customerData['city_code'] = '';
        } else {
            $customerData['city'] = $this->getByCustomerKey('province');
            $customerData['city_code'] = $this->getByCustomerKey('provinceCode');
            $customerData['district'] = $this->getByCustomerKey('city');
            $customerData['address'] = $this->getByCustomerKey('address1') . ' ' . $this->getByCustomerKey('address2');
        }

        return $customerData;
    }

    private function getByCustomerKey($key)
    {
        $configuredValue = $this->getValueFromConfiguredMetafields($key);
        if ($configuredValue !== null) {
            return (string) $configuredValue;
        }

        $codValue = $this->getValueFromCustomAttributes($key);
        if ($codValue !== null) {
            return (string) $codValue;
        }

        $validated = $this->getValidatedAddress($key);
        if ($validated !== null) {
            return (string) $validated;
        }

        $shipping = $this->order['shippingAddress'];
        $billing = $this->order['billingAddress'];



        if (isset($shipping[$key]) && empty($shipping[$key]) === false) {
            return (string) $shipping[$key];
        }

        if (isset($billing[$key]) && empty($billing[$key]) === false) {
            return (string) $billing[$key];
        }

        if (isset($this->order['customer'][$key]) && empty($this->order['customer'][$key]) === false) {
            return (string) $this->order['customer'][$key];
        }

        return '';
    }

    public function getLocationSettings($locationId = null)
    {
        if ($locationId) {
            $settings = $this->user->locationSettings->where('location_id', $locationId)->first();
            if ($settings) {
                return $settings->toArray();
            }
        }

        return array_merge(
            [
                'cargo_integration_id' => array_column($this->cargoIntegrations, 'id', 'is_default')[true] ?? null,
                'warehouse_id' => array_column($this->warehouses, 'id', 'is_default')[true] ?? null,
                'package_type' => 'box',
                'payor_type' => 'sender',
                'payment_type' => 'cash_money',
                'email' => $this->order['customer']['email'] ?? '',
            ],
            $this->deliverySetting,
        );
    }

    /**
     * Easy COD eklentisi için ek ayrıntılardan alınan değerler.
     *
     * @param string $key
     * @return string|null
     */
    private function getValueFromCustomAttributes($key)
    {
        if (!isset($this->order['customAttributes']) || !is_array($this->order['customAttributes'])) {
            return null;
        }

        $codKeyMap = [
            'name' => 'Ad',
            'surname' => 'Soyad',
            'phone' => 'Telefon',
            'address1' => 'Adres',
            'city' => 'İl',
            'address2' => 'İlçe',
            'email' => 'E-posta',
            'countryCodeV2' => 'country',
        ];

        if (!isset($codKeyMap[$key])) {
            return null;
        }

        $codTargetKey = $codKeyMap[$key];
        $value = null;

        foreach ($this->order['customAttributes'] as $attribute) {
            if (isset($attribute['key']) && $attribute['key'] === $codTargetKey && isset($attribute['value'])) {
                $value = trim($attribute['value']);
                if ($value === '') {
                    $value = null;
                }
                break;
            }
        }

        if ($value === null) {
            return null;
        }

        return $value;
    }

    private function getValidatedAddress($key)
    {
        $keyMap = [
            'country' => 'country',
            'city' => 'city',
            'address2' => 'district',
            'address1' => 'address',
        ];

        $key = $keyMap[$key] ?? $key;

        if (isset($this->validatedAddress[$key]) && empty($this->validatedAddress[$key]) === false) {
            return $this->validatedAddress[$key];
        }

        return null;
    }

    /**
     * Kullanıcı ayarlarına göre metafield'lardan değer döner.
     *
     * @param string $key
     * @return string|null
     */
    private function getValueFromConfiguredMetafields(string $key): ?string
    {
        if (! $this->user->metafieldSettings()->exists()) {
            return null;
        }

        $settingsKeyMap = [
            'firstName' => 'name',
            'lastName' => 'surname',
            'phone' => 'phone',
            'address1' => 'address',
            'city' => 'city',
            'address2' => 'district',
            'email' => 'email',
            'countryCodeV2' => 'country',
        ];

        $targetField = $settingsKeyMap[$key] ?? '';

        /** @var \App\Models\MetafieldSetting|null $setting */
        $setting = $this->user->metafieldSettings()
            ->where('target_field', $targetField)
            ->first();

        if (! $setting) {
            return null;
        }

        if (! isset($this->order['metafields']) || ! is_array($this->order['metafields'])) {
            return null;
        }

        return array_column($this->order['metafields'], 'value', 'key')[$setting->metafield_key] ?? null;
    }
}
