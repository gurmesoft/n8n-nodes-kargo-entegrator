import { BlockStack, Box, Button, Card, Divider, Icon, InlineStack, Link, Text } from "@shopify/polaris";
import { ClipboardIcon } from "@shopify/polaris-icons";

export default function ReceiverInfo(props) {
    const commFields = [
        {
            label: "Ad Soyad",
            value: `${props.receiver.name} ${props.receiver.surname}`,
        },
        { label: "Telefon", value: props.receiver.phone },
        { label: "E-posta", value: props.receiver.email },
    ];

    const addressFields = [
        { label: "Adres", value: props.receiver.address },
        { label: "İlçe", value: props.receiver.district },
        { label: "Şehir", value: props.receiver.city },
        { label: "Ülke", value: props.receiver.country },
        { label: "Posta Kodu", value: props.receiver.postcode },
        { label: "Vergi Numarası", value: props.receiver.tax_number ?? "-" },
        { label: "Vergi Dairesi", value: props.receiver.tax_office ?? "-" },
    ];

    return (
        <Card>
            <BlockStack gap="400">
                <Text as="h2" variant="headingMd">
                    Alıcı Bilgileri
                </Text>
                <Divider />
                <Box>
                    <Text as="h3" variant="headingSm">
                        İletişim Bilgileri
                    </Text>
                    {commFields.map((field, index) => (
                        <InlineStack align="space-between" key={index}>
                            <InlineStack gap="100">
                                <Text fontWeight="semibold">
                                    {field.label}:
                                </Text>
                                {field.label == "Ad Soyad" && (
                                    <Text> {field.value}</Text>
                                )}
                                {field.label == "Telefon" && (
                                    <Link url={`tel:${field.value}`}>
                                        {field.value}
                                    </Link>
                                )}
                                {field.label == "E-posta" && (
                                    <Link url={`mailto:${field.value}`}>
                                        {field.value}
                                    </Link>
                                )}
                            </InlineStack>
                            {field.label !== "Ad Soyad" && (
                                <Button
                                    variant="tertiary"
                                    icon={ClipboardIcon}
                                    onClick={() =>
                                        navigator.clipboard.writeText(
                                            field.value
                                        )
                                    }
                                />
                            )}
                        </InlineStack>
                    ))}
                </Box>
                <Box>
                    <Text as="h3" variant="headingSm">
                        Adres Bilgileri
                    </Text>
                    {addressFields.map((field, index) => (
                        <InlineStack gap="100" key={index}>
                            <Text fontWeight="semibold">{field.label}:</Text>
                            <Text> {field.value}</Text>
                        </InlineStack>
                    ))}
                </Box>
            </BlockStack>
        </Card>
    );
}
