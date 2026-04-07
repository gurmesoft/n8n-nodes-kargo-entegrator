import { IndexTable, Link, Text, Badge } from "@shopify/polaris";

export default function ReturnedIndexRow({
    returnedData,
    statusMapping,
    formatTime,
    index,
    appName,
}) {
    const { id, updated_at, returned, order_id } = returnedData;

    return (
        <IndexTable.Row id={id} key={id} position={index}>
            <IndexTable.Cell>{returned.platform_d_id}</IndexTable.Cell>
            <IndexTable.Cell>
                <Link
                    monochrome
                    removeUnderline
                    dataPrimaryLink
                    onClick={() => {
                        open(
                            `shopify://admin/apps/${appName}/returned/create?id=${order_id}`,
                            "_self"
                        );
                    }}
                >
                    {returned.sender.name + " " + returned.sender.surname}
                </Link>
            </IndexTable.Cell>
            <IndexTable.Cell>
                {returned.sender.address +
                    " " +
                    returned.sender.district +
                    " " +
                    returned.sender.city}
            </IndexTable.Cell>
            <IndexTable.Cell>
                <Text
                    as="span"
                    alignment={returned.tracking_number ? "start" : "center"}
                >
                    <Link
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                        url={returned.tracking_link}
                        monochrome={!returned.tracking_link}
                        removeUnderline={!returned.tracking_link}
                    >
                        {returned.tracking_number || "-"}
                    </Link>
                </Text>
            </IndexTable.Cell>
            <IndexTable.Cell>{returned.cargo_company.title}</IndexTable.Cell>
            <IndexTable.Cell>
                <Badge>{statusMapping[returned.status]}</Badge>
            </IndexTable.Cell>
            <IndexTable.Cell>{formatTime(updated_at)}</IndexTable.Cell>
        </IndexTable.Row>
    );
}
