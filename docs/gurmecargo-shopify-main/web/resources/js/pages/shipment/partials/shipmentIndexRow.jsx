import { IndexTable, Link, Text, Badge } from "@shopify/polaris";

export default function ShipmentIndexRow({
    shipmentData,
    statusMapping,
    formatTime,
    index,
    appName,
}) {
    const { id, updated_at, shipment, order_id } = shipmentData;

    return (
        <IndexTable.Row id={id} key={id} position={index}>
            <IndexTable.Cell>{shipment.platform_d_id}</IndexTable.Cell>
            <IndexTable.Cell>
                <Link
                    monochrome
                    removeUnderline
                    dataPrimaryLink
                    onClick={() => {
                        open(
                            `shopify://admin/apps/${appName}/shipment/create?id=${order_id}`,
                            "_self"
                        );
                    }}
                >
                    {shipment.receiver.name + " " + shipment.receiver.surname}
                </Link>
            </IndexTable.Cell>
            <IndexTable.Cell>
                {shipment.receiver.address +
                    " " +
                    shipment.receiver.district +
                    " " +
                    shipment.receiver.city}
            </IndexTable.Cell>
            <IndexTable.Cell>
                <Text
                    as="span"
                    alignment={shipment.tracking_number ? "start" : "center"}
                >
                    <Link
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                        url={shipment.tracking_link}
                        monochrome={!shipment.tracking_link}
                        removeUnderline={!shipment.tracking_link}
                    >
                        {shipment.tracking_number || "-"}
                    </Link>
                </Text>
            </IndexTable.Cell>
            <IndexTable.Cell>{shipment.cargo_company.title}</IndexTable.Cell>
            <IndexTable.Cell>
                <Badge>{statusMapping[shipment.status]}</Badge>
            </IndexTable.Cell>
            <IndexTable.Cell>
                <Text as="span" alignment="center">
                    {shipment.desi}
                </Text>
            </IndexTable.Cell>
            <IndexTable.Cell>
                <Text as="span" alignment="center">
                    {shipment.shipping_cost
                        ? shipment.shipping_cost + "₺"
                        : "-"}
                </Text>
            </IndexTable.Cell>
            <IndexTable.Cell>
                {shipment.payor_type === "sender" ? "Gönderici" : "Alıcı"}
            </IndexTable.Cell>
            <IndexTable.Cell>
                {shipment.payment_type === "cash_money"
                    ? `Nakit${shipment.is_pay_at_door ? " / Kapıda" : ""}`
                    : `Kredi Kartı${
                          shipment.is_pay_at_door ? " / Kapıda" : ""
                      }`}
            </IndexTable.Cell>
            <IndexTable.Cell>{formatTime(updated_at)}</IndexTable.Cell>
        </IndexTable.Row>
    );
}
