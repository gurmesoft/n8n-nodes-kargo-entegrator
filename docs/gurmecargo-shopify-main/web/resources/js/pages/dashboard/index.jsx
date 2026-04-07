import {
    Card,
    Button,
    BlockStack,
    Layout,
    Page,
    Link,
    MediaCard,
    VideoThumbnail,
    Text,
    InlineStack,
    Banner,
} from "@shopify/polaris";
import MainApp from "@/MainApp";

export default function Dashboard({ localizeData, appName }) {
    const redirect = window.localStorage.getItem("redirect");
    if (redirect) {
        window.localStorage.removeItem("redirect");
        document.body.innerHTML = "";
        document.body.style.margin = "0";
        document.body.style.padding = "0";
        window.location.replace(redirect);
        return null;
    }

    const handleVideoClick = () => {
        window.open("https://www.youtube.com/watch?v=8Hd-8J_zJSk", "_blank");
    };
    return (
        <MainApp>
            <Page>
                <Layout>
                    <Layout.Section>
                        <BlockStack inlineAlign="center">
                            <Link
                                url="https://kargoentegrator.com"
                                target="_blank"
                            >
                                <img
                                    src="/assets/images/Kargo-Entegrator-Logolar/SVG/kargo-entegrator.svg"
                                    alt="Trophy"
                                    style={{ height: "32px" }}
                                />
                            </Link>
                        </BlockStack>
                    </Layout.Section>
                    {localizeData.user.api_key === "" && (
                        <Layout.Section>
                            <Banner
                                title="API bağlantınız eksik."
                                tone="warning"
                            >
                                Bağlantınızı ayarlamak için{" "}
                                <Link
                                    monochrome
                                    onClick={() => {
                                        open(
                                            `shopify://admin/apps/${appName}/settings`,
                                            "_self",
                                        );
                                    }}
                                >
                                    Buraya
                                </Link>{" "}
                                tıklayın.
                            </Banner>
                        </Layout.Section>
                    )}
                    <Layout.Section>
                        <MediaCard
                            title="Kargo Entegrator İle Tanışın 👋"
                            description="Shopify Kargo Entegrasyonu ile e-ticaret sitenizin kargo işlemlerini kolayca yönetin. Kargo Entegratör, Shopify ile tam uyumlu çalışarak siparişlerinizi otomatik olarak kargo firmalarına iletir ve barkod çıkarımını zahmetsizce yapar. Sipariş takibi ve gönderim süreçlerini anlık izleyebilir, kullanıcı dostu arayüzü sayesinde entegrasyonu teknik bilgi gerekmeden tamamlayabilirsiniz. Bu sayede müşteri memnuniyetini artırarak işletmenizin verimliliğini yükseltebilirsiniz."
                            primaryAction={{
                                content: "Panele Giriş Yapın",
                                url: "https://app.kargoentegrator.com/login",
                            }}
                            secondaryAction={{
                                content: "Bizimle İletişime Geçin",
                                url: "https://kargoentegrator.com/iletisim/",
                            }}
                        >
                            <VideoThumbnail
                                videoLength={232}
                                thumbnailUrl="https://kargoentegrator.com/wp-content/uploads/2024/09/Shopify-Kargo-Entegrasyonu-Nasil-Yapilir.png"
                                onClick={handleVideoClick}
                            />
                        </MediaCard>
                    </Layout.Section>
                    <Layout.Section>
                        <Card padding="0">
                            <img
                                src="/assets/images/dashboard.png"
                                alt="dashboard"
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                }}
                            />
                        </Card>
                    </Layout.Section>
                    <Layout.Section>
                        <Card>
                            <BlockStack inlineAlign="center" gap="400">
                                <Text as="h2" variant="headingMd">
                                    Kargo Gönderiminizi Daha Kolay ve Hızlı Hale
                                    Getirin!
                                </Text>
                                <Text as="p" alignment="center">
                                    İlk 10 gönderiniz için Kargo Entegratör'ü
                                    ücretsiz bir şekilde deneyebilirsiniz! Kargo
                                    Entegratör ile kargo süreçlerinizi
                                    kolaylaştırmaya sadece bir tık uzaktasınız!
                                </Text>
                                <InlineStack gap="600" blockAlign="center">
                                    <Button
                                        variant="primary"
                                        url="https://kargoentegrator.com/fiyatlandirma/"
                                        external
                                    >
                                        Fiyatlandırma
                                    </Button>
                                    <Link
                                        url="https://yardim.gurmehub.com/docs/kargo-entegrator/"
                                        target="_blank"
                                    >
                                        Yardım Dökümanları
                                    </Link>
                                </InlineStack>
                            </BlockStack>
                        </Card>
                    </Layout.Section>
                </Layout>
            </Page>
        </MainApp>
    );
}
