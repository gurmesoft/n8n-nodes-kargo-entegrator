import {
    BlockStack,
    Box,
    Checkbox,
    Link,
    Text,
    TextField,
    InlineStack,
} from "@shopify/polaris";
import { SaveBar } from "@shopify/app-bridge-react";
import { useEffect, useState } from "react";
import request from "@/plugins/request";

export default function OtherSettings({ otherSettings }) {
    const [fulfillmentUpdate, setFulfillmentUpdate] = useState(
        otherSettings?.fulfillment_update ?? false
    );
    const [barcodeMetafield, setBarcodeMetafield] = useState(
        otherSettings?.barcode_metafield ?? false
    );
    const [barcodeNumber, setBarcodeNumber] = useState(
        otherSettings?.barcode_number ?? false
    );
    const [barcodeNumberFormat, setBarcodeNumberFormat] = useState(
        otherSettings?.barcode_number_format ?? "123${orderNumber}"
    );
    const [packageCountEnabled, setPackageCountEnabled] = useState(
        otherSettings?.package_count_enabled ?? false
    );
    const [packageCountPerItem, setPackageCountPerItem] = useState(
        otherSettings?.package_count_per_item ?? 1
    );
    const [desiSumEnabled, setDesiSumEnabled] = useState(
        otherSettings?.desi_sum_enabled ?? false
    );
    const handleCancel = () => {
        setFulfillmentUpdate(otherSettings?.fulfillment_update ?? false);
        setBarcodeMetafield(otherSettings?.barcode_metafield ?? false);
        setBarcodeNumber(otherSettings?.barcode_number ?? false);
        setBarcodeNumberFormat(
            otherSettings?.barcode_number_format ?? "123${orderNumber}"
        );
        setPackageCountEnabled(otherSettings?.package_count_enabled ?? false);
        setPackageCountPerItem(otherSettings?.package_count_per_item ?? 1);
        setDesiSumEnabled(otherSettings?.desi_sum_enabled ?? false);
        shopify.saveBar.hide("save-bar");
    };
    const handleSubmit = async () => {
        await request(
            "/settings/other-settings",
            "POST",
            {
                fulfillment_update: fulfillmentUpdate,
                barcode_metafield: barcodeMetafield,
                barcode_number: barcodeNumber,
                barcode_number_format: barcodeNumberFormat,
                package_count_enabled: packageCountEnabled,
                package_count_per_item: packageCountPerItem,
                desi_sum_enabled: desiSumEnabled,
            },
            () => {
                shopify.toast.show("Ayarlar kayıt edildi.");
                window.location.reload();
            }
        );
    };

    const [formatError, setFormatError] = useState("");
    const [canSave, setCanSave] = useState(true);

    useEffect(() => {
        if (!barcodeNumber) {
            setFormatError("");
            setCanSave(true);
            return;
        }

        const hasPlaceholder =
            barcodeNumberFormat.includes("${orderNumber}") ||
            barcodeNumberFormat.includes("${orderGlobalNumber}");

        const withoutPlaceholders = barcodeNumberFormat
            .replace(/\$\{orderNumber\}/g, "")
            .replace(/\$\{orderGlobalNumber\}/g, "");

        // Check if anything other than digits remains
        const containsInvalidChars = /[^0-9]/.test(withoutPlaceholders);

        if (containsInvalidChars) {
            setFormatError(
                "Sadece rakamlar ve değişkenler kullanılabilir (örn: ${orderNumber}1)"
            );
            setCanSave(false);
        } else if (!hasPlaceholder) {
            setFormatError(
                "En az bir değişken kullanmalısınız (${orderNumber} veya ${orderGlobalNumber})"
            );
            setCanSave(false);
        } else {
            setFormatError("");
            setCanSave(true);
        }
    }, [barcodeNumberFormat, barcodeNumber]);

    return (
        <Box padding="500">
            <BlockStack gap="200">
                <Text variant="headingSm" as="h1">
                    Diğer Ayarlar
                </Text>
                <SaveBar id="save-bar">
                    <button
                        variant={"primary"}
                        onClick={handleSubmit}
                        disabled={barcodeNumber && !canSave}
                    >
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
                        <BlockStack gap="100">
                            <Checkbox
                                label="Kargo takip bilgileri oluştuktan sonra siparişi gönderildi olarak işaretle, bu seçenek aktif değilse barkod oluştuğunda siparişiniz gönderildi olarak işaretlenecektir"
                                checked={fulfillmentUpdate}
                                onChange={(value) =>
                                    setFulfillmentUpdate(value)
                                }
                            />
                            {fulfillmentUpdate && (
                                <Text variant="bodySm" as="p" tone="subdued">
                                    Kargo barkodu oluştuğunda gönderimi durumunu
                                    değiştirmek istemiyorsanız işaretleyiniz. Bu
                                    ayar aktifleştirilirse gönderinin durumu
                                    Kargo Entegratör tarafındanki Yola Çıktı
                                    durumu ile değişmeye başlar.
                                </Text>
                            )}
                        </BlockStack>
                        <BlockStack gap="100">
                            <Checkbox
                                label="Barkod oluştuktan sonra siparişin özel alanını (metafield) güncelle"
                                checked={barcodeMetafield}
                                onChange={(value) => setBarcodeMetafield(value)}
                            />
                            {barcodeMetafield && (
                                <Text variant="bodySm" as="p" tone="subdued">
                                    Üçüncü parti uygulamaların okuyabilmesi
                                    için, siparişin özel alanına barkod ve kargo
                                    firması bilgilerini ekler. Meta verisine
                                    'kargo_entegrator' isim alanı üzerinden
                                    erişilebilir. Detaylı bilgi için{" "}
                                    <Link
                                        url="https://yardim.gurmehub.com/docs/kargo-entegrator/shopify-uygulamasi/shopify-barkod-verisine-ulasmak-hk/"
                                        target="_blank"
                                    >
                                        tıklayınız.
                                    </Link>
                                </Text>
                            )}
                        </BlockStack>
                        <BlockStack gap="100">
                            <Checkbox
                                label="Barkod numarasını sipariş numarası olarak kullan"
                                checked={barcodeNumber}
                                onChange={(value) => setBarcodeNumber(value)}
                            />
                            {barcodeNumber && (
                                <BlockStack gap="100">
                                    <Text
                                        variant="bodySm"
                                        as="p"
                                        tone="subdued"
                                    >
                                        Barkod numarasını sipariş numarası veya
                                        global id olarak kullanmak için
                                        işaretleyin.{" "}
                                        <Text as="span" tone="critical">
                                            Bu ayar her kargo firması için
                                            kullanılamayabilir.
                                        </Text>
                                    </Text>
                                    <TextField
                                        label="Barkod Format"
                                        value={barcodeNumberFormat}
                                        error={formatError}
                                        onChange={(value) =>
                                            setBarcodeNumberFormat(value)
                                        }
                                        helpText="Örnek: 123${orderNumber}, 12${orderGlobalNumber}16"
                                    />
                                </BlockStack>
                            )}
                        </BlockStack>
                        <BlockStack gap="100">
                            <Checkbox
                                label="Ürün başına paket sayısı"
                                checked={packageCountEnabled}
                                onChange={(value) =>
                                    setPackageCountEnabled(value)
                                }
                            />
                            {packageCountEnabled && (
                                <BlockStack gap="100">
                                    <Text
                                        variant="bodySm"
                                        as="p"
                                        tone="subdued"
                                    >
                                        Bu ayar aktif olduğunda, ürün başına kaç
                                        paket kullanılacağını belirler. Eğer
                                        aktif değilse gönderide 1 paket
                                        kullanılır.{" "}
                                        <Text as="span" tone="caution">
                                            Örn: 2 ürün varsa ve bu değer 3 ise
                                            toplam 6 paket hesaplanır.
                                        </Text>
                                    </Text>
                                    <InlineStack
                                        gap="100"
                                        blockAlign="center"
                                        inlineAlign="center"
                                    >
                                        <Text variant="bodySm" as="p">
                                            Her ürün için
                                        </Text>
                                        <TextField
                                            type="number"
                                            value={packageCountPerItem.toString()}
                                            onChange={(value) =>
                                                setPackageCountPerItem(
                                                    parseInt(value) || 1
                                                )
                                            }
                                        />
                                        <Text variant="bodySm" as="p">
                                            paket kullanılır.
                                        </Text>
                                    </InlineStack>
                                </BlockStack>
                            )}
                        </BlockStack>
                        <BlockStack gap="100">
                            <Checkbox
                                label="Gönderideki en büyük desi değeri kullanılsın."
                                checked={desiSumEnabled}
                                onChange={(value) => setDesiSumEnabled(value)}
                            />
                            {desiSumEnabled && (
                                <BlockStack gap="100">
                                    <Text variant="bodySm" as="p">
                                        Bu seçenek aktif olduğunda, ürünlerin arasındaki en büyük desi değeri kullanılır. Eğer gönderideki ürünlerin desilerinin toplanarak artmasını istiyorsanız bu ayarı kapatın.
                                    </Text>
                                </BlockStack>
                            )}
                        </BlockStack>
                    </BlockStack>
                </form>
            </BlockStack>
        </Box>
    );
}
