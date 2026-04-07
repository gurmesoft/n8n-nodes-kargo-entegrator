import { BlockStack, Box, Card, Icon, InlineStack, Text } from "@shopify/polaris";
import { PlayCircleIcon, XCircleIcon, ResetIcon } from "@shopify/polaris-icons";

export default function ShipmentSteps(props) {


    return (
        <Card>
            <BlockStack gap="400">
                <Text as="h2" variant="headingMd">
                    Gönderi Hareketleri
                </Text>
                {props.steps.map((step, index) => (
                    <InlineStack key={index} align="start" gap="200">
                        <Box>
                            {step.title === "created" && (
                                <Icon source={PlayCircleIcon} />
                            )}
                            {step.title === "canceled" && (
                                <Icon source={XCircleIcon} />
                            )}
                            {step.title !== "created" &&
                                step.title !== "canceled" && (
                                    <Icon source={ResetIcon} />
                                )}
                        </Box>
                        <BlockStack>
                            <Text fontWeight="semibold">{step.content}</Text>
                            <Text variant="subdued">{step.created_at}</Text>
                        </BlockStack>
                    </InlineStack>
                ))}
            </BlockStack>
        </Card>
    );
}