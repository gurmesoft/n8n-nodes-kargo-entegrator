import { defineConfig } from "vite";
import path from "path";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";

const host = process.env.APP_URL
    ? process.env.APP_URL.replace(/https?:\/\//, "")
    : "localhost";

let hmrConfig;
if (host === "localhost") {
    hmrConfig = {
        protocol: "ws",
        host: "localhost",
        port: 3000,
        clientPort: 3000,
    };
} else {
    hmrConfig = {
        protocol: "wss",
        host: host,
        port: process.env.FRONTEND_PORT,
        clientPort: 443,
    };
}

export default defineConfig({
    plugins: [
        laravel({
            input: ["resources/css/app.css", "resources/js/app.jsx"],
            refresh: true,
        }),
        react(),
    ],
    build: {
        outDir: "./dist",
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./resources/js"),
            "@resources": path.resolve(__dirname, "./resources"),
        },
    },

    server: {
        host: "0.0.0.0",
        port: 3000,
        strictPort: true,
        hmr: hmrConfig,
    },
});
