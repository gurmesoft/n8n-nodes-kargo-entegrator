import { useAppBridge } from "@shopify/app-bridge-react";
import { uiStore } from "@/store/ui.js";

const { startLoading, stopLoading, setErrorMessage } = uiStore.getState();

const shopify = useAppBridge();
export default async function request(
    url,
    method,
    body,
    successCallback,
    errorCallback
) {
    setErrorMessage(null);
    startLoading();
    shopify.loading(true);

    const response = await fetch(url, {
        method: method,
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        body: body ? JSON.stringify(body) : null,
    });

    if (!response.ok) {
        shopify.loading(false);
        stopLoading();
        const data = await response.json();
        console.error(data);

        if (errorCallback) {
            errorCallback(data);
        } else {
            switch (response.status) {
                case 500:
                    setErrorMessage(data.message);
                    break;
                case 422:
                    setErrorMessage(data.message);
                    break;
            }
        }
    } else {

        let data = response;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        }

        shopify.loading(false);
        stopLoading();

        if (successCallback) {
            successCallback(data);
        }
        return data;

    }
}
