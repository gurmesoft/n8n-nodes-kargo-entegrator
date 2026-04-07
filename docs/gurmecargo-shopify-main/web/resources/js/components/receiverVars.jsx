import {
    Card,
    Grid,
    Text,
    TextField,
    BlockStack,
    InlineStack,
    Button,
    Tooltip,
} from "@shopify/polaris";
import { MagicIcon, UndoIcon } from "@shopify/polaris-icons";
import { useEffect, useState } from "react";
import request from "@/plugins/request";
import { formElements } from "@/utils/fields";
import { uiStore } from "@/store/ui";
import CountryAutocomplete from "./CountryAutocomplete";

export default function ReceiverVars({ data, setData }) {
    const { loading, setErrorMessage } = uiStore();
    const [isAddressFixed, setIsAddressFixed] = useState(false);
    const [isTurkey, setIsTurkey] = useState(
        data.customer.country_code === "TR"
    );
    const [unfixedAddress, setUnfixedAddress] = useState({
        city: data.customer.city,
        district: data.customer.district,
        address: data.customer.address,
        country: data.customer.country,
    });
    useEffect(() => {
        setIsTurkey(data.customer.country_code === "TR");
    }, [data.customer.country_code]);

    const updateCustomer = (key, value) => {
        setData((prevShipment) => ({
            ...prevShipment,
            customer: {
                ...prevShipment.customer,
                [key]: value,
            },
        }));
    };

    const isValueEmpty = (value) => {
        return !value || value === "" ? "Bu alan boş bırakılamaz" : "";
    };

    const isFieldRequired = (fieldId, value) => {
        if (fieldId === "postcode") {
            return isTurkey ? "" : isValueEmpty(value);
        }
        if (fieldId === "email") {
            return "";
        }

        return isValueEmpty(value);
    };

    const fixAddress = async () => {
        const { formattedAddress } = await request(
            "/api/fix-address",
            "POST",
            {
                city: data.customer.city,
                district: data.customer.district,
                address: data.customer.address,
                country: data.customer.country,
            },
            (response) => {
                if (response.error) {
                    setErrorMessage(response.errorMessage);
                    return;
                }
            }
        );

        if (formattedAddress) {
            setData((prevShipment) => ({
                ...prevShipment,
                customer: {
                    ...prevShipment.customer,
                    address: formattedAddress.fullAddress,
                    city: formattedAddress.city,
                    district: formattedAddress.district,
                    country: formattedAddress.country,
                },
            }));
            setIsAddressFixed(true);
            shopify.toast.show("AI ile düzenlendi.");
        }
    };

    const resetFixedAdress = () => {
        setData((prevShipment) => ({
            ...prevShipment,
            customer: {
                ...prevShipment.customer,
                address: unfixedAddress.address,
                city: unfixedAddress.city,
                district: unfixedAddress.district,
                country: unfixedAddress.country,
            },
        }));
        setIsAddressFixed(false);
        shopify.toast.show("Düzenleme geri alındı.");
    };

    const handleCountryChange = (countryCode, countryName) => {
        updateCustomer("country_code", countryCode);
        updateCustomer("country", countryName);
    };
    return (
        <Card>
            <BlockStack gap="200">
                <InlineStack align="space-between">
                    <Text as="h2" variant="headingSm">
                        Müşteri Bilgileri
                    </Text>
                    <Tooltip
                        active
                        content={
                            isAddressFixed
                                ? "Düzenlenmiş adresi geri al"
                                : "AI ile adresi düzenle"
                        }
                    >
                        {!isAddressFixed && (
                            <Button
                                loading={loading}
                                variant="tertiary"
                                onClick={fixAddress}
                                icon={MagicIcon}
                            ></Button>
                        )}
                        {isAddressFixed && (
                            <Button
                                loading={loading}
                                variant="tertiary"
                                onClick={resetFixedAdress}
                                icon={UndoIcon}
                            ></Button>
                        )}
                    </Tooltip>
                </InlineStack>
                <BlockStack>
                    <Grid gap="100">
                        {formElements.map((element) => (
                            <Grid.Cell
                                key={element.label}
                                columnSpan={
                                    element.label === "Adres"
                                        ? {
                                              xs: 6,
                                              sm: 6,
                                              md: 6,
                                              lg: 12,
                                              xl: 12,
                                          }
                                        : {
                                              xs: 6,
                                              sm: 6,
                                              md: 2,
                                              lg: 4,
                                              xl: 4,
                                          }
                                }
                            >
                                {element.id === "country" ? (
                                    <CountryAutocomplete
                                        label="Ülke"
                                        value={data.customer.country}
                                        countryCode={data.customer.country_code}
                                        error={isValueEmpty(
                                            data.customer.country
                                        )}
                                        onChange={handleCountryChange}
                                    />
                                ) : element.id === "city" ? (
                                    <TextField
                                        label={isTurkey ? "İl" : "Eyalet"}
                                        value={data.customer.city}
                                        onChange={(value) => {
                                            updateCustomer("city", value);
                                        }}
                                        error={isValueEmpty(data.customer.city)}
                                    />
                                ) : element.id === "city_code" ? (
                                    !isTurkey ? (
                                        <TextField
                                            label="Eyalet Kodu"
                                            value={
                                                data.customer.city_code || ""
                                            }
                                            onChange={(value) =>
                                                updateCustomer(
                                                    "city_code",
                                                    value
                                                )
                                            }
                                            error={
                                                !isTurkey &&
                                                isValueEmpty(
                                                    data.customer.city_code
                                                )
                                            }
                                        />
                                    ) : null
                                ) : element.id === "district" ? (
                                    <TextField
                                        label={isTurkey ? "İlçe" : "Şehir"}
                                        value={data.customer.district || ""}
                                        onChange={(value) =>
                                            updateCustomer("district", value)
                                        }
                                        error={isValueEmpty(
                                            data.customer.district
                                        )}
                                    />
                                ) : (
                                    <TextField
                                        label={element.label}
                                        value={data.customer[element.id]}
                                        onChange={(value) =>
                                            updateCustomer(element.id, value)
                                        }
                                        type={
                                            element.type ? element.type : "text"
                                        }
                                        error={isFieldRequired(
                                            element.id,
                                            data.customer[element.id]
                                        )}
                                    />
                                )}
                            </Grid.Cell>
                        ))}
                    </Grid>
                </BlockStack>
            </BlockStack>
        </Card>
    );
}
