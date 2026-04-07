import MainApp from "@/MainApp";
import {
    CalloutCard,
    Page,
    Text,
} from "@shopify/polaris";
import { AppExtensionIcon, PlayIcon } from "@shopify/polaris-icons";

export default function OtherProducts() {
    return (
        <MainApp>
            <Page title="Diğer Ürünlerimiz">
                <CalloutCard
                    title="Fatura Entegratör"
                    primaryAction={{
                        icon: AppExtensionIcon,
                        content: "Fatura Entegratör'ü İncele",
                        url: "https://apps.shopify.com/fatura-entegrator?locale=tr",
                        external: true,
                        variant: "primary",
                    }}
                    secondaryAction={{
                        icon: PlayIcon,
                        content: "Demo izle",
                        url: "https://www.youtube.com/watch?v=q25TOTBV06E",
                        external: true,
                    }}
                    illustration="/assets/images/fatura-favicon.svg"
                >
                    <Text as="p" variant="bodyMd">
                        Fatura Entegratör, Shopify siparişlerinizi otomatik
                        olarak GİB uyumlu e-faturalara dönüştürerek zaman
                        kazandırır. Logo, BizimHesap, Paraşüt gibi ön muhasebe
                        yazılımları ve özel fatura entegratörleriyle uyumlu
                        çalışır. Kurumsal ve bireysel fatura
                        seçenekleri sunar. Sipariş durumuna göre otomatik fatura
                        ve e-posta gönderimi sağlar.
                    </Text>
                </CalloutCard>
            </Page>
        </MainApp>
    );
}
