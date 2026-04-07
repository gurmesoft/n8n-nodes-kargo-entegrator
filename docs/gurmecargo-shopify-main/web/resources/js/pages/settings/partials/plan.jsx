import {
    BlockStack,
    InlineStack,
    Text,
    Layout,
    ProgressBar,
} from "@shopify/polaris";

export function Plan({ plan }) {
    const progress = (plan.usage_limit / plan.base.usage_limit) * 100;
    return (
        <Layout>
            <Layout.Section>
                <BlockStack gap="200">
                    <Text as="h1" variant="headingSm">
                        Plan Bilgileri
                    </Text>

                    <BlockStack gap="400">
                        <Text variant="bodyLg" as="p" autosize>
                            <Text as="span" tone="success">
                                {plan.base.title}
                            </Text>{" "}
                            Planını kullanmaktasınız.
                        </Text>
                        <Text variant="bodyMd" as="p" autosize>
                            Kullanım süreniz{" "}
                            <Text as="span" tone="critical">
                                {plan.expires_at}
                            </Text>{" "}
                            tarihinde sona erecektir. Yeni bir plana geçiş
                            yaparak uygulamayı kullanmaya devam edebilirsiniz.
                        </Text>
                    </BlockStack>
                </BlockStack>
            </Layout.Section>
            <Layout.Section variant="oneThird">
                <ProgressBar progress={progress} size="small" tone="success" />
                <InlineStack align="center">
                    <Text>
                        <Text as="span" tone="critical">
                            {plan.usage_limit} / {plan.base.usage_limit}
                        </Text>{" "}
                        kullanım hakkınız kaldı.
                    </Text>
                </InlineStack>
            </Layout.Section>
        </Layout>
    );
}
