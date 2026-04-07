import { BrowserRouter } from "react-router-dom";
import { NavMenu } from "@shopify/app-bridge-react";
import { Banner, Box, FooterHelp, Link } from "@shopify/polaris";
import { uiStore } from "@/store/ui";

import { PolarisProvider } from "./components";

export default function App({ children }) {
    const { errorMessage, clearErrorMessage } = uiStore();
    return (
        <PolarisProvider>
            <BrowserRouter>
                <NavMenu>
                    <a href="/">
                        Anasayfa
                    </a>
                    <a href="/shipment">Gönderiler</a>
                    <a href="/returned">İadeler</a>
                    <a href="/tracking">Kargo Takip</a>
                    <a href="/settings">Ayarlar</a>
                    <a href="/other-products">Diğer Ürünlerimiz</a>
                </NavMenu>
                {errorMessage && (
                    <Box paddingBlock="400" paddingInline="200">
                        <Banner
                            tone="critical"
                            title="Hata"
                            onDismiss={clearErrorMessage}
                        >
                            {errorMessage}
                        </Banner>
                    </Box>
                )}
                {children}
                <FooterHelp>
                    <Link url="https://gurmehub.com" target="_blank">
                        <img
                            src="/assets/images/gurmehub-logo.png"
                            alt="gurmehub"
                            style={{ height: "16px", width: "85px" }}
                        />
                    </Link>
                </FooterHelp>
            </BrowserRouter>
        </PolarisProvider>
    );
}
