import React, { useState, useCallback } from "react";
import {
    Text,
    Icon,
    TextField,
    Box,
    Popover,
    ActionList,
    Button,
} from "@shopify/polaris";
import {
    EditIcon,
    MagicIcon,
    MenuHorizontalIcon,
} from "@shopify/polaris-icons";
import request from "@/plugins/request";
import { uiStore } from "@/store/ui";

export const EditableCell = ({
    id,
    field,
    value,
    editMode,
    hoveredCell,
    handleMouseEnter,
    handleMouseLeave,
    handleEditClick,
    handleChange,
    handleBlur,
}) => {
    return (
        <div>
            {editMode[id]?.[field] ? (
                <Box minWidth="100px">
                    <TextField
                        value={value}
                        onChange={(newValue) =>
                            handleChange(id, field, newValue)
                        }
                        onBlur={() => handleBlur(id, field)}
                        autoFocus
                        size="slim"
                    />
                </Box>
            ) : (
                <div
                    onMouseEnter={() => handleMouseEnter(id, field)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handleEditClick(id, field)}
                    style={{ position: "relative", minHeight: "16px" }}
                >
                    <Box paddingInlineEnd="400">
                        <Text>{value}</Text>
                        {hoveredCell.id === id &&
                            hoveredCell.field === field && (
                                <Box
                                    position="absolute"
                                    insetInlineEnd="0"
                                    insetBlockStart="0"
                                >
                                    <Button
                                        icon={EditIcon}
                                        variant="secondary"
                                        size="micro"
                                    />
                                </Box>
                            )}
                    </Box>
                </div>
            )}
        </div>
    );
};

export const AddressEditableCell = ({
    id,
    field,
    value,
    editMode,
    hoveredCell,
    handleMouseEnter,
    handleEditClick,
    handleChange,
    handleBlur,
    orderData,
    handleAiChange,
}) => {
    const [popoverActive, setPopoverActive] = useState(false);
    const { loading, setErrorMessage } = uiStore();

    const togglePopover = useCallback(() => {
        setPopoverActive((active) => !active);
    }, []);

    const handleEditAction = () => {
        setPopoverActive(false);
        handleEditClick(id, field);
    };

    const handleAiEdit = async () => {
        setPopoverActive(false);

        try {
            const currentOrder = orderData.find(
                (order) => order.platform_id === id
            );
            if (!currentOrder) return;

            const { formattedAddress } = await request(
                "/api/fix-address",
                "POST",
                {
                    city: currentOrder.customer.city,
                    district: currentOrder.customer.district,
                    address: currentOrder.customer.address,
                    country: currentOrder.customer.country || "Türkiye",
                },
                (response) => {
                    if (response.error) {
                        setErrorMessage(response.errorMessage);
                        return;
                    }
                }
            );

            if (!formattedAddress) {
                return;
            }

            handleAiChange(id, {
                city: formattedAddress.city,
                district: formattedAddress.district,
                address: formattedAddress.fullAddress,
            });

            shopify.toast.show("AI ile adres bilgileri düzenlendi!");
        } catch (error) {
            shopify.toast.show(
                error.errorMessage || "Adres düzenlenirken bir hata oluştu.",
                {
                    isError: true,
                }
            );
        }
    };

    const isEditMode =
        editMode[id]?.city || editMode[id]?.district || editMode[id]?.address;

    return (
        <div>
            {isEditMode ? (
                <div data-address-field="true">
                    <Box minWidth="100px">
                        <TextField
                            value={value}
                            onChange={(newValue) =>
                                handleChange(id, field, newValue)
                            }
                            onBlur={() => handleBlur(id, field)}
                            autoFocus={editMode[id]?.[field]}
                            size="slim"
                        />
                    </Box>
                </div>
            ) : (
                <div
                    onMouseEnter={() => handleMouseEnter(id, field)}
                    style={{ position: "relative", minHeight: "16px" }}
                >
                    <Box>
                        <Text>{value}</Text>
                        {hoveredCell.id === id &&
                            hoveredCell.field === field && (
                                <Box
                                    position="absolute"
                                    insetInlineEnd="0"
                                    insetBlockStart="0"
                                >
                                    <Popover
                                        active={popoverActive}
                                        activator={
                                            <Button
                                                icon={MenuHorizontalIcon}
                                                variant="secondary"
                                                size="micro"
                                                onClick={togglePopover}
                                            />
                                        }
                                        onClose={() => setPopoverActive(false)}
                                        preferredAlignment="right"
                                    >
                                        <ActionList
                                            items={[
                                                {
                                                    content: "Düzenle",
                                                    prefix: (
                                                        <Icon
                                                            source={EditIcon}
                                                        />
                                                    ),
                                                    onAction: handleEditAction,
                                                    disabled: loading,
                                                },
                                                {
                                                    content:
                                                        "AI ile Tüm Adres Bilgilerini Düzenle",
                                                    prefix: (
                                                        <Icon
                                                            source={MagicIcon}
                                                        />
                                                    ),
                                                    onAction: handleAiEdit,
                                                    disabled: loading,
                                                },
                                            ]}
                                        />
                                    </Popover>
                                </Box>
                            )}
                    </Box>
                </div>
            )}
        </div>
    );
};
