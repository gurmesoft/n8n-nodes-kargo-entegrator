import { Card, Page, Tabs } from "@shopify/polaris";
import MainApp from "@/MainApp";
import { uiStore } from "@/store/ui";
import { useCallback, useState } from "react";
import GeneralSettings from "./partials/generalSettings";
import LocationSettings from "./partials/locationSettings";
import DeliveryProfileMaps from "./partials/deliveryProfileMaps";
import AutomaticShipmentSettings from "./partials/automaticShipmentSettings";
import OtherSettings from "./partials/otherSettings";
import MetafieldSettings from "./partials/metafieldSettings";

export default function Settings({
    localizeData,
    locations,
    cargoIntegrations,
    warehouses,
    locationSettings,
    profile,
    otherSettings,
    deliveryProfileMaps,
}) {
    const { errorMessage, clearErrorMessage } = uiStore();
    const [selected, setSelected] = useState(0);

    const handleTabChange = useCallback(
        (selectedTabIndex) => {
            setSelected(selectedTabIndex);
            if (selected !== selectedTabIndex) {
                shopify.saveBar.hide("save-bar");
            }
        },
        [selected],
    );

    const tabs = [
        {
            id: "account-settings",
            content: "Hesap Ayarları",
            accessibilityLabel: "Hesap Ayarları",
            panelID: "account-settings-content",
        },
        {
            id: "location-settings",
            content: "Konum Ayarları",
            panelID: "location-settings-content",
            disabled: !profile?.plan,
        },
        {
            id: "metafield-settings",
            content: "Metafield Ayarları",
            panelID: "metafield-settings-content",
            disabled: !profile?.plan,
        },
        {
            id: "delivery-profile-maps",
            content: "Gönderim Profil Eşleştirmeleri",
            panelID: "delivery-profile-maps-content",
            disabled: !profile?.plan,
        },
        {
            id: "auto-shipment",
            content: "Otomatik Gönderi",
            panelID: "auto-shipment-content",
            badge: "Business",
            disabled:
                !profile?.plan ||
                [2, 3, 16, 17, 18].includes(profile.plan.plan_id),
        },
        {
            id: "other-settings",
            content: "Diğer Ayarlar",
            panelID: "other-settings-content",
            disabled: !profile?.plan,
        },
    ];

    return (
        <MainApp>
            <Page title="Ayarlar">
                <Tabs
                    tabs={tabs}
                    selected={selected}
                    onSelect={handleTabChange}
                >
                    {selected === 0 ? (
                        <Card>
                            <GeneralSettings
                                user={localizeData.user}
                                invalidApiKey={errorMessage}
                                clearErrorMessage={clearErrorMessage}
                                profile={profile}
                            />
                        </Card>
                    ) : selected === 1 ? (
                        <Card>
                            <LocationSettings
                                locationSettings={locationSettings}
                                locations={locations}
                                cargoIntegrations={cargoIntegrations}
                                warehouses={warehouses}
                            />
                        </Card>
                    ) : selected === 2 ? (
                        <Card>
                            <MetafieldSettings />
                        </Card>
                    ) : selected === 3 ? (
                        <Card>
                            <DeliveryProfileMaps
                                deliveryProfileMaps={deliveryProfileMaps}
                                cargoIntegrations={cargoIntegrations}
                            />
                        </Card>
                    ) : selected === 4 ? (
                        <Card>
                            <AutomaticShipmentSettings
                                user={localizeData.user}
                            />
                        </Card>
                    ) : (
                        <Card>
                            <OtherSettings otherSettings={otherSettings} />
                        </Card>
                    )}
                </Tabs>
            </Page>
        </MainApp>
    );
}
