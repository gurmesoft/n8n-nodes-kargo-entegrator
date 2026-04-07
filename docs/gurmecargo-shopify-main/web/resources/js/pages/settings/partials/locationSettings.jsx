import {
    Card,
    FormLayout,
    Select,
    Text,
    BlockStack,
    Grid,
    Link,
    Box,
    InlineStack,
    Button,
} from "@shopify/polaris";
import { packageTypes, payorTypes, paymentTypes } from "@/utils/fields";
import { useState } from "react";
import request from "@/plugins/request";
import { uiStore } from "@/store/ui";
import { SaveBar } from "@shopify/app-bridge-react";

export default function LocationSettings({
    locationSettings,
    locations,
    cargoIntegrations,
    warehouses,
}) {
    const [data, setData] = useState(locationSettings);
    const { setErrorMessage } = uiStore();

    const locationData = (location) => {
        return locations.find((e) => e.id === location.location_id);
    };

    const dataHandler = (id, key, value) => {
        setData((prevData) =>
            prevData.map((location) =>
                location.location_id === id
                    ? { ...location, [key]: value }
                    : location
            )
        );
    };

    const handleCancel = () => {
        setData(locationSettings);
        shopify.saveBar.hide("save-bar");
    };

    const save = () => {
        if (data.some((e) => !e.warehouse_id || !e.cargo_integration_id)) {
            setErrorMessage(
                "Shopifydaki gönderim konumlarınız ile Kargo Entegratördeki ayarlarınızı tüm alanları doğru seçerek yapılandırmadınız. Lütfen kontrol ediniz."
            );
            return;
        }
        request("/location-settings", "PATCH", data, () => {
            shopify.toast.show("Ayarlar kayıt edildi.");
            window.location.reload();
        });
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
                        Konum Ayarları
                    </Text>
                </InlineStack>
                <BlockStack gap="400">
                    <Text as="p" variant="bodyMd">
                        Gönderim konumlarınız için varsayılan değerlerinizi
                        ayarlayın. Bu değerler istenirse gönderi oluşturma
                        aşamasında düzenlenebilir.
                    </Text>
                    {data.map((location, index) => (
                        <Grid key={index}>
                            <Grid.Cell
                                columnSpan={{
                                    xs: 6,
                                    sm: 6,
                                    md: 1,
                                    lg: 2,
                                    xl: 2,
                                }}
                            >
                                <Text as="h2" variant="headingSm">
                                    {locationData(location).name}
                                </Text>
                                <Text tone="subdued" as="p">
                                    {`${
                                        locationData(location).address1
                                            ? locationData(location).address1
                                            : ""
                                    } ${
                                        locationData(location).address2
                                            ? locationData(location).address2
                                            : ""
                                    } ${
                                        locationData(location).city
                                            ? locationData(location).city
                                            : ""
                                    }/${
                                        locationData(location).country
                                            ? locationData(location).country
                                            : ""
                                    } `}
                                </Text>

                                {locationData(location).phone && (
                                    <Text tone="subdued" as="p">
                                        {locationData(location).phone}
                                    </Text>
                                )}
                            </Grid.Cell>
                            <Grid.Cell
                                columnSpan={{
                                    xs: 6,
                                    sm: 6,
                                    md: 5,
                                    lg: 10,
                                    xl: 10,
                                }}
                            >
                                <Card sectioned>
                                    <FormLayout>
                                        <form
                                            id="location-settings-form"
                                            onInput={() => {
                                                shopify.saveBar.show(
                                                    "save-bar"
                                                );
                                            }}
                                        >
                                            <Grid gap="200">
                                                <Grid.Cell
                                                    columnSpan={{ xs: 6 }}
                                                >
                                                    {warehouses.length ? (
                                                        <Select
                                                            label="Varsayılan Depo Adresi"
                                                            onChange={(value) =>
                                                                dataHandler(
                                                                    location.location_id,
                                                                    "warehouse_id",
                                                                    parseInt(
                                                                        value
                                                                    )
                                                                )
                                                            }
                                                            placeholder="Lütfen depo adresi seçiniz"
                                                            options={warehouses.map(
                                                                (e) => ({
                                                                    label: e.name,
                                                                    value: e.id,
                                                                })
                                                            )}
                                                            value={
                                                                location.warehouse_id
                                                            }
                                                        />
                                                    ) : (
                                                        <Text tone="critical">
                                                            Depo eklenmemiş.{" "}
                                                            <Link url="https://app.kargoentegrator.com/warehouse">
                                                                Buradan
                                                            </Link>{" "}
                                                            depo eklemeye
                                                            gidebilirsiniz.
                                                        </Text>
                                                    )}
                                                </Grid.Cell>
                                                <Grid.Cell
                                                    columnSpan={{ xs: 6 }}
                                                >
                                                    {cargoIntegrations.length ? (
                                                        <Select
                                                            label="Varsayılan Kargo Hesabı"
                                                            onChange={(value) =>
                                                                dataHandler(
                                                                    location.location_id,
                                                                    "cargo_integration_id",
                                                                    parseInt(
                                                                        value
                                                                    )
                                                                )
                                                            }
                                                            placeholder="Lütfen kargo hesabı seçiniz"
                                                            options={cargoIntegrations.map(
                                                                (e) => ({
                                                                    label: e.name,
                                                                    value: e.id,
                                                                })
                                                            )}
                                                            value={
                                                                location.cargo_integration_id
                                                            }
                                                        />
                                                    ) : (
                                                        <Text tone="critical">
                                                            Kargo entegrasyonu
                                                            eklenmemiş.{" "}
                                                            <Link url="https://app.kargoentegrator.com/integration/cargo">
                                                                Buradan
                                                            </Link>{" "}
                                                            kargo entegrasyonu
                                                            eklemeye
                                                            gidebilirsiniz.
                                                        </Text>
                                                    )}
                                                </Grid.Cell>

                                                <Grid.Cell
                                                    columnSpan={{ xs: 4 }}
                                                >
                                                    <Select
                                                        label="Varsayılan Paket Tipi"
                                                        onChange={(value) =>
                                                            dataHandler(
                                                                location.location_id,
                                                                "package_type",
                                                                value
                                                            )
                                                        }
                                                        options={packageTypes}
                                                        value={
                                                            location.package_type
                                                        }
                                                    />
                                                </Grid.Cell>
                                                <Grid.Cell
                                                    columnSpan={{ xs: 4 }}
                                                >
                                                    <Select
                                                        label="Varsayılan Ödeme Yapacak Taraf"
                                                        onChange={(value) =>
                                                            dataHandler(
                                                                location.location_id,
                                                                "payor_type",
                                                                value
                                                            )
                                                        }
                                                        options={payorTypes}
                                                        value={
                                                            location.payor_type
                                                        }
                                                    />
                                                </Grid.Cell>
                                                <Grid.Cell
                                                    columnSpan={{ xs: 4 }}
                                                >
                                                    <Select
                                                        label="Varsayılan Ödeme Tipi"
                                                        onChange={(value) =>
                                                            dataHandler(
                                                                location.location_id,
                                                                "payment_type",
                                                                value
                                                            )
                                                        }
                                                        options={paymentTypes}
                                                        value={
                                                            location.payment_type
                                                        }
                                                    />
                                                </Grid.Cell>
                                            </Grid>
                                        </form>
                                    </FormLayout>
                                </Card>
                            </Grid.Cell>
                        </Grid>
                    ))}
                </BlockStack>
            </BlockStack>
        </Box>
    );
}
