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
    List,
    Link,
} from "@shopify/polaris";
import { EditIcon, ImageIcon } from "@shopify/polaris-icons";
import { useAppBridge } from "@shopify/app-bridge-react";
import { packageTypes, paymentTypes, payorTypes } from "@/utils/fields";
import EditReturnedModal from "./editReturnedModal";

export default function Returns({
    setData,
    data,
    warehouses,
    cargoIntegrations,
}) {
    const shopify = useAppBridge();

    const warehouse = (item) =>
        warehouses.find((warehouse) => warehouse.id === item.warehouse_id);
    const cargoIntegration = (item) =>
        cargoIntegrations.find(
            (cargoIntegration) =>
                cargoIntegration.id === item.cargo_integration_id
        );
    const handleFieldChange = (field, index) => (value) => {
        setData((prevData) => {
            const updateReturns = prevData.returns.map((returned, i) =>
                i === index ? { ...returned, [field]: value } : returned
            );
            return { ...prevData, returns: updateReturns };
        });
    };
    
    return (
        <BlockStack gap="200">
            <Box padding="400">
                <Text as="h2" variant="headingMd">
                    İade Talepleri
                </Text>
                <Text as="span" variant="bodySm">
                    İade talepleriniz için iade kodu oluşturun ve müşterinize
                    gönderin.
                </Text>
            </Box>
            {data.returns.map((returned, index) => (
                <Card sectioned key={index}>
                    <BlockStack gap="400">
                        <InlineStack
                            align="space-between"
                            wrap={false}
                            gap={{ xs: 200, sm: 400 }}
                        >
                            <InlineStack gap={{ md: 200, lg: 200, xl: 200 }}>
                                <Text>{returned.return_d_id}</Text>
                                <Badge tone="attention">
                                    {warehouse(returned).name}
                                </Badge>
                                <Badge>{cargoIntegration(returned).name}</Badge>
                                {returned.need_return ? (
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
                                    shopify.modal.show(`${index}-modal`)
                                }
                            ></Button>
                            <EditReturnedModal
                                index={index}
                                returned={returned}
                                handleFieldChange={handleFieldChange}
                                shopify={shopify}
                                cargoIntegrations={cargoIntegrations}
                                warehouses={warehouses}
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
                                items={returned.lines}
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
                                            <Box>
                                                <InlineStack align="space-between">
                                                    <Text
                                                        as="h3"
                                                        variant="bodyMd"
                                                        fontWeight="medium"
                                                    >
                                                        {title}
                                                    </Text>
                                                    <InlineStack gap="200">
                                                        {item.quantity}/
                                                        {item.sold_qty}
                                                    </InlineStack>
                                                </InlineStack>
                                                {item.customer_note && (
                                                    <Text>SKU: {sku}</Text>
                                                )}
                                                <List type="bullet">
                                                    <List.Item>
                                                        İade Nedeni:{" "}
                                                        {item.reason}
                                                    </List.Item>
                                                    {item.customer_note && (
                                                        <List.Item>
                                                            Müşteri Notu:{" "}
                                                            {item.customer_note}
                                                        </List.Item>
                                                    )}
                                                </List>
                                            </Box>
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
