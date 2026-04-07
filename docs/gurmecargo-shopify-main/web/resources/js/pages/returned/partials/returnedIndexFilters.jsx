import { IndexFilters, useSetIndexFiltersMode } from "@shopify/polaris";
import { useEffect, useState } from "react";

export default function ReturnedIndexFilters({
    setReturneds,
    returneds,
    appName,
}) {
    const { mode, setMode } = useSetIndexFiltersMode();

    const itemStrings = [
        "Hepsi",
        "Gönderime Hazır",
        "Yola Çıktı",
        "Taşıma Sürecinde",
        "Dağıtım Merkezinde",
        "Dağıtıma Çıktı",
        "Teslim Edildi",
    ];

    const reverseStatusMapping = {
        "Gönderime Hazır": "non_processed",
        "Yola Çıktı": "shipped",
        "Taşıma Sürecinde": "on_transit",
        "at_delivery_center": "Dağıtım Merkezinde",
        "Dağıtıma Çıktı": "in_courier",
        "Teslim Edildi": "delivered",
    };

    const [selected, setSelected] = useState(0);

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const status = queryParams.get("status");

        if (status === "non_processed") {
            setSelected(1);
        } else if (status === "shipped") {
            setSelected(2);
        } else if (status === "on_transit") {
            setSelected(3);
        } else if (status === "at_delivery_center") {
            setSelected(4);
        } else if (status === "in_courier") {
            setSelected(5);
        } else if (status === "delivered") {
            setSelected(6);
        } else {
            setSelected(0);
        }
    }, [])

    const sortOptions = [
        {
            label: "Yaratılma Tarihi",
            value: "date asc",
            directionLabel: "Artan",
        },
        {
            label: "Yaratılma Tarihi",
            value: "date desc",
            directionLabel: "Azalan",
        },
    ];

    const [sortSelected, setSortSelected] = useState(["date asc"]);

    const handleSortChange = (value) => {
        setSortSelected(value);
        const sortedReturneds = [...returneds].sort((a, b) => {
            const dateA = new Date(a.returned.created_at);
            const dateB = new Date(b.returned.created_at);
            if (value[0] === "date asc") {
                return dateA - dateB;
            } else if (value[0] === "date desc") {
                return dateB - dateA;
            }
            return 0;
        });
        setReturneds(sortedReturneds);
    };

    const tabs = itemStrings.map((item, index) => ({
        content: item,
        index,
        onAction: () => {
            if (item === "Hepsi") {
                open(`shopify://admin/apps/${appName}/returned`, "_self")
            } else {
                open(`shopify://admin/apps/${appName}/returned?status=${reverseStatusMapping[item]}`, "_self")
            }
        },
        id: `${item}-${index}`,
        isLocked: index === 0,
    }));

    return (
        <IndexFilters
            sortOptions={sortOptions}
            sortSelected={sortSelected}
            queryValue=""
            onSort={handleSortChange}
            onQueryChange={() => {}}
            mode={mode}
            setMode={setMode}
            tabs={tabs}
            selected={selected}
            onSelect={setSelected}
            canCreateNewView={false}
            filters={[]}
            appliedFilters={[]}
            onClearAll={() => {}}
            hideFilters
            hideQueryField
        />
    );
}
