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

const EditReturnedModal = ({
    index,
    returned,
    handleFieldChange,
    shopify,
    cargoIntegrations,
    warehouses,
    payorTypes,
    paymentTypes,
    packageTypes,
}) => {
    return (
        <Modal id={`${index}-modal`}>
            <TitleBar title="Özelleştir">
                <button
                    variant="primary"
                    onClick={() => shopify.modal.hide(`${index}-modal`)}
                >
                    Onayla
                </button>
            </TitleBar>

            <Box padding="400">
                <BlockStack gap="400">
                    <Checkbox
                        label="Bu iade için kod oluştur"
                        value={true}
                        checked={returned.need_return}
                        onChange={handleFieldChange("need_return", index)}
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
                            value={returned.cargo_integration_id}
                            onChange={(value) =>
                                handleFieldChange(
                                    "cargo_integration_id",
                                    index
                                )(parseInt(value))
                            }
                        />
                        <Select
                            label="Geri Dönüş Deposu"
                            options={warehouses.map((warehouse) => ({
                                label: warehouse.name,
                                value: warehouse.id,
                            }))}
                            value={returned.warehouse_id}
                            onChange={(value) =>
                                handleFieldChange(
                                    "warehouse_id",
                                    index
                                )(parseInt(value))
                            }
                        />
                        <Select
                            label="Paket Tipi"
                            options={packageTypes}
                            value={returned.package_type}
                            onChange={handleFieldChange("package_type", index)}
                        />
                        <Select
                            label="Ödeme Yapacak Taraf"
                            options={payorTypes}
                            value={returned.payor_type}
                            onChange={handleFieldChange("payor_type", index)}
                        />
                        <Select
                            label="Ödeme Tipi"
                            options={paymentTypes}
                            value={returned.payment_type}
                            onChange={handleFieldChange("payment_type", index)}
                        />

                        <TextField
                            label="İade Tarihi"
                            type="date"
                            value={returned.return_at}
                            onChange={handleFieldChange("return_at", index)}
                        />
                    </InlineGrid>

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
                            value={returned.invoice_number}
                            onChange={handleFieldChange(
                                "invoice_number",
                                index
                            )}
                        />
                        <TextField
                            label="İrsaliye Numarası"
                            value={returned.waybill_number}
                            onChange={handleFieldChange(
                                "waybill_number",
                                index
                            )}
                        />
                    </InlineGrid>
                </BlockStack>
            </Box>
        </Modal>
    );
};

export default EditReturnedModal;
