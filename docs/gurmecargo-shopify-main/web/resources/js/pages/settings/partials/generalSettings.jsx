import { Layout, Box } from "@shopify/polaris";
import { ApiKeyCard } from "./ApiKeyCard";
import { Plan } from "./plan";

export default function GeneralSettings({
    user,
    invalidApiKey,
    clearErrorMessage,
    profile,
}) {
    return (
        <Box padding="500">
            <Layout>
                {profile?.plan && (
                    <Layout.Section>
                        <Plan plan={profile.plan} />
                    </Layout.Section>
                )}
                <Layout.Section>
                    <ApiKeyCard
                        user={user}
                        invalidApiKey={invalidApiKey}
                        clearErrorMessage={clearErrorMessage}
                        profile={profile}
                    />
                </Layout.Section>
            </Layout>
        </Box>
    );
}
