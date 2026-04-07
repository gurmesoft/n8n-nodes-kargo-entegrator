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
} from "@shopify/polaris";
import { ImageIcon, MenuHorizontalIcon } from "@shopify/polaris-icons";
import { Modal, TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { useState } from "react";
import Print from "../../../components/print";
import moment from "moment";
import request from "@/plugins/request";
import "moment/dist/locale/tr";
import { uiStore } from "@/store/ui";

export default function Shipments({ shipments }) {
    const { loading } = uiStore();
    const formatTime = (date) => {
        moment.locale("tr");
        return moment(date).format("lll");
    };
    const shopify = useAppBridge();
    const [printResponse, setPrintResponse] = useState(null);
    const [actionActive, toggleAction] = useState(shipments.map(() => false));

    const print = async (shipmentId) => {
        setPrintResponse(
            await request("/api/print", "POST", {
                type: "shipments",
                ids: [shipmentId],
            })
        );
    };

    const destroy = async (id) => {
        await request(`/shipment/${id}`, "DELETE");
        window.location.reload();
    };

    const statusMapping = {
        non_processed: "Gönderime Hazır",
        failed: "Hatalı",
        cancelled: "İptal Edildi",
        shipped: "Yola Çıktı",
        on_transit: "Taşıma Sürecinde",
        in_courier: "Dağıtıma Çıktı",
        delivered: "Teslim Edildi",
        on_return: "İade Sürecinde",
    };

    const handleToggleAction = (index) => {
        const updatedActions = [...actionActive];
        updatedActions[index] = !updatedActions[index];
        toggleAction(updatedActions);
    };

    const renderDisclosureButton = (shipment, index) => (
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
                            shopify.modal.show(`${shipment.shipment_id}-modal`)
                        }
                        variant="tertiary"
                    >
                        <Text variant="bodyMd">Detayları gör</Text>
                    </Button>
                    {shipment.shipment.status === "non_processed" && (
                    <Button
                        loading={loading}
                        onClick={() => destroy(shipment.id)}
                        variant="tertiary"
                        tone="critical"
                    >
                        <Text variant="bodyMd">Gönderimi iptal et</Text>
                    </Button>
                )}
                </BlockStack>
            </Box>
        </Popover>
    );

    return (
        <BlockStack gap="200">
            <Box padding="400">
                <Text as="h2" variant="headingMd">
                    Gönderilen Paketler
                </Text>
                <Text as="span" variant="bodySm">
                    Sipariş için gönderimi yapılmış paketler aşağıda
                    listelenmektedir.
                </Text>
            </Box>

            <Print response={printResponse} withModal={true}></Print>
            {shipments.map((shipment, index) => (
                <Card key={index}>
                    <BlockStack gap="400">
                        <InlineStack align="space-between">
                            <InlineStack gap="200" blockAlign="center">
                                <Text as="h2" variant="headingSm">
                                    {shipment.shipment_id} No'lu Gönderi
                                </Text>
                                <Badge>
                                    {shipment.shipment.cargo_company.title}
                                </Badge>
                                <Badge>
                                    {statusMapping[shipment.shipment.status]}
                                </Badge>
                                {shipment.shipment.tracking_link && (
                                    <Link
                                        target="_blank"
                                        url={shipment.shipment.tracking_link}
                                    >
                                        Kargo Takip
                                    </Link>
                                )}
                            </InlineStack>
                            <ButtonGroup>
                                {renderDisclosureButton(shipment, index)}
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
                                items={shipment.shipment.lines}
                                renderItem={(item) => {
                                    const {
                                        platform_id,
                                        title,
                                        image,
                                        quantity,
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
                                                    <Text
                                                        as="h3"
                                                        variant="bodyMd"
                                                        fontWeight="medium"
                                                    >
                                                        {title}
                                                    </Text>
                                                    <Text
                                                        as="h3"
                                                        variant="bodyMd"
                                                        fontWeight="medium"
                                                    >
                                                        x{quantity}
                                                    </Text>
                                                </InlineStack>
                                                <Text tone="subdued">
                                                    {sku}
                                                </Text>
                                            </BlockStack>
                                        </ResourceList.Item>
                                    );
                                }}
                            />
                        </Box>
                        <Modal id={`${shipment.shipment_id}-modal`}>
                            <TitleBar title="Gönderi Detayları"></TitleBar>
                            <Box padding="800">
                                <BlockStack gap="200">
                                    <Text variant="bodyLg" fontWeight="regular">
                                        Alıcı Adresi
                                    </Text>
                                    <Text variant="bodySm">
                                        {shipment.shipment.receiver.address}
                                    </Text>
                                    <Card sectioned>
                                        {shipment.shipment.steps.map(
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
                                                            {step.message}
                                                        </Text>
                                                    </InlineStack>
                                                    {index !==
                                                        shipment.shipment.steps
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
                        <InlineStack align="space-between" blockAlign="center">
                            <Text as="span" variant="bodySm" tone="subdued">
                                Bu kargo{" "}
                                {shipment.shipment.payor_type === "sender"
                                    ? "gönderici ödemeli"
                                    : "alıcı ödemeli"}{" "}
                                olarak{" "}
                                {shipment.shipment.payment_type === "cash_money"
                                    ? `nakit${
                                          shipment.shipment.is_pay_at_door
                                              ? " / Kapıda"
                                              : ""
                                      } ödeme`
                                    : `kredi kartı${
                                          shipment.shipment.is_pay_at_door
                                              ? " / Kapıda"
                                              : ""
                                      } ile ödeme`}{" "}
                                yöntemiyle gönderilmiştir.
                            </Text>
                            <ButtonGroup>
                                <Button
                                    loading={loading}
                                    variant="primary"
                                    onClick={() => print(shipment.shipment_id)}
                                >
                                    Barkod Yazdır
                                </Button>
                            </ButtonGroup>
                        </InlineStack>
                    </BlockStack>
                </Card>
            ))}
        </BlockStack>
    );
}
