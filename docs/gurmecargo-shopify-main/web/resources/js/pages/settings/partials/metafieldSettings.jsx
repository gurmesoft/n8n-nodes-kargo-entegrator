import {
    Layout,
    Box,
    Text,
    TextField,
    FormLayout,
    InlineGrid,
} from "@shopify/polaris";
import { useForm, usePage } from "@inertiajs/react";
import request from "@/plugins/request";
import { SaveBar } from "@shopify/app-bridge-react";

export default function MetafieldSettings() {
    const { props } = usePage();
    const metafieldSettings = props.metafieldSettings;

    const initial = metafieldSettings.reduce((carry, setting) => {
        if (setting?.target_field) {
            carry[setting.target_field] = setting.metafield_key;
        }

        return carry;
    }, {});

    const { data, setData, errors } = useForm({
        name: initial.name,
        surname: initial.surname,
        phone: initial.phone,
        address: initial.address,
        city: initial.city,
        district: initial.district,
        email: initial.email,
        country: initial.country,
        desi: initial.desi,
    });

    const handleSubmit = () => {
        request("/settings/metafields", "PATCH", data, () => {
            shopify.toast.show("Ayarlar kayıt edildi.");
            window.location.reload();
        });
    };

    const handleCancel = () => {
        setData(initial);
        shopify.saveBar.hide("save-bar");
    };

    return (
        <Box padding="500">
            <SaveBar id="save-bar">
                <button variant={"primary"} onClick={handleSubmit}>
                    Kaydet
                </button>
                <button onClick={handleCancel}>Vazgeç</button>
            </SaveBar>
            <Layout>
                <Layout.Section>
                    <Box padding="400">
                        <Box paddingBlockEnd="300">
                            <Text as="h1" variant="headingMd">
                                Metafield Ayarları
                            </Text>
                            <Text as="p" variant="bodyMd" tone="subdued">
                                Shopify metafield&apos;larını hangi adres
                                alanlarına bağlamak istediğinizi buradan
                                tanımlayabilirsiniz. Verilen değerler
                                namespace.key alanları olmalıdır.
                            </Text>
                        </Box>

                        <Text as="h2" variant="headingSm">
                            Müşteri Metafield Ayarları
                        </Text>
                        <Text as="p" variant="bodySm" tone="subdued">
                            Shopify Plus müşterileri için önerilir. Müşteri bilgilerinin alınacağı sipariş metafield'larını buradan tanımlayabilirsiniz.
                        </Text>
                        <FormLayout>
                            <form
                                id="metafield-settings-form"
                                onInput={() => {
                                    shopify.saveBar.show("save-bar");
                                }}
                            >
                                <InlineGrid gap="200" columns={4}>
                                    <TextField
                                        label="İsim"
                                        value={data.name}
                                        onChange={(value) =>
                                            setData("name", value)
                                        }
                                        autoComplete="off"
                                        error={errors.name}
                                    />
                                    <TextField
                                        label="Soyisim"
                                        value={data.surname}
                                        onChange={(value) =>
                                            setData("surname", value)
                                        }
                                        autoComplete="off"
                                        error={errors.surname}
                                    />
                                    <TextField
                                        label="Telefon"
                                        value={data.phone}
                                        onChange={(value) =>
                                            setData("phone", value)
                                        }
                                        autoComplete="off"
                                        error={errors.phone}
                                    />
                                    <TextField
                                        label="E-posta"
                                        value={data.email}
                                        onChange={(value) =>
                                            setData("email", value)
                                        }
                                        autoComplete="off"
                                        error={errors.email}
                                    />
                                    <TextField
                                        label="Adres"
                                        value={data.address}
                                        onChange={(value) =>
                                            setData("address", value)
                                        }
                                        autoComplete="off"
                                        error={errors.address}
                                    />
                                    <TextField
                                        label="İlçe"
                                        value={data.district}
                                        onChange={(value) =>
                                            setData("district", value)
                                        }
                                        autoComplete="off"
                                        error={errors.district}
                                    />
                                    <TextField
                                        label="İl"
                                        value={data.city}
                                        onChange={(value) =>
                                            setData("city", value)
                                        }
                                        autoComplete="off"
                                        error={errors.city}
                                    />
                                    <TextField
                                        label="Ülke"
                                        value={data.country}
                                        onChange={(value) =>
                                            setData("country", value)
                                        }
                                        autoComplete="off"
                                        error={errors.country}
                                    />
                                </InlineGrid>
                            </form>
                        </FormLayout>

                        <Box paddingBlockStart="600">
                            <Text as="h2" variant="headingSm">
                                Ürün Metafield Ayarları
                            </Text>
                            <Text as="p" variant="bodySm" tone="subdued">
                                Ayarlar &gt; Meta Alanlar ve Meta Nesneler
                                menüsünden ürünlere ait bir meta alan tanımı
                                oluşturup, ilgili değeri buraya
                                ekleyebilirsiniz.
                            </Text>
                        </Box>
                        <FormLayout>
                            <form
                                id="metafield-settings-form"
                                onInput={() => {
                                    shopify.saveBar.show("save-bar");
                                }}
                            >
                                <InlineGrid gap="200" columns={4}>
                                    <TextField
                                        label="Desi"
                                        value={data.desi}
                                        onChange={(value) =>
                                            setData("desi", value)
                                        }
                                        error={errors.desi}
                                    />
                                </InlineGrid>
                            </form>
                        </FormLayout>
                    </Box>
                </Layout.Section>
            </Layout>
        </Box>
    );
}
