import React from "react";
import {
    Button,
    Card,
    InlineStack,
    Badge,
    Text,
    Thumbnail,
    Box,
    BlockStack,
    ResourceList,
    TextField,
} from "@shopify/polaris";
import {
    EditIcon,
    PlusIcon,
    MinusIcon,
    ImageIcon,
} from "@shopify/polaris-icons";
import { useAppBridge } from "@shopify/app-bridge-react";
import { packageTypes, paymentTypes, payorTypes } from "@/utils/fields";
import EditShipmentModal from "./editShipmentModal";

export default function FulfillmentOrder({
    setData,
    data,
    warehouses,
    cargoIntegrations,
}) {
    const warehouse = (fulfillmentOrder) =>
        warehouses.find(
            (warehouse) => warehouse.id === fulfillmentOrder.warehouse_id
        );
    const cargoIntegration = (fulfillmentOrder) =>
        cargoIntegrations.find(
            (cargoIntegration) =>
                cargoIntegration.id === fulfillmentOrder.cargo_integration_id
        );

    const currencies = [
        { label: "TRY", value: "TRY" },
        { label: "USD", value: "USD" },
        { label: "EUR", value: "EUR" },
    ];
    const shopify = useAppBridge();

    const handleFieldChange = (field, index) => (value) => {
        setData((prevData) => {
            const updatedOrders = prevData.fulfillment_orders.map((order, i) =>
                i === index ? { ...order, [field]: value } : order
            );
            return { ...prevData, fulfillment_orders: updatedOrders };
        });
    };

    const updateQuantity = (lineIndex, orderIndex, change) => {
        setData((prevData) => {
            const updatedOrders = prevData.fulfillment_orders.map(
                (order, i) => {
                    if (i === orderIndex) {
                        const updatedLines = order.lines.map((line, j) => {
                            if (j === lineIndex) {
                                const newQuantity = Math.max(
                                    0,
                                    Math.min(
                                        line.quantity + change,
                                        line.fulfillable_quantity
                                    )
                                );
                                return { ...line, quantity: newQuantity };
                            }
                            return line;
                        });
                        return { ...order, lines: updatedLines };
                    }
                    return order;
                }
            );
            return { ...prevData, fulfillment_orders: updatedOrders };
        });
    };

    const handleWeightChange = (orderIndex, lineIndex, value) => {
        setData((prevData) => {
            const updatedOrders = prevData.fulfillment_orders.map((order, i) =>
                i === orderIndex
                    ? {
                          ...order,
                          lines: order.lines.map((line, j) =>
                              j === lineIndex
                                  ? { ...line, weight: value }
                                  : line
                          ),
                      }
                    : order
            );
            return { ...prevData, fulfillment_orders: updatedOrders };
        });
    };

    const handlePriceChange = (orderIndex, lineIndex, value) => {
        setData((prevData) => {
            const updatedOrders = prevData.fulfillment_orders.map((order, i) =>
                i === orderIndex
                    ? {
                          ...order,
                          lines: order.lines.map((line, j) =>
                              j === lineIndex ? { ...line, price: value } : line
                          ),
                      }
                    : order
            );
            return { ...prevData, fulfillment_orders: updatedOrders };
        });
    };

    return (
        <BlockStack gap="200">
            <Box padding="400">
                <Text as="h2" variant="headingMd">
                    Gönderilmeyen Paketler
                </Text>
                <Text as="span" variant="bodySm">
                    Sipariş için gönderim yapmanızı bekleyen paketler aşağıda
                    listelenmektedir.
                </Text>
            </Box>
            {data.fulfillment_orders.map((fulfillmentOrder, orderIndex) => (
                <Card sectioned key={orderIndex}>
                    <BlockStack gap="400">
                        <InlineStack
                            align="space-between"
                            wrap={false}
                            gap={{ xs: 200, sm: 400 }}
                        >
                            <InlineStack gap={{ md: 200, lg: 200, xl: 200 }}>
                                <Text as="h2" variant="headingSm">
                                    {fulfillmentOrder.location_name}
                                </Text>
                                <Badge tone="attention">
                                    {warehouse(fulfillmentOrder).name}
                                </Badge>
                                <Badge>
                                    {cargoIntegration(fulfillmentOrder).name}
                                </Badge>
                                {fulfillmentOrder.is_pay_at_door && (
                                    <Badge tone="info">
                                        Kapıda Ödeme - {fulfillmentOrder.total}
                                        {fulfillmentOrder.currency}
                                    </Badge>
                                )}
                                {fulfillmentOrder.need_fulfillment ? (
                                    <Badge tone="success" progress="complete">
                                        Gönderim Yapılacak
                                    </Badge>
                                ) : (
                                    <Badge
                                        tone="critical"
                                        progress="incomplete"
                                    >
                                        Gönderim Yapılmayacak
                                    </Badge>
                                )}
                            </InlineStack>
                            <Button
                                variant="tertiary"
                                icon={EditIcon}
                                onClick={() =>
                                    shopify.modal.show(`${orderIndex}-modal`)
                                }
                            ></Button>
                            <EditShipmentModal
                                orderIndex={orderIndex}
                                fulfillmentOrder={fulfillmentOrder}
                                handleFieldChange={handleFieldChange}
                                shopify={shopify}
                                cargoIntegrations={cargoIntegrations}
                                warehouses={warehouses}
                                currencies={currencies}
                                payorTypes={payorTypes}
                                paymentTypes={paymentTypes}
                                packageTypes={packageTypes}
                            />
                        </InlineStack>
                        <Box
                            borderColor="border"
                            borderWidth="025"
                            borderRadius="100"
                        >
                            <ResourceList
                                resourceName={{
                                    singular: "item",
                                    plural: "items",
                                }}
                                items={fulfillmentOrder.lines}
                                renderItem={(item, id, index) => {
                                    const { platform_id, title, image, sku } =
                                        item;
                                    return (
                                        <ResourceList.Item
                                            verticalAlignment="center"
                                            id={platform_id}
                                            media={
                                                <Thumbnail
                                                    customer
                                                    size="medium"
                                                    source={
                                                        image
                                                            ? image
                                                            : ImageIcon
                                                    }
                                                />
                                            }
                                            accessibilityLabel={`View details for ${title}`}
                                        >
                                            <BlockStack>
                                                <InlineStack align="space-between">
                                                    <Text
                                                        as="h3"
                                                        variant="bodyMd"
                                                        fontWeight="medium"
                                                    >
                                                        {title}
                                                    </Text>
                                                    <InlineStack gap="800">
                                                        <TextField
                                                            label="Birim Fiyat"
                                                            suffix={
                                                                fulfillmentOrder.currency
                                                            }
                                                            value={item.price}
                                                            onChange={(value) =>
                                                                handlePriceChange(
                                                                    orderIndex,
                                                                    index,
                                                                    value
                                                                )
                                                            }
                                                        />
                                                        <TextField
                                                            label="Ürün Toplam Ağırlığı"
                                                            suffix="kg"
                                                            value={item.weight * item.quantity}
                                                            onChange={(value) =>
                                                                handleWeightChange(
                                                                    orderIndex,
                                                                    index,
                                                                    value
                                                                )
                                                            }
                                                        />
                                                        <InlineStack gap="200">
                                                            <Button
                                                                size="micro"
                                                                icon={MinusIcon}
                                                                onClick={() =>
                                                                    updateQuantity(
                                                                        index,
                                                                        orderIndex,
                                                                        -1
                                                                    )
                                                                }
                                                                disabled={
                                                                    item.quantity <=
                                                                    0
                                                                }
                                                            ></Button>
                                                            <Text>
                                                                {item.quantity}
                                                            </Text>
                                                            <Button
                                                                size="micro"
                                                                icon={PlusIcon}
                                                                onClick={() =>
                                                                    updateQuantity(
                                                                        index,
                                                                        orderIndex,
                                                                        1
                                                                    )
                                                                }
                                                                disabled={
                                                                    item.quantity >=
                                                                    item.fulfillable_quantity
                                                                }
                                                            ></Button>
                                                        </InlineStack>
                                                    </InlineStack>
                                                </InlineStack>
                                                {sku && (
                                                    <Box>
                                                        <Text tone="subdued">
                                                            Sku: {sku}
                                                        </Text>
                                                    </Box>
                                                )}
                                            </BlockStack>
                                        </ResourceList.Item>
                                    );
                                }}
                            />
                        </Box>
                    </BlockStack>
                </Card>
            ))}
        </BlockStack>
    );
}
