import React from "react";
import { Modal, TitleBar } from "@shopify/app-bridge-react";
import {
    Box,
    BlockStack,
    Checkbox,
    InlineGrid,
    Select,
    TextField,
    Text,
} from "@shopify/polaris";

const EditShipmentModal = ({
    orderIndex,
    fulfillmentOrder,
    handleFieldChange,
    shopify,
    cargoIntegrations,
    warehouses,
    currencies,
    payorTypes,
    paymentTypes,
    packageTypes,
}) => {
    return (
        <Modal id={`${orderIndex}-modal`}>
            <TitleBar title="Özelleştir">
                <button
                    variant="primary"
                    onClick={() => shopify.modal.hide(`${orderIndex}-modal`)}
                >
                    Onayla
                </button>
            </TitleBar>

            <Box padding="400">
                <BlockStack gap="400">
                    <Checkbox
                        label="Bu gönderi için barkod oluştur"
                        value={true}
                        checked={fulfillmentOrder.need_fulfillment}
                        onChange={handleFieldChange(
                            "need_fulfillment",
                            orderIndex
                        )}
                    />
                    <InlineGrid
                        gap="400"
                        columns={{
                            xs: 1,
                            sm: 2,
                            md: 3,
                            lg: 2,
                            xl: 3,
                        }}
                    >
                        <Select
                            label="Kargo Entegrasyonu"
                            options={cargoIntegrations.map((integration) => ({
                                label: integration.name,
                                value: integration.id,
                            }))}
                            value={fulfillmentOrder.cargo_integration_id}
                            onChange={(value) =>
                                handleFieldChange(
                                    "cargo_integration_id",
                                    orderIndex
                                )(parseInt(value))
                            }
                        />
                        <Select
                            label="Depo"
                            options={warehouses.map((warehouse) => ({
                                label: warehouse.name,
                                value: warehouse.id,
                            }))}
                            value={fulfillmentOrder.warehouse_id}
                            onChange={(value) =>
                                handleFieldChange(
                                    "warehouse_id",
                                    orderIndex
                                )(parseInt(value))
                            }
                        />
                        <Select
                            label="Paket Tipi"
                            options={packageTypes}
                            value={fulfillmentOrder.package_type}
                            onChange={handleFieldChange(
                                "package_type",
                                orderIndex
                            )}
                        />
                        {fulfillmentOrder.package_type === "box" && (
                            <TextField
                                label="Kutu Sayısı"
                                type="number"
                                value={fulfillmentOrder.package_count}
                                onChange={handleFieldChange(
                                    "package_count",
                                    orderIndex
                                )}
                            />
                        )}
                        <Select
                            label="Ödeme Yapacak Taraf"
                            options={payorTypes}
                            value={fulfillmentOrder.payor_type}
                            onChange={handleFieldChange(
                                "payor_type",
                                orderIndex
                            )}
                        />
                        <Select
                            label="Ödeme Tipi"
                            options={paymentTypes}
                            value={fulfillmentOrder.payment_type}
                            onChange={handleFieldChange(
                                "payment_type",
                                orderIndex
                            )}
                        />
                        <TextField
                            label="Desi"
                            type="number"
                            value={fulfillmentOrder.desi}
                            onChange={handleFieldChange("desi", orderIndex)}
                        />
                        <TextField
                            label="Ağırlık (kg)"
                            type="number"
                            value={fulfillmentOrder.kg || 0}
                            onChange={handleFieldChange("kg", orderIndex)}
                        />
                        <TextField
                            label="Açıklama"
                            value={fulfillmentOrder.description}
                            onChange={handleFieldChange(
                                "description",
                                orderIndex
                            )}
                        />
                    </InlineGrid>
                    <BlockStack inlineAlign="start" align="end">
                        <Checkbox
                            label="Kapıda ödeme mi?"
                            checked={fulfillmentOrder.is_pay_at_door}
                            onChange={handleFieldChange(
                                "is_pay_at_door",
                                orderIndex
                            )}
                        />
                    </BlockStack>

                    {fulfillmentOrder.is_pay_at_door && (
                        <InlineGrid
                            gap="400"
                            columns={{
                                xs: 1,
                                sm: 2,
                                md: 3,
                                lg: 2,
                                xl: 3,
                            }}
                        >
                            <TextField
                                label="Toplam"
                                value={fulfillmentOrder.total}
                                onChange={handleFieldChange(
                                    "total",
                                    orderIndex
                                )}
                                error={
                                    fulfillmentOrder.total != null &&
                                    fulfillmentOrder.total
                                        .toString()
                                        .includes(",")
                                        ? 'Lütfen "," karakterini kullanmayınız; ondalık ayracı olarak "." kullanın.'
                                        : undefined
                                }
                            />
                            <Select
                                label="Para Birimi"
                                options={currencies}
                                value={fulfillmentOrder.currency}
                                onChange={handleFieldChange(
                                    "currency",
                                    orderIndex
                                )}
                            />
                        </InlineGrid>
                    )}
                    <Text as="h2" variant="headingSm">
                        Fatura Bilgileri
                    </Text>
                    <InlineGrid
                        gap="400"
                        columns={{
                            xs: 1,
                            sm: 2,
                            md: 3,
                            lg: 2,
                            xl: 3,
                        }}
                    >
                        <TextField
                            label="Fatura Numarası"
                            value={fulfillmentOrder.invoice_number}
                            onChange={handleFieldChange(
                                "invoice_number",
                                orderIndex
                            )}
                        />
                        <TextField
                            label="İrsaliye Numarası"
                            value={fulfillmentOrder.waybill_number}
                            onChange={handleFieldChange(
                                "waybill_number",
                                orderIndex
                            )}
                        />
                    </InlineGrid>
                </BlockStack>
            </Box>
        </Modal>
    );
};

export default EditShipmentModal;
