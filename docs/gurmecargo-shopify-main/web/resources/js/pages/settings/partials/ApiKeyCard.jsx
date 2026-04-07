import { useEffect, useState } from "react";
import {
    BlockStack,
    Text,
    TextField,
    Button,
    Link,
    InlineStack,
    Box,
} from "@shopify/polaris";
import { SaveBar, useAppBridge } from "@shopify/app-bridge-react";
import { useTranslation } from "react-i18next";
import request from "@/plugins/request";
import { uiStore } from "@/store/ui.js";
import {
    RefreshIcon,
    ArrowLeftIcon,
    ExternalIcon,
} from "@shopify/polaris-icons";

export function ApiKeyCard({
    user,
    invalidApiKey,
    clearErrorMessage,
    profile,
}) {
    const { loading } = uiStore();
    const shopify = useAppBridge();
    const { t } = useTranslation();
    const [apiKey, setApiKey] = useState(user.api_key);
    const [apiKeyError, setApiKeyError] = useState(false);
    const [connectionMode, setConnectionMode] = useState(null);

    const handlePopulate = async () => {
        request(
            `/user/${user.id}`,
            "POST",
            {
                api_key: apiKey,
            },
            () => {
                (shopify.toast.show(t("ApiKeyCard.savedApiKey", {})),
                    window.location.reload());
            },
        );
    };

    const handleCancel = () => {
        setApiKey(user.api_key);
        shopify.saveBar.hide("save-bar");
    };

    const deleteApiKey = async () => {
        if (confirm("Silmek istediğinize emin misiniz?") == true) {
            request(
                `/user/${user.id}`,
                "PATCH",
                {
                    api_key: "",
                },
                () => window.location.reload(),
            );
        }
    };

    const handleError = () => {
        clearErrorMessage();
        setApiKeyError(invalidApiKey);
    };

    useEffect(() => {
        if (invalidApiKey) {
            handleError();
        }
    }, [invalidApiKey]);

    const sync = () => {
        request("/settings/sync", "POST", {}, () => {
            shopify.toast.show("Ayarlar senkronize edildi.");
            window.location.reload();
        });
    };

    const secretEmail = (email) => {
        const [name, domain] = email.split("@");

        if (name.length <= 2) return email;

        const first = name[0];
        const last = name[name.length - 1];

        const stars = "*".repeat(name.length - 2);

        return `${first}${stars}${last}@${domain}`;
    };
    const fetchApiKeyFromSaas = async () => {
        window.localStorage.setItem("redirect", "/settings");
        const response = await fetch("/api-key/redirect");
        const data = await response.json();
        if (data.redirect_url) {
            window.open(data.redirect_url, "_top");
        }
    };

    return (
        <BlockStack gap="200">
            <SaveBar id="save-bar">
                <button variant={"primary"} onClick={handlePopulate}>
                    Kaydet
                </button>
                <button onClick={handleCancel}>Vazgeç</button>
            </SaveBar>
            <Text as="h1" variant="headingSm">
                API Bağlantısı
            </Text>

            {user.api_key ? (
                <>
                    <BlockStack gap="1000">
                        <Box width="100%">
                            <TextField value={apiKey} readOnly />
                        </Box>
                    </BlockStack>
                    <BlockStack gap="200">
                        <InlineStack blockAlign="start" align="space-between">
                            <Box width="50%">
                                <Text variant="bodyMd" as="p" autosize>
                                    Bağlantıyla alakalı bir sorun yaşıyorsanız
                                    API anahtarınızı silmek için Bağlantıyı Kes
                                    butonuna tıklayabilirsiniz.
                                </Text>
                                <Text
                                    variant="bodyMd"
                                    as="p"
                                    fontWeight="medium"
                                >
                                    {user.last_sync_time} tarihinde senkronize
                                    edildi.
                                </Text>
                                {profile?.team?.owner?.email && (
                                    <Text variant="bodyMd" as="p">
                                        {secretEmail(profile.team.owner.email)}
                                    </Text>
                                )}
                                <Link
                                    monochrome="true"
                                    url="https://app.kargoentegrator.com"
                                    target="_blank"
                                >
                                    Yönetim uygulamasına git
                                </Link>
                            </Box>
                            <Box width="50%">
                                <InlineStack gap="200" align="end">
                                    <Button
                                        tone="success"
                                        variant="primary"
                                        icon={RefreshIcon}
                                        onClick={sync}
                                    >
                                        Senkronize Et
                                    </Button>
                                    <Button
                                        variant="primary"
                                        tone="critical"
                                        onClick={() => {
                                            deleteApiKey();
                                        }}
                                        loading={loading}
                                        disabled={loading}
                                    >
                                        Bağlantıyı Kes
                                    </Button>
                                </InlineStack>
                            </Box>
                        </InlineStack>
                    </BlockStack>
                </>
            ) : (
                <BlockStack gap="400">
                    {connectionMode === null ? (
                        <BlockStack gap="300">
                            <Text variant="bodyMd" as="p">
                                Kargo Entegratör hesabınızı bağlamak için bir
                                yöntem seçin:
                            </Text>
                            <InlineStack gap="200">
                                <Button
                                    variant="primary"
                                    onClick={fetchApiKeyFromSaas}
                                    icon={ExternalIcon}
                                >
                                    Otomatik Bağla
                                </Button>
                                <Button
                                    variant="secondary"
                                    onClick={() => setConnectionMode("manual")}
                                >
                                    Manuel Bağla
                                </Button>
                            </InlineStack>
                        </BlockStack>
                    ) : (
                        <BlockStack gap="300">
                            <InlineStack gap="200" align="start">
                                <Button
                                    variant="plain"
                                    onClick={() => setConnectionMode(null)}
                                    icon={ArrowLeftIcon}
                                >
                                    Geri
                                </Button>
                            </InlineStack>
                            <form
                                onInput={() => {
                                    shopify.saveBar.show("save-bar");
                                }}
                            >
                                <Box width="100%">
                                    <TextField
                                        value={apiKey}
                                        onChange={(value) => setApiKey(value)}
                                        error={apiKeyError}
                                    />
                                </Box>
                            </form>
                            <Text variant="bodyMd" as="p" autosize>
                                Uygulamayı kullanabilmeniz için{" "}
                                <Link
                                    url="https://kargoentegrator.com"
                                    target="_blank"
                                >
                                    Kargo Entegratör
                                </Link>{" "}
                                üzerinden hesap açıp Ayarlar{"->"}API ve
                                Platform Uygulamaları kısmındaki API
                                anahtarınızı girmeniz gerekmektedir.
                            </Text>
                        </BlockStack>
                    )}
                </BlockStack>
            )}
        </BlockStack>
    );
}
