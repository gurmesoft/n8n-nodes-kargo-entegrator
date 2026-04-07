import MainApp from "@/MainApp";
import {
    Button,
    ButtonGroup,
    IndexTable,
    Page,
    Card,
    EmptyState,
    Popover,
    ActionList,
    Text,
} from "@shopify/polaris";
import { useCallback, useEffect, useState } from "react";
import request from "@/plugins/request";
import { uiStore } from "@/store/ui";
import Print from "../../components/print";
import OrderRow from "./partials/orderRow";

export default function BulkShipment({ shipments, cargoIntegrations }) {
    const { loading, setErrorMessage } = uiStore();
    const [popoverActive, setPopoverActive] = useState(false);
    const [editMode, setEditMode] = useState({});
    const [orderData, setOrderData] = useState(shipments);
    const [printIsDisabled, setPrintIsDisabled] = useState(true);
    const [createIsDisabled, setCreateIsDisabled] = useState(true);
    const [hoveredCell, setHoveredCell] = useState({});
    const [printResponse, setPrintResponse] = useState(null);
    const [result, setResult] = useState(() => {
        const arr = {};
        shipments.forEach((shipment) => {
            arr[shipment.platform_id] = {
                creating: false,
                created: !shipment.fulfillment_orders.length,
                error: false,
                empty: !!shipment.fulfillment_orders.length,
            };
        });
        return arr;
    });

    const togglePopoverActive = useCallback(
        () => setPopoverActive((active) => !active),
        []
    );

    const print = async (ids) => {
        setPrintResponse(
            await request("/api/print", "POST", {
                type: "shipments",
                ids,
            })
        );
        shopify.modal.show("print-modal");
    };

    const handleEditClick = (id, field) => {
        setEditMode((prev) => ({
            ...prev,
            [id]: { ...prev[id], [field]: true },
        }));
    };

    const handleBlur = (id, field) => {
        if (field === 'city' || field === 'district' || field === 'address') {
            setTimeout(() => {
                const activeElement = document.activeElement;
                const isActiveElementAddressField = activeElement && 
                    activeElement.closest('[data-address-field]');
                
                if (!isActiveElementAddressField) {
                    setEditMode((prev) => ({
                        ...prev,
                        [id]: { 
                            ...prev[id], 
                            city: false, 
                            district: false, 
                            address: false 
                        },
                    }));
                }
            }, 50);
        } else {
            setEditMode((prev) => ({
                ...prev,
                [id]: { ...prev[id], [field]: false },
            }));
        }
    };

    const handleChange = (id, field, value) => {
        setOrderData((prev) =>
            prev.map((order) => {
                if (order.platform_id !== id) return order;

                if (field === "desi") {
                    const newTotal = String(value ?? "");
                    const updatedFulfillments = (order.fulfillment_orders || []).map((fo, idx) => ({
                        ...fo,
                        desi: idx === 0 ? newTotal : "0",
                    }));

                    return {
                        ...order,
                        fulfillment_orders: updatedFulfillments,
                    };
                }

                if (field === "package_count") {
                    const newTotal = Math.max(1, parseInt(value) || 1);
                    const updatedFulfillments = (order.fulfillment_orders || []).map((fo, idx) => ({
                        ...fo,
                        package_count: idx === 0 ? newTotal : 0,
                    }));

                    return {
                        ...order,
                        fulfillment_orders: updatedFulfillments,
                    };
                }

                return {
                    ...order,
                    customer: {
                        ...order.customer,
                        [field]: value,
                    },
                };
            })
        );
    };

    const handleAiChange = (id, updates) => {
        setOrderData((prev) =>
            prev.map((order) =>
                order.platform_id === id
                    ? {
                          ...order,
                          customer: {
                              ...order.customer,
                              ...updates,
                          },
                      }
                    : order
            )
        );
    };

    const handleMouseEnter = (id, field) => {
        setHoveredCell({ id, field });
    };

    const handleMouseLeave = () => {
        setHoveredCell({});
    };

    const handleAddressEditAll = (id) => {
        setEditMode((prev) => ({
            ...prev,
            [id]: { 
                ...prev[id], 
                city: true, 
                district: true, 
                address: true 
            },
        }));
    };

    useEffect(() => {
        setPrintIsDisabled(() => {
            return !Object.values(result).some((value) => value.created);
        });
    }, [result]);

    useEffect(
        () =>
            setCreateIsDisabled(
                () =>
                    !orderData.find((order) => order.fulfillment_orders.length)
            ),
        [orderData]
    );

    const createShipment = async (cargoIntegrationId) => {
        setResult((prevResult) => {
            const newResult = { ...prevResult };
            orderData.forEach((shipment) => {
                if (!newResult[shipment.platform_id].created) {
                    newResult[shipment.platform_id] = {
                        ...newResult[shipment.platform_id],
                        error: false,
                        empty: false,
                    };
                }
            });
            return newResult;
        });
        for (const shipment of orderData) {
            if (!result[shipment.platform_id].created) {
                setResult((prev) => ({
                    ...prev,
                    [shipment.platform_id]: {
                        ...prev[shipment.platform_id],
                        creating: true,
                        empty: false,
                    },
                }));
                await request(
                    "/shipment",
                    "POST",
                    {
                        ...shipment,
                        cargo_integration_id: cargoIntegrationId,
                    },
                    (response) => {
                        if (response) {
                            shipment.shipment_ids.push(
                                ...response.shipment_ids
                            );
                        }
                        setResult((prev) => ({
                            ...prev,
                            [shipment.platform_id]: {
                                ...prev[shipment.platform_id],
                                creating: false,
                                created: true,
                            },
                        }));
                    },
                    (error) => {
                        setResult((prev) => ({
                            ...prev,
                            [shipment.platform_id]: {
                                ...prev[shipment.platform_id],
                                creating: false,
                                error: true,
                                errorMessage: error.message,
                            },
                        }));
                        setErrorMessage(error.message);
                    }
                );
            }
        }
    };

    const rowMarkup = orderData.map(
        ({ customer, platform_d_id, platform_id, fulfillment_orders }, index) => (
            <OrderRow
                key={platform_id}
                id={platform_id}
                order={platform_d_id}
                name={customer.name}
                surname={customer.surname}
                number={customer.phone}
                city={customer.city}
                district={customer.district}
                address={customer.address}
                desi={fulfillment_orders.reduce((acc, order) => acc + (parseFloat(order.desi) || 0), 0)}
                package_count={fulfillment_orders.reduce((acc, order) => acc + (parseInt(order.package_count) || 0), 0)}
                index={index}
                loadingStatus={result}
                editMode={editMode}
                hoveredCell={hoveredCell}
                handleMouseEnter={handleMouseEnter}
                handleMouseLeave={handleMouseLeave}
                handleEditClick={handleEditClick}
                handleChange={handleChange}
                handleBlur={handleBlur}
                handleAddressEditAll={handleAddressEditAll}
                orderData={orderData}
                handleAiChange={handleAiChange}
                errorMessage={result[platform_id].errorMessage}
            />
        )
    );

    const emptyState = (
        <Card>
            <EmptyState
                heading="Gönderi oluşturmaya uygun sipariş bulunamadı"
                action={{
                    content: "Geri",
                    onAction: () => {
                        open("shopify://admin/orders", "_self");
                    },
                }}
                image="/assets/images/empty.png"
            >
                <p>
                    Lütfen seçili siparişlerinizi kontrol ederek tekrar
                    deneyiniz.
                </p>
            </EmptyState>
        </Card>
    );

    const multipleCargoIntegrations = cargoIntegrations.length > 1;
    const createShipmentButton = multipleCargoIntegrations ? (
        <Popover
            active={popoverActive}
            activator={
                <Button
                    disabled={createIsDisabled}
                    variant="primary"
                    loading={loading}
                    onClick={togglePopoverActive}
                    disclosure
                >
                    Gönderi Oluştur
                </Button>
            }
            onClose={togglePopoverActive}
        >
            <ActionList
                items={cargoIntegrations.map((integration) => ({
                    content: integration.name,
                    image: integration.company_info.logo,
                    onAction: () => {
                        togglePopoverActive();
                        createShipment(integration.id);
                    },
                }))}
            />
        </Popover>
    ) : (
        <Button
            disabled={createIsDisabled}
            variant="primary"
            loading={loading}
            onClick={() => {
                const singleId = cargoIntegrations[0]?.id || null;
                createShipment(singleId);
            }}
        >
            Gönderi Oluştur
        </Button>
    );

    return (
        <MainApp>
            <Page
                backAction={{
                    content: "Geri",
                    onAction: () => {
                        open("shopify://admin/orders", "_self");
                    },
                }}
                title="Toplu Gönderi Oluşturma"
                primaryAction={
                    <ButtonGroup noWrap>
                        <Button
                            disabled={printIsDisabled}
                            loading={loading}
                            onClick={() => {
                                let allShipmentIds = [];
                                orderData.forEach((order) => {
                                    if (Array.isArray(order.shipment_ids)) {
                                        allShipmentIds = allShipmentIds.concat(
                                            order.shipment_ids
                                        );
                                    } else {
                                        allShipmentIds.push(order.shipment_ids);
                                    }
                                });
                                print(allShipmentIds);
                            }}
                        >
                            Yazdır
                        </Button>
                        {createShipmentButton}
                    </ButtonGroup>
                }
            >
                <Text as="p" variant="bodyMd" tone="subdued">
                    Bu sayfa Shopify mağazanızdaki birden fazla gönderiyi aynı
                    anda seçip, toplu barkod oluşturmanızı ve yazdırmanızı
                    sağlar. Gönderi işlemlerini hızlandırarak zamandan tasarruf
                    etmenize ve operasyonlarınızı daha verimli hale getirmenize
                    yardımcı olur. Gönderiler varsayılan konum ayarları ile
                    gönderilir.
                </Text>

                {/* Removed the <Select> completely */}

                <IndexTable
                    resourceName={{ singular: "order", plural: "orders" }}
                    itemCount={orderData.length}
                    selectable={false}
                    emptyState={emptyState}
                    headings={[
                        { title: "#" },
                        { title: "S. No" },
                        { title: "Ad" },
                        { title: "Soyad" },
                        { title: "Telefon" },
                        { title: "İl" },
                        { title: "İlçe" },
                        { title: "Adres" },
                        { title: "Desi" },
                        { title: "Kutu Sayısı", alignment: "end" },
                    ]}
                >
                    {rowMarkup}
                </IndexTable>

                <Print response={printResponse} />
            </Page>
        </MainApp>
    );
}
