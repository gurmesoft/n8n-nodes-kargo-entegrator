import { IndexTable, EmptySearchResult } from "@shopify/polaris";
import ReturnedIndexRow from "./returnedIndexRow";

export default function ReturnedIndexTable({
    returneds,
    statusMapping,
    formatTime,
    data,
    appName,
}) {
    const rowMarkup = returneds.map((returnedData, index) => (
        <ReturnedIndexRow
            key={returnedData.id}
            returnedData={returnedData}
            statusMapping={statusMapping}
            formatTime={formatTime}
            index={index}
            appName={appName}
        />
    ));

    const emptyStateMarkup = (
        <EmptySearchResult
            title="Hiç iade oluşturulmamış"
            description="Yeni bir iade oluşturmak için Sipariş -> Diğer işlemler -> Kargo Ent. ile İade Oluştur butonuna tıklayın."
            withIllustration
        />
    );

    return (
        <IndexTable
            resourceName={{ singular: "İade", plural: "İadeler" }}
            itemCount={returneds.length}
            selectable={false}
            emptyState={emptyStateMarkup}
            headings={[
                { title: "id" },
                { title: "Alıcı" },
                { title: "Adres" },
                { title: "Takip Numarası" },
                { title: "Kargo" },
                { title: "Gönderilme Durumu" },
                { title: "Son Güncelleme" },
            ]}
            pagination={{
                hasNext: data.current_page < data.last_page,
                onNext: () => {
                    const params = new URLSearchParams(window.location.search);
                    params.set("page", String(data.current_page + 1));
                    open(`shopify://admin/apps/${appName}/returned?${params.toString()}`, "_self");
                },
                hasPrevious: data.current_page > 1,
                onPrevious: () => {
                    const params = new URLSearchParams(window.location.search);
                    params.set("page", String(data.current_page - 1));
                    open(`shopify://admin/apps/${appName}/returned?${params.toString()}`, "_self");
                },
            }}
        >
            {rowMarkup}
        </IndexTable>
    );
}
