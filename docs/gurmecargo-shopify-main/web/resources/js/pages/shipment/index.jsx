import { Page } from "@shopify/polaris";
import moment from "moment";
import "moment/dist/locale/tr";
import MainApp from "@/MainApp";
import { useState } from "react";
import ShipmentIndexFilters from "./partials/shipmentIndexFilters";
import ShipmentIndexTable from "./partials/shipmentIndexTable";

export default function ({ data, appName }) {
    const reverseStatusMapping = {
        "Gönderime Hazır": "non_processed",
        "Yola Çıktı": "shipped",
        "Taşıma Sürecinde": "on_transit",
        "Dağıtım Merkezinde": "at_delivery_center",
        "Dağıtıma Çıktı": "in_courier",
        "Teslim Edildi": "delivered",
        "Teslim Edilemedi": "on_return",
    };

    const statusMapping = Object.keys(reverseStatusMapping).reduce(
        (acc, key) => {
            acc[reverseStatusMapping[key]] = key;
            return acc;
        },
        {}
    );

    const [shipments, setShipments] = useState(data.data);

    const formatTime = (date) => {
        moment.locale("tr");
        return moment(date).format("lll");
    };

    return (
        <MainApp>
            <Page
                backAction={{
                    content: "Back",
                    onAction: () => {
                        open(`shopify://admin/orders`, "_self");
                    },
                }}
                title="Gönderiler"
            >
                <ShipmentIndexFilters
                    setShipments={setShipments}
                    shipments={shipments}
                    appName={appName}
                />
                <ShipmentIndexTable
                    shipments={shipments}
                    statusMapping={statusMapping}
                    formatTime={formatTime}
                    data={data}
                    appName={appName}
                />
            </Page>
        </MainApp>
    );
}
