import {
    ActionList,
    Badge,
    BlockStack,
    Box,
    Button,
    ButtonGroup,
    Card,
    InlineStack,
    Link,
    Page,
    Popover,
    Spinner,
    Text,
} from "@shopify/polaris";
import MainApp from "../../MainApp";
import { useState, useEffect } from "react";
import request from "../../plugins/request";
import { uiStore } from "@/store/ui";

export default function ({
    tracking_page,
    user_name,
    page_id,
    published_at,
    theme_id,
    id,
    appName,
}) {
    const [actionActive, toggleAction] = useState(false);
    const { loading } = uiStore();

    useEffect(() => {
        if (!tracking_page) {
            request("/tracking", "POST", null, (data) => {
                if (data.success && data.tracking_page) {
                    window.location.reload();
                }
            });
        }
    }, []);

    const deletePage = () => {
        if (tracking_page) {
            request(`/tracking/${id}`, "DELETE", null, (data) => {
                open(`shopify://admin/apps/${appName}/`, "_self");
            });
        }
    };

    const handleToggleAction = () => {
        toggleAction(!actionActive);
    };

    const disclosureButtonActivator = (
        <Button
            disclosure
            accessibilityLabel="More"
            onClick={handleToggleAction}
        >
            Daha fazla
        </Button>
    );

    const disclosureButton = (
        <Popover
            active={actionActive}
            activator={disclosureButtonActivator}
            onClose={handleToggleAction}
        >
            <Box padding="100">
                <BlockStack gap="100">
                    <Button
                        variant="tertiary"
                        textAlign="start"
                        url={`https://${user_name}/pages/${tracking_page}`}
                    >
                        Önizle
                    </Button>
                    <Button
                        variant="tertiary"
                        textAlign="start"
                        tone="critical"
                        onClick={deletePage}
                    >
                        Sil
                    </Button>
                    <Button
                        variant="tertiary"
                        textAlign="start"
                        url={`shopify://admin/pages/${page_id}`}
                    >
                        Sayfayı Düzenle
                    </Button>
                </BlockStack>
            </Box>
        </Popover>
    );
    return (
        <MainApp>
            <Page
                title="Takip Sayfası"
                subtitle="Senin mağazanda müşterilerin bu sayfayı görebilecek."
            >
                <Card title="Takip">
                    {loading || !tracking_page ? (
                        <BlockStack align="center" inlineAlign="center">
                            <Spinner
                                accessibilityLabel="Loading"
                                size="large"
                            />
                            <Text variant="headingMd" as="p">
                                Sayfanız oluşturuluyor. Lütfen bekleyiniz.
                            </Text>
                        </BlockStack>
                    ) : (
                        <BlockStack gap="200">
                            <InlineStack gap="200">
                                <Text as="h2" variant="headingMd">
                                    Track your order
                                </Text>
                                <Badge tone="success">Shopify Open Store</Badge>
                            </InlineStack>
                            <Text>Published : {published_at}</Text>
                            <Link
                                url={`https://${user_name}/pages/${tracking_page}`}
                            >
                                https://{user_name}/pages/tracking-page
                            </Link>
                            <InlineStack align="end">
                                <ButtonGroup>
                                    {disclosureButton}
                                    <Button
                                        url={`shopify://admin/themes/${theme_id}/editor?previewPath=%2Fpages%2Ftracking-page`}
                                        target="_blank"
                                    >
                                        Düzenle
                                    </Button>
                                </ButtonGroup>
                            </InlineStack>
                        </BlockStack>
                    )}
                </Card>
            </Page>
        </MainApp>
    );
}
