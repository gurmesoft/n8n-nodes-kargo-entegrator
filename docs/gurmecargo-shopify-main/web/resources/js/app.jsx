import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot } from "react-dom/client";
import { initI18n } from "./utils/i18nUtils";
import "@shopify/polaris/build/esm/styles.css";

createInertiaApp({
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.jsx`,
            import.meta.glob("./pages/**/*.jsx")
        ),
    setup({ el, App, props }) {
        initI18n().then(() => {
            const root = createRoot(el);
            root.render(<App {...props} />);
        });
    },
});
