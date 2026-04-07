import { BlockStack, Box, Card, Divider, InlineStack, Text } from "@shopify/polaris";

export default function WarehouseInfo(props) {
    const addressFields = [
        { label: "Depo", value: props.warehouse.name },
        { label: "Adres", value: props.warehouse.address },
        { label: "İlçe", value: props.warehouse.district },
        { label: "Şehir", value: props.warehouse.city },
    ]

    return (
        <Card>
            <BlockStack gap="400">
                <Text as="h2" variant="headingMd">
                    Gönderici Depo Bilgisi
                </Text>
                <Divider />
                <Box>
                    {addressFields.map((field, index) => (
                        <InlineStack align="space-between" key={index}>
                            <InlineStack gap="100">
                                <Text fontWeight="semibold">
                                    {field.label}:
                                </Text>
                                <Text> {field.value}</Text>
                            </InlineStack>
                        </InlineStack>
                    ))}
                </Box>
            </BlockStack>
        </Card>
    )
}