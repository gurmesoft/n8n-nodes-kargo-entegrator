import {
    BlockStack,
    Box,
    Checkbox,
    InlineStack,
    Select,
    Text,
} from "@shopify/polaris";
import { useCallback, useState } from "react";
import request from "@/plugins/request";
import { SaveBar } from "@shopify/app-bridge-react";

export default function AutomaticBarcodeSettings({ user }) {
    const [checked, setChecked] = useState(
        user.automatic_shipment_setting?.is_enabled ?? false
    );
    const [selected, setSelected] = useState(
        user.automatic_shipment_setting?.delay ?? "300"
    );
    const [fixAddressChecked, setFixAddressChecked] = useState(
        user.automatic_shipment_setting?.fix_address ?? false
    );

    const handleChange = useCallback((value) => setChecked(value), []);
    const handleFixAddressChange = useCallback(
        (value) => setFixAddressChecked(value),
        []
    );

    const handleCancel = () => {
        setChecked(user.automatic_shipment_setting?.is_enabled ?? false);
        setSelected(user.automatic_shipment_setting?.delay ?? "300");
        setFixAddressChecked(
            user.automatic_shipment_setting?.fix_address ?? false
        );
        shopify.saveBar.hide("save-bar");
    };

    const handleSubmit = async () => {
        await request(
            "/settings/automatic-shipment",
            "POST",
            {
                is_enabled: checked,
                delay: selected,
                fix_address: fixAddressChecked,
            },
            () => {
                shopify.saveBar.hide("save-bar");
                window.location.reload();
            }
        );
    };

    const options = [
        { label: "Hemen", value: "0" },
        { label: "5 dakika ", value: "300" },
        { label: "15 dakika ", value: "900" },
        { label: "45 dakika ", value: "2700" },
        { label: "2 saat ", value: "7200" },
        { label: "6 saat ", value: "21600" },
    ];

    const handleSelectChange = useCallback((value) => setSelected(value), []);

    return (
        <Box padding="500">
            <BlockStack gap="200">
                <Text variant="headingSm" as="h1">
                    Otomatik Gönderi Ayarları
                </Text>
                <SaveBar id="save-bar">
                    <button variant={"primary"} onClick={handleSubmit}>
                        Kaydet
                    </button>
                    <button onClick={handleCancel}>Vazgeç</button>
                </SaveBar>
                <form
                    onInput={() => {
                        shopify.saveBar.show("save-bar");
                    }}
                >
                    <BlockStack gap="200">
                        <Checkbox
                            label="Otomatik Gönderi Oluştur"
                            checked={checked}
                            onChange={handleChange}
                        />
                        {checked && (
                            <BlockStack gap="200">
                                <InlineStack gap="200" blockAlign="center">
                                    <Text>Sipariş oluştuktan </Text>
                                    <Select
                                        options={options}
                                        onChange={handleSelectChange}
                                        value={selected}
                                    />
                                    <Text>
                                        {" "}
                                        sonra otomatik gönderi oluştur.
                                    </Text>
                                </InlineStack>
                                <Checkbox
                                    label="AI ile Adres Düzeltme"
                                    checked={fixAddressChecked}
                                    onChange={handleFixAddressChange}
                                    helpText={
                                        <Text>
                                            <Text as="span" tone="critical">Önemli: </Text>
                                            Adres bilgilerini yapay zeka (GPT) kullanarak otomatik olarak analiz eder, eksik veya hatalı kısımları düzeltir ve standart biçime getirir. 
                                            Bu özellik, kullanıcı deneyimini iyileştirmeyi amaçlar ancak tüm adreslerin doğruluğunu garanti etmez. Ayarın etkinleştirilmesi, kullanıcı sorumluluğundadır. 
                                            Lütfen düzenlenen adresleri gerekli durumlarda manuel olarak kontrol edin.
                                        </Text>
                                    }
                                />
                            </BlockStack>
                        )}
                    </BlockStack>
                </form>
            </BlockStack>
        </Box>
    );
}
