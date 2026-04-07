import {
    Page,
    Layout,
    Button,
    BlockStack,
    InlineStack,
    Text,
    EmptyState,
    Card,
} from "@shopify/polaris";
import MainApp from "@/MainApp";
import { useState, useEffect } from "react";
import ReceiverVars from "../../components/receiverVars";
import FulfillmentOrders from "./partials/fulfillmentOrders";
import Print from "../../components/print";
import Shipments from "./partials/shipments";
import request from "@/plugins/request";
import { uiStore } from "@/store/ui";
import moment from "moment";
import "moment/dist/locale/tr";
import FinancialStatusBadge from "../../components/financialStatusBadge";
import FulfillmentStatusBadge from "../../components/fulfillmentStatusBadge";

export default function ({
    shipment,
    warehouses,
    cargoIntegrations,
    shipments,
    order,
}) {
    const [data, setData] = useState(shipment);
    const [createResponse, setCreateResponse] = useState(null);
    const { loading } = uiStore();
    const formatTime = (date) => {
        moment.locale("tr");
        return moment(date).format("lll");
    };

    const createShipment = async () => {
        data.fulfillment_orders = await data.fulfillment_orders
            .filter((e) => e.need_fulfillment)
            .map((order) => ({
                ...order,
                lines: order.lines.filter((line) => line.quantity > 0),
            }))
            .filter((order) => {
                const totalQuantity = order.lines.reduce(
                    (sum, line) => sum + line.quantity,
                    0
                );
                return totalQuantity > 0;
            });

        await request("/shipment", "POST", data, (response) => {
            setCreateResponse(response);
            shopify.modal.show("print-modal");
        });
    };

    const [needFulfill, setNeedFulfill] = useState(0);

    useEffect(() => {
        setNeedFulfill(
            data.fulfillment_orders.filter((e) => true === e.need_fulfillment)
                .length
        );
    }, [data]);

    useEffect(() => {
        const updatedData = { ...data };

        updatedData.fulfillment_orders = data.fulfillment_orders.map(
            (order) => {
                const calculatedKg = order.lines.reduce(
                    (acc, line) => acc + line.weight * line.quantity,
                    0
                );

                if (order.kg !== calculatedKg) {
                    return { ...order, kg: calculatedKg };
                }
                return order;
            }
        );

        setData(updatedData);
    }, [data.fulfillment_orders]);

    return (
        <MainApp>
            <Page
                backAction={{
                    content: "Geri",
                    onAction: () => {
                        window.history.back();
                    },
                }}
                title={order.name}
                titleMetadata={
                    <InlineStack gap="200">
                        <FinancialStatusBadge
                            financialStatus={order.financial_status}
                        />
                        <FulfillmentStatusBadge
                            fulfillmentStatus={order.fulfillment_status}
                        />
                    </InlineStack>
                }
                subtitle={`${formatTime(
                    order.created_at
                )} tarihinde oluşturuldu`}
                primaryAction={
                    data.fulfillment_orders.length > 0 && (
                        <Button
                            variant="primary"
                            loading={loading}
                            onClick={createShipment}
                        >
                            {`Barkod Oluştur (${needFulfill})`}
                        </Button>
                    )
                }
            >
                <Layout sectioned>
                    <BlockStack gap="300">
                        {data.fulfillment_orders.length > 0 && (
                            <>
                                <ReceiverVars setData={setData} data={data} />
                                <FulfillmentOrders
                                    data={data}
                                    setData={setData}
                                    warehouses={warehouses}
                                    cargoIntegrations={cargoIntegrations}
                                />
                            </>
                        )}
                        {shipments.length > 0 && (
                            <Shipments shipments={shipments} />
                        )}
                        {data.fulfillment_orders.length == 0 &&
                            shipments.length == 0 && (
                                <Card>
                                    <EmptyState
                                        heading="Bu siparişe ait gönderilecek gönderi bulunamadı."
                                        action={{
                                            content: "Geri Dön",
                                            onAction: () => {
                                                window.history.back();
                                            },
                                        }}
                                        image="/assets/images/empty.png"
                                    >
                                        <Text>
                                            Tüm gönderi paketleri zaten
                                            gönderilmiş olabilir. Lütfen
                                            siparişinizi kontrol ederek tekrar
                                            deneyiniz.
                                        </Text>
                                    </EmptyState>
                                </Card>
                            )}
                    </BlockStack>
                </Layout>
                <Print response={createResponse}></Print>
            </Page>
        </MainApp>
    );
}
