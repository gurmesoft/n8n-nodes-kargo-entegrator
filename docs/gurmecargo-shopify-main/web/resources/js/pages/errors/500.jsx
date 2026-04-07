import {
    CalloutCard,
    Page,
    Box,
    BlockStack,
    Link,
    Layout,
    DescriptionList,
    Button,
} from "@shopify/polaris";
import { useState } from "react";
import MainApp from "@/MainApp";

export default function ({ exception }) {
    const [descs, setDescs] = useState([
        {
            term: "API Anahtarınızı Kontrol Edin",
            description:
                "Uygulama üzerinden aldığınız API anahtarınızın doğru bir şekilde kayıt ettiğinizden emin olun. API anahtarınıza uygulama içerisinden Ayarlar - API bölümünden ulaşabilirsiniz.",
        },
        {
            term: "Konum Ayarları Kontrol Edin",
            description:
                "Gönderilerinizi oluşturabilmeniz için depo-konumlarınızın ayarlarının doğru bir şekilde kayıt edilmiş olduğundan emin olun. Konum ayarlarına sağ menüden ulaşabilirsiniz.",
        },
        {
            term: "Eksik Sipariş Bilgileri",
            description:
                "Manuel yaratılmış yada eksik bilgi ile alınmış siparişler hataya sebebiyet verebilir. Siparişte gönderim adresi olduğundan ve silinmemiş en az bir adet ürün olduğundan emin olun.",
        },
    ]);
    return (
        <MainApp>
            <Page>
                <Layout sectioned>
                    <BlockStack gap="600" inlineAlign="center">
                        <Link url="https://kargoentegrator.com" target="_blank">
                            <img
                                src="/assets/images/Kargo-Entegrator-Logolar/SVG/kargo-entegrator.svg"
                                alt="Trophy"
                                style={{ height: "32px" }}
                            />
                        </Link>
                        <CalloutCard
                            title="Üzgünüz😥 Beklenmedik bir hata oluştu !"
                            illustration="/assets/images/robot.png"
                            primaryAction={{
                                content: "Bizimle İletişime Geçin",
                                url: "https://kargoentegrator.com/iletisim/",
                            }}
                            secondaryAction={{
                                content: "Yardım Dökümanları",
                                url: "https://yardim.gurmehub.com/docs/kargo-entegrator/",
                            }}
                        >
                            <BlockStack gap="600">
                                <p>
                                    Gönderi oluştururken yaşanan aksaklıklar
                                    aşağıdaki maddelerden kaynaklanabilir.
                                    Maddeleri kontrol ettikten sonra hala bu
                                    sayfa ile karşılaşmaya devam ediyorsanız
                                    lütfen bizimle iletişime geçin. Yardımcı
                                    olmaktan memnuniyet duyarız.
                                </p>
                                <DescriptionList items={descs} />
                            </BlockStack>
                        </CalloutCard>
                    </BlockStack>
                </Layout>
            </Page>
        </MainApp>
    );
}
