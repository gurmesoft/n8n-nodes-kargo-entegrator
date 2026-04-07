import { IndexTable, EmptySearchResult } from "@shopify/polaris";
import ShipmentIndexRow from "./shipmentIndexRow";

export default function ShipmentIndexTable({
    shipments,
    statusMapping,
    formatTime,
    data,
    appName,
}) {
    const rowMarkup = shipments.map((shipmentData, index) => (
        <ShipmentIndexRow
            key={shipmentData.id}
            shipmentData={shipmentData}
            statusMapping={statusMapping}
            formatTime={formatTime}
            index={index}
            appName={appName}
        />
    ));

    const emptyStateMarkup = (
        <EmptySearchResult
            title="Hiç gönderi oluşturulmamış"
            description="Yeni bir gönderi oluşturmak için Sipariş -> Diğer işlemler -> Kargo Ent. ile Gönderi Oluştur butonuna tıklayın."
            withIllustration
        />
    );

    return (
        <IndexTable
            resourceName={{ singular: "Gönderi", plural: "Gönderiler" }}
            itemCount={shipments.length}
            selectable={false}
            emptyState={emptyStateMarkup}
            headings={[
                { title: "id" },
                { title: "Alıcı" },
                { title: "Adres" },
                { title: "Takip Numarası" },
                { title: "Kargo" },
                { title: "Gönderilme Durumu" },
                { title: "Desi" },
                { title: "Toplam Tutar"},
                { title: "Ödeme Yapacak Taraf" },
                { title: "Ödeme Tipi" },
                { title: "Son Güncelleme" },
            ]}
            pagination={{
                hasNext: data.current_page < data.last_page,
                onNext: () => {
                    const params = new URLSearchParams(window.location.search);
                    params.set("page", String(data.current_page + 1));
                    open(`shopify://admin/apps/${appName}/shipment?${params.toString()}`, "_self");
                },
                hasPrevious: data.current_page > 1,
                onPrevious: () => {
                    const params = new URLSearchParams(window.location.search);
                    params.set("page", String(data.current_page - 1));
                    open(`shopify://admin/apps/${appName}/shipment?${params.toString()}`, "_self");
                },
            }}
        >
            {rowMarkup}
        </IndexTable>
    );
}
