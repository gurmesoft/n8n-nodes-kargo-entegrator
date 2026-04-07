import MainApp from "@/MainApp";
import { Page } from "@shopify/polaris";
import moment from "moment";
import "moment/dist/locale/tr";
import { useState } from "react";
import ReturnedIndexFilters from "./partials/returnedIndexFilters";
import ReturnedIndexTable from "./partials/returnedIndexTable";


export default function ({data, appName}) {

    const statusMapping = {
        "non_processed": "Gönderime Hazır",
        "shipped": "Yola Çıktı",
        "on_transit": "Taşıma Sürecinde",
        "at_delivery_center": "Dağıtım Merkezinde",
        "in_courier": "Dağıtıma Çıktı",
        "delivered": "Teslim Edildi",
        "on_return": "Teslim Edilemedi",
    };
    const [returneds, setReturneds] = useState(data.data);

    const formatTime = (date) => {
        moment.locale("tr");
        return moment(date).format("lll");
    }

    return(
        <MainApp>
            <Page
                backAction={{
                    content: "Back",
                    onAction: () => {
                        open(`shopify://admin/orders`, "_self");
                    },
                }}
                title="İadeler"
            >
                <ReturnedIndexFilters
                    setReturneds={setReturneds}
                    returneds={returneds}
                    appName={appName}
                />
                <ReturnedIndexTable
                    returneds={returneds}
                    statusMapping={statusMapping}
                    formatTime={formatTime}
                    data={data}
                    appName={appName}
                />
            </Page>
        </MainApp>
    )
}