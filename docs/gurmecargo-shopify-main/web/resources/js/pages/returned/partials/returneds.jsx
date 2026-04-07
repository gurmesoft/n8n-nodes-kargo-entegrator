import {
    Badge,
    BlockStack,
    Box,
    Button,
    ButtonGroup,
    Card,
    Divider,
    InlineStack,
    Link,
    Text,
    Thumbnail,
    ResourceList,
    Popover,
    List,
} from "@shopify/polaris";
import { ImageIcon, MenuHorizontalIcon } from "@shopify/polaris-icons";
import { Modal, TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { useState } from "react";
import Print from "@/components/print";
import moment from "moment";
import request from "@/plugins/request";
import "moment/dist/locale/tr";
import { uiStore } from "@/store/ui";

export default function Returneds({ returneds }) {
    const { loading } = uiStore();
    const formatTime = (date) => {
        moment.locale("tr");
        return moment(date).format("lll");
    };
    const shopify = useAppBridge();
    const [printResponse, setPrintResponse] = useState(null);
    const [actionActive, toggleAction] = useState(returneds.map(() => false));
    const [printData, setPrintData] = useState(null);

    const print = async (returned) => {
        setPrintData(returned);
        setPrintResponse(
            await request("/api/print", "POST", {
                type: "returneds",
                ids: [returned.returned_id],
            })
        );
    };

    const destroy = async (id) => {
        await request(`/returned/${id}`, "DELETE");
        window.location.reload();
    };

    const statusMapping = {
        non_processed: "Gönderime Hazır",
        failed: "Hatalı",
        cancelled: "İptal Edildi",
        shipped: "Yola Çıktı",
        on_transit: "Taşıma Sürecinde",
        at_delivery_center: "Dağıtım Merkezinde",
        in_courier: "Dağıtıma Çıktı",
        delivered: "Teslim Edildi",
        on_return: "İade Sürecinde",
    };

    const handleToggleAction = (index) => {
        const updatedActions = [...actionActive];
        updatedActions[index] = !updatedActions[index];
        toggleAction(updatedActions);
    };

    const renderDisclosureButton = (returned, index) => (
        <Popover
            active={actionActive[index]}
            activator={
                <Button
                    accessibilityLabel="More"
                    onClick={() => handleToggleAction(index)}
                    icon={MenuHorizontalIcon}
                    variant="tertiary"
                ></Button>
            }
            onClose={() => handleToggleAction(index)}
        >
            <Box padding="150">
                <BlockStack inlineAlign="start">
                    <Button
                        onClick={() =>
                            shopify.modal.show(`${returned.return_id}-modal`)
                        }
                        variant="tertiary"
                    >
                        <Text variant="bodyMd">Detayları gör</Text>
                    </Button>
                    <Button
                        loading={loading}
                        onClick={() => destroy(returned.id)}
                        variant="tertiary"
                        tone="critical"
                    >
                        <Text variant="bodyMd">Kodu iptal et</Text>
                    </Button>
                </BlockStack>
            </Box>
        </Popover>
    );
    return (
        <BlockStack gap="200">
            <Box padding="400">
                <Text as="h2" variant="headingMd">
                    İade Sürecindeki Paketler
                </Text>
                <Text as="span" variant="bodySm">
                    İade için gönderimi yapılmış paketler ve durumları aşağıda
                    listelenmektedir.
                </Text>
            </Box>

            <Print
                response={printResponse}
                withModal={true}
                data={printData}
            ></Print>
            {returneds.map(
                (returned, index) =>
                    Array.isArray(returned.returned.lines) && (
                        <Card key={index}>
                            <BlockStack gap="400">
                                <InlineStack align="space-between">
                                    <InlineStack gap="200" blockAlign="center">
                                        <Text as="h2" variant="headingSm">
                                            {returned.returned_id} No'lu Gönderi
                                        </Text>
                                        <Badge>
                                            {
                                                returned.returned.cargo_company
                                                    .title
                                            }
                                        </Badge>
                                        <Badge>
                                            {
                                                statusMapping[
                                                    returned.returned.status
                                                ]
                                            }
                                        </Badge>
                                        {returned.returned.tracking_link && (
                                            <Link
                                                target="_blank"
                                                url={
                                                    returned.returned
                                                        .tracking_link
                                                }
                                            >
                                                Kargo Takip
                                            </Link>
                                        )}
                                    </InlineStack>
                                    <ButtonGroup>
                                        {renderDisclosureButton(
                                            returned,
                                            index
                                        )}
                                    </ButtonGroup>
                                </InlineStack>
                                <Box
                                    borderColor="border"
                                    borderWidth="025"
                                    borderRadius="100"
                                >
                                    <ResourceList
                                        resourceName={{
                                            singular: "item",
                                            plural: "items",
                                        }}
                                        items={returned.returned.lines}
                                        renderItem={(item) => {
                                            const {
                                                platform_id,
                                                title,
                                                image,
                                                quantity,
                                                reason,
                                                sku,
                                            } = item;
                                            return (
                                                <ResourceList.Item
                                                    verticalAlignment="center"
                                                    id={platform_id}
                                                    media={
                                                        <Thumbnail
                                                            customer
                                                            size="medium"
                                                            source={
                                                                image
                                                                    ? image
                                                                    : ImageIcon
                                                            }
                                                        />
                                                    }
                                                    accessibilityLabel={`View details for ${title}`}
                                                >
                                                    <BlockStack>
                                                        <InlineStack align="space-between">
                                                            <BlockStack>
                                                                <Text
                                                                    as="h3"
                                                                    variant="bodyMd"
                                                                    fontWeight="medium"
                                                                >
                                                                    {title}
                                                                </Text>
                                                            </BlockStack>
                                                            <Text
                                                                as="h3"
                                                                variant="bodyMd"
                                                                fontWeight="medium"
                                                            >
                                                                x{quantity}
                                                            </Text>
                                                        </InlineStack>
                                                        <Box>
                                                            <Text tone="subdued">
                                                                {sku}
                                                            </Text>
                                                        </Box>
                                                        <List type="bullet">
                                                            <List.Item>
                                                                İade Nedeni:{" "}
                                                                {reason}
                                                            </List.Item>
                                                        </List>
                                                    </BlockStack>
                                                </ResourceList.Item>
                                            );
                                        }}
                                    />
                                </Box>
                                <Modal id={`${returned.return_id}-modal`}>
                                    <TitleBar title="Gönderi Detayları"></TitleBar>
                                    <Box padding="800">
                                        <BlockStack gap="200">
                                            <Text
                                                variant="bodyLg"
                                                fontWeight="regular"
                                            >
                                                Gönderici Adresi
                                            </Text>
                                            <Text variant="bodySm">
                                                {
                                                    returned.returned.sender
                                                        .address
                                                }
                                            </Text>
                                            <Card sectioned>
                                                {returned.returned.steps.map(
                                                    (step, index) => (
                                                        <BlockStack key={index}>
                                                            <InlineStack
                                                                align="space-between"
                                                                blockAlign="center"
                                                            >
                                                                <BlockStack>
                                                                    <Text
                                                                        variant="bodyLg"
                                                                        fontWeight="semibold"
                                                                    >
                                                                        {
                                                                            statusMapping[
                                                                                step
                                                                                    .status
                                                                            ]
                                                                        }
                                                                    </Text>
                                                                    <Text variant="bodyXs">
                                                                        {formatTime(
                                                                            step.created_at
                                                                        )}
                                                                    </Text>
                                                                </BlockStack>
                                                                <Text
                                                                    tone="magic-subdued"
                                                                    fontWeight="regular"
                                                                >
                                                                    {
                                                                        step.message
                                                                    }
                                                                </Text>
                                                            </InlineStack>
                                                            {index !==
                                                                returned
                                                                    .returned
                                                                    .steps
                                                                    .length -
                                                                    1 && (
                                                                <Box padding="400">
                                                                    <Divider />
                                                                </Box>
                                                            )}
                                                        </BlockStack>
                                                    )
                                                )}
                                            </Card>
                                        </BlockStack>
                                    </Box>
                                </Modal>
                                <InlineStack align="end">
                                    <ButtonGroup>
                                        <Button
                                            loading={loading}
                                            variant="primary"
                                            onClick={() => print(returned)}
                                        >
                                            İade Kodu Yazdır
                                        </Button>
                                    </ButtonGroup>
                                </InlineStack>
                            </BlockStack>
                        </Card>
                    )
            )}
        </BlockStack>
    );
}
