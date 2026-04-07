import { BlockStack, Box, Card, Grid, InlineGrid, Link, Text } from "@shopify/polaris";

export default function ShipmentInfo(props) {
    const fields = [
        { label: "Barkod", value: props.customer.barcode },
        { label: "İrsaliye Numarası", value: props.customer.waybill_number },
        { label: "Fatura Numarası", value: props.customer.invoice_number },
        { label: "Ödeme Yapacak Taraf", value: props.customer.payor_type },
        { label: "Paket Tipi", value: props.customer.package_type },
        { label: "Ödeme Tipi", value: props.customer.payment_type },
        { label: "Takip Numarası", value: props.customer.tracking_number },
        { label: "Takip Linki", value: props.customer.tracking_link },
        { label: "Satış Kanalı", value: props.customer.platform },
        { label: "Satış Kanalı Numarası", value: props.customer.platform_id },
    ]

    const translateValue = (label, value) => {
        switch (label) {
            case "Ödeme Yapacak Taraf":
                return value === "sender" ? "Gönderici" : "Alıcı";
            case "Paket Tipi":
                return value === "box" ? "Kutu" : "Dosya";
            case "Ödeme Tipi":
                return value === "cash_money" ? "Nakit" : "Kredi Kartı";
            default:
                return value;
        }
    };

    return (
        <Card>
            <BlockStack gap="400">
                <Text as="h2" variant="headingMd">
                    Gönderi Bilgileri
                </Text>
                <InlineGrid columns={4} gap="400">
                    {fields.map((field, index) => (
                        <Box key={index}>
                            {field.label === "Takip Linki" && (
                                <Box>
                                    <Text fontWeight="semibold">
                                        {field.label}
                                    </Text>
                                    <Link url={field.value} target="_blank">
                                        {field.value}
                                        {/* <img src={props.customer.img} alt="" /> */}
                                    </Link>
                                </Box>
                            )}
                            {field.label !== "Takip Linki" && (
                                <Box>
                                    <Text fontWeight="semibold">
                                        {field.label}
                                    </Text>
                                    <Text>
                                        {translateValue(
                                            field.label,
                                            field.value
                                        ) ?? "-"}
                                    </Text>
                                </Box>
                            )}
                        </Box>
                    ))}
                </InlineGrid>
            </BlockStack>
        </Card>
    );
}