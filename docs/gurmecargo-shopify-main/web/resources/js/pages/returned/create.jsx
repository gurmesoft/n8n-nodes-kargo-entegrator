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
import Print from "../../components/print";
import request from "@/plugins/request";
import { uiStore } from "@/store/ui";
import moment from "moment";
import "moment/dist/locale/tr";
import Returneds from "./partials/returneds";
import FinancialStatusBadge from "../../components/financialStatusBadge";
import FulfillmentStatusBadge from "../../components/fulfillmentStatusBadge";
import Returns from "./partials/returns";

export default function ({
    returned,
    warehouses,
    cargoIntegrations,
    returneds,
    order,
}) {
    const [data, setData] = useState(returned);
    const [createResponse, setCreateResponse] = useState(null);
    const { loading } = uiStore();
    const formatTime = (date) => {
        moment.locale("tr");
        return moment(date).format("lll");
    };

    const createReturned = async () => {
        data.returns = await data.returns
            .filter((e) => e.need_return)
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
        await request(
            "/returned",
            "POST",
            data,
            (response) => {
                setCreateResponse(response);
                shopify.modal.show("print-modal");
            }
        );
    };

    const [needReturn, setNeedReturn] = useState(0);

    useEffect(() => {
        setNeedReturn(
            data.returns.filter((e) => true === e.need_return).length
        );
    }, [data]);

    return (
        <MainApp>
            <Page
                backAction={{
                    content: "Geri",
                    onAction: () => {
                        window.history.back();
                    },
                }}
                title={returned.platform_d_id}
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
                    data.returns.length > 0 && (
                        <Button
                            variant="primary"
                            loading={loading}
                            onClick={createReturned}
                        >
                            {`İade Oluştur (${needReturn})`}
                        </Button>
                    )
                }
            >
                <Layout sectioned>
                    <BlockStack gap="300">
                        {data.returns.length > 0 && (
                            <>
                                <ReceiverVars setData={setData} data={data} />
                                <Returns
                                    data={data}
                                    setData={setData}
                                    warehouses={warehouses}
                                    cargoIntegrations={cargoIntegrations}
                                />
                            </>
                        )}
                        {returneds.length > 0 && (
                            <Returneds returneds={returneds} />
                        )}
                        {data.returns.length == 0 && returneds.length == 0 && (
                            <Card>
                                <EmptyState
                                    heading="İade talebi bulunamadı."
                                    action={{
                                        content: "Geri Dön",
                                        onAction: () => {
                                            window.history.back();
                                        },
                                    }}
                                    image="/assets/images/empty.png"
                                >
                                    <Text>
                                        Aktif iade talebi bulunmamaktadır yada
                                        talebin durumu kod oluşturmaya uygun
                                        değildir.
                                    </Text>
                                </EmptyState>
                            </Card>
                        )}
                    </BlockStack>
                </Layout>
                <Print response={createResponse} data={returneds}></Print>
            </Page>
        </MainApp>
    );
}
