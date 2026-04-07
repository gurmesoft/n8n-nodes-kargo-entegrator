import {
    Text,
    BlockStack,
    TextField,
    Select,
    Box,
    InlineStack,
    Button,
    Grid,
    FormLayout,
    Divider,
    Link,
} from "@shopify/polaris";
import { useState } from "react";
import request from "@/plugins/request";
import { SaveBar } from "@shopify/app-bridge-react";
import { DeleteIcon, PlusIcon } from "@shopify/polaris-icons";
import { packageTypes, payorTypes, paymentTypes } from "@/utils/fields";

export default function DeliveryProfileMaps({
    cargoIntegrations,
    deliveryProfileMaps,
}) {
    const [data, setData] = useState(deliveryProfileMaps);

    const save = () => {
        request("/settings/delivery-profile-maps", "PATCH", { data }, () => {
            shopify.toast.show("Ayarlar kayıt edildi.");
            shopify.saveBar.hide("save-bar");
        });
    };

    const handleDelete = (index) => {
        shopify.saveBar.show("save-bar");
        const newData = [...data];
        newData.splice(index, 1);
        setData(newData);
    };

    const handleAdd = () => {
        const newData = [...data];
        newData.push({
            profile: "",
            cargo_integration_id: "",
        });
        setData(newData);
    };

    const handleCancel = () => {
        setData(deliveryProfileMaps);
        shopify.saveBar.hide("save-bar");
    };

    const handleChange = (index, key, value) => {
        const newData = [...data];
        newData[index][key] = value;
        setData(newData);
    };

    return (
        <Box padding="500">
            <BlockStack gap="200">
                <SaveBar id="save-bar">
                    <button variant={"primary"} onClick={save}>
                        Kaydet
                    </button>
                    <button onClick={handleCancel}>Vazgeç</button>
                </SaveBar>
                <InlineStack align="space-between">
                    <Text as="h1" variant="headingSm">
                        Gönderi Profil Eşleştirmeleri
                    </Text>
                </InlineStack>
                <BlockStack gap="400" style={{ marginBottom: "20px" }}>
                    <Text as="p" variant="bodyMd">
                        {
                            "Shopify > Ayarlar > Kargo ve teslimat/Kargo bölümü altındaki profillerde ekli olan 'Özel kargo ücreti adı'  ile gönderi ayarlarınızı eşleştirin. Bu eşleştirmeler gönderi oluşturma esnasında eşleşen ayarların otomatik olarak atanmasını sağlayacaktır."
                        }
                        <Link
                            external
                            url="https://support.kargoentegrator.com/hc/kargo-entegratr-saas/articles/1771402449-gonderim-profili-eslestirme"
                        >
                            Detaylı bilgi için tıklayınız.
                        </Link>
                    </Text>
                </BlockStack>
                <Grid columns={{ xs: 12, md: 12, lg: 12, xl: 12, xxl: 12 }} >
                    <Grid.Cell
                        columnSpan={{
                            xs: 2,
                            md: 2,
                            lg: 2,
                            xl: 2,
                            xxl: 2,
                        }}
                    >
                        <Text as="p" variant="bodyMd">
                            Gönderim Profili
                        </Text>
                    </Grid.Cell>
                    <Grid.Cell
                        columnSpan={{
                            xs: 3,
                            md: 3,
                            lg: 3,
                            xl: 3,
                            xxl: 3,
                        }}
                    >
                        <Text as="p" variant="bodyMd">
                            Kargo Hesabı
                        </Text>
                    </Grid.Cell>
                    <Grid.Cell
                        columnSpan={{
                            xs: 2,
                            md: 2,
                            lg: 2,
                            xl: 2,
                            xxl: 2,
                        }}
                    >
                        <Text as="p" variant="bodyMd">
                            Paket Tipi
                        </Text>
                    </Grid.Cell>
                    <Grid.Cell
                        columnSpan={{
                            xs: 2,
                            md: 2,
                            lg: 2,
                            xl: 2,
                            xxl: 2,
                        }}
                    >
                        <Text as="p" variant="bodyMd">
                            Ödeme Yapacak Taraf
                        </Text>
                    </Grid.Cell>
                    <Grid.Cell
                        columnSpan={{
                            xs: 2,
                            md: 2,
                            lg: 2,
                            xl: 2,
                            xxl: 2,
                        }}
                    >
                        <Text as="p" variant="bodyMd">
                            Ödeme Tipi
                        </Text>
                    </Grid.Cell>
                </Grid>
                <FormLayout gap="400">
                    <form
                        id="delivery-profile-maps-form"
                        onInput={() => {
                            shopify.saveBar.show("save-bar");
                        }}
                    >
                        <BlockStack gap="400">
                            {data.map((item, index) => (
                                <Grid
                                    gap="400"
                                    columns={{
                                        xs: 12,
                                        md: 12,
                                        lg: 12,
                                        xl: 12,
                                        xxl: 12,
                                    }}
                                    key={index}
                                >
                                    <Grid.Cell
                                        columnSpan={{
                                            xs: 2,
                                            md: 2,
                                            lg: 2,
                                            xl: 2,
                                            xxl: 2,
                                        }}
                                    >
                                        <TextField
                                            value={item.profile}
                                            onChange={(value) =>
                                                handleChange(
                                                    index,
                                                    "profile",
                                                    value,
                                                )
                                            }
                                        />
                                    </Grid.Cell>
                                    <Grid.Cell
                                        columnSpan={{
                                            xs: 3,
                                            md: 3,
                                            lg: 3,
                                            xl: 3,
                                            xxl: 3,
                                        }}
                                    >
                                        <Select
                                            onChange={(value) =>
                                                handleChange(
                                                    index,
                                                    "cargo_integration_id",
                                                    value,
                                                )
                                            }
                                            value={String(
                                                item.cargo_integration_id,
                                            )}
                                            placeholder="Seçiniz"
                                            options={cargoIntegrations.map(
                                                (e) => ({
                                                    label: e.name,
                                                    value: String(e.id),
                                                }),
                                            )}
                                        />
                                    </Grid.Cell>
                                    <Grid.Cell
                                        columnSpan={{
                                            xs: 2,
                                            md: 2,
                                            lg: 2,
                                            xl: 2,
                                            xxl: 2,
                                        }}
                                    >
                                        <Select
                                            onChange={(value) =>
                                                handleChange(
                                                    index,
                                                    "package_type",
                                                    value,
                                                )
                                            }
                                            placeholder="Seçiniz"
                                            options={packageTypes}
                                            value={item.package_type}
                                        />
                                    </Grid.Cell>
                                    <Grid.Cell
                                        columnSpan={{
                                            xs: 2,
                                            md: 2,
                                            lg: 2,
                                            xl: 2,
                                            xxl: 2,
                                        }}
                                    >
                                        <Select
                                            onChange={(value) =>
                                                handleChange(
                                                    index,
                                                    "payor_type",
                                                    value,
                                                )
                                            }
                                            placeholder="Seçiniz"
                                            options={payorTypes}
                                            value={item.payor_type}
                                        />
                                    </Grid.Cell>
                                    <Grid.Cell
                                        columnSpan={{
                                            xs: 2,
                                            md: 2,
                                            lg: 2,
                                            xl: 2,
                                            xxl: 2,
                                        }}
                                    >
                                        <Select
                                            onChange={(value) =>
                                                handleChange(
                                                    index,
                                                    "payment_type",
                                                    value,
                                                )
                                            }
                                            placeholder="Seçiniz"
                                            options={paymentTypes}
                                            value={item.payment_type}
                                        />
                                    </Grid.Cell>
                                    <Grid.Cell>
                                        <InlineStack align="end">
                                            <Button
                                                variant="tertiary"
                                                icon={DeleteIcon}
                                                onClick={() =>
                                                    handleDelete(index)
                                                }
                                            />
                                        </InlineStack>
                                    </Grid.Cell>
                                    <Grid.Cell
                                        columnSpan={{
                                            xs: 12,
                                            md: 12,
                                            lg: 12,
                                            xl: 12,
                                            xxl: 12,
                                        }}
                                    >
                                        <Divider />
                                    </Grid.Cell>
                                </Grid>
                            ))}
                            <Button
                                fullWidth
                                variant="secondary"
                                onClick={handleAdd}
                                icon={PlusIcon}
                            >
                                Ekle
                            </Button>
                        </BlockStack>
                    </form>
                </FormLayout>
            </BlockStack>
        </Box>
    );
}
