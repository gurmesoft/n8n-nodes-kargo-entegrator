<?php

namespace App\Services\Shopify\GraphQL;

use Illuminate\Support\Facades\File;

class Query
{
    private static function getQueryStringByFilename($filename)
    {
        $file = app_path("Services/Shopify/GraphQL/{$filename}.gql");

        return File::get($file);
    }

    public static function getOrderForShipmentMapper($orderId)
    {
        return sprintf(self::getQueryStringByFilename('GetOrderForShipmentMapper'), $orderId);
    }

    public static function getLocations()
    {
        return sprintf(self::getQueryStringByFilename('GetLocations'));
    }

    public static function getOrderForReturnedMapper($orderId)
    {
        return sprintf(self::getQueryStringByFilename('GetOrderForReturnedMapper'), $orderId);
    }

    public static function getShopInfo()
    {
        return sprintf(self::getQueryStringByFilename('ShopInfo'));
    }

    public static function getReturnCreateMutation()
    {
        return sprintf(self::getQueryStringByFilename('ReturnCreateMutation'));
    }

    public static function getReturnCancelMutation()
    {
        return sprintf(self::getQueryStringByFilename('ReturnCancelMutation'));
    }

    public static function getReverseDeliveryCreateWithShipping()
    {
        return sprintf(self::getQueryStringByFilename('ReverseDeliveryCreateWithShipping'));
    }

    public static function getReverseDeliveryShippingUpdate()
    {
        return sprintf(self::getQueryStringByFilename('ReverseDeliveryShippingUpdate'));
    }

    public static function getReturnForReverseDelivery($returnId)
    {
        return sprintf(self::getQueryStringByFilename('GetReturnForReverseDelivery'), $returnId);
    }

    public static function getReverseFulfillmentOrder($rfId)
    {
        return sprintf(self::getQueryStringByFilename('ReverseFulfillmentOrder'), $rfId);
    }

    public static function createPageMutation()
    {
        return sprintf(self::getQueryStringByFilename('CreatePageMutation'));
    }

    public static function themeFilesUpsertMutation()
    {
        return sprintf(self::getQueryStringByFilename('ThemeFilesUpsertMutation'));
    }

    public static function getThemes()
    {
        return sprintf(self::getQueryStringByFilename('GetThemes'));
    }

    public static function deletePageMutation()
    {
        return sprintf(self::getQueryStringByFilename('DeletePageMutation'));
    }

    public static function getOrderMarkAsPaidMutation()
    {
        return sprintf(self::getQueryStringByFilename('OrderMarkAsPaid'));
    }

    public static function getReturnApproveRequest()
    {
        return sprintf(self::getQueryStringByFilename('ReturnApproveRequest'));
    }

    public static function getWebhookCreateMutation()
    {
        return sprintf(self::getQueryStringByFilename('WebhookCreateMutation'));
    }

    public static function getWebhookDeleteMutation()
    {
        return sprintf(self::getQueryStringByFilename('WebhookDeleteMutation'));
    }

    public static function addTagsMutation()
    {
        return sprintf(self::getQueryStringByFilename('AddTagsMutation'));
    }

    public static function updateOrderMutation()
    {
        return sprintf(self::getQueryStringByFilename('UpdateOrderMutation'));
    }

    public static function fulfillmentCreateMutation()
    {
        return sprintf(self::getQueryStringByFilename('FulfillmentCreateMutation'));
    }

    public static function fulfillmentCancelMutation()
    {
        return sprintf(self::getQueryStringByFilename('FulfillmentCancelMutation'));
    }

    public static function fulfillmentTrackingInfoUpdateMutation()
    {
        return sprintf(self::getQueryStringByFilename('FulfillmentTrackingInfoUpdateMutation'));
    }

    public static function fulfillmentEventCreateMutation()
    {
        return sprintf(self::getQueryStringByFilename('FulfillmentEventCreateMutation'));
    }

    public static function getFulfillmentServices()
    {
        return sprintf(self::getQueryStringByFilename('GetFulfillmentServices'));
    }

    public static function getOrdersForBulkShipmentMapper()
    {
        return sprintf(self::getQueryStringByFilename('GetOrdersForBulkShipmentMapper'));
    }

    public static function getFulfillmentOrder()
    {
        return sprintf(self::getQueryStringByFilename('FulfillmentOrder'));
    }

    public static function getFlowTriggerReceiveMutation()
    {
        return sprintf(self::getQueryStringByFilename('FlowTriggerReceiveMutation'));
    }
}
