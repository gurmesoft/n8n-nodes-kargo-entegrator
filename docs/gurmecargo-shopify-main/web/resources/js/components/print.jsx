import { useState, useEffect } from "react";
import { Modal, TitleBar } from "@shopify/app-bridge-react";
import React from "react";
import { BlockStack, Box, Text, TextField, Thumbnail } from "@shopify/polaris";

export default function Print({ response, withModal = false, data }) {
    const [hasPrinted, setHasPrinted] = useState(false);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [element, setElement] = useState(null);

    useEffect(() => {
        if (response && response.print) {
            prepareUrl(response.print);
            setHasPrinted(false); // Reset print state when new PDF URL is set
        }
    }, [response]);

    const prepareUrl = (data) => {
        const pdfData = atob(data);
        const arrayBuffer = new Uint8Array(pdfData.length);

        for (let i = 0; i < pdfData.length; i++) {
            arrayBuffer[i] = pdfData.charCodeAt(i);
        }

        const blob = new Blob([arrayBuffer], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
        if (withModal) {
            shopify.modal.show("print-modal");
        }
    };

    const print = (event) => {
        if (!hasPrinted) {
            event.target.contentWindow.focus();
            event.target.contentWindow.print();
            setHasPrinted(true);
            setElement(event.target.contentWindow);
        }
    };
    const manualPrint = () => {
        element.focus();
        element.print();
    };

    const handleHide = () => {
        shopify.loading(true);
        window.location.reload();
    };

    const printSettings = () => {
        window.open(
            "https://app.kargoentegrator.com/settings/print-settings",
            "_blank"
        );
    };

    return (
        <>
            <Modal id={"print-modal"} variant="large" onHide={handleHide}>
                <TitleBar title="Yazdır">
                    <button
                        variant="primary"
                        onClick={() => {
                            manualPrint();
                        }}
                    >
                        Yazdır
                    </button>
                    <button
                        onClick={() => {
                            printSettings();
                        }}
                    >
                        Yazdırma şablonunu özelleştir
                    </button>
                </TitleBar>
                {pdfUrl && (
                    <Box padding="400">
                        <BlockStack gap="400">
                            <iframe
                                src={pdfUrl}
                                id="barcode-pdf"
                                style={{ height: "100vh", width: "100%" }}
                                onLoad={print}
                            ></iframe>
                        </BlockStack>
                    </Box>
                )}
            </Modal>
        </>
    );
}
