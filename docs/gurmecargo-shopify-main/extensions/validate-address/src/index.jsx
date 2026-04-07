import {
  reactExtension,
  BlockStack,
  Button,
  TextField,
  SkeletonTextBlock,
  Heading,
  View,
  useApi,
  useSettings,
  InlineStack,
  Banner,
  Grid,
  GridItem,
} from "@shopify/ui-extensions-react/checkout";

import { useState, useEffect } from "react";

const PRODUCTION_APP_URL = "https://shopify.kargoentegrator.com";

const getAppUrl = () => {
  try {
    return process?.env?.APP_URL || PRODUCTION_APP_URL;
  } catch (error) {
    return PRODUCTION_APP_URL;
  }
};

const useHeaders = (extension) => {
  const { sessionToken } = useApi(extension);

  return async () => ({
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${await sessionToken.get()}`,
  });
};

const purchase = "purchase.thank-you.block.render";
export const thankYouBlock = reactExtension(purchase, () => (
  <ThankYou extension={purchase} />
));

function ThankYou({ extension }) {
  const { shippingAddress, orderConfirmation } = useApi(extension);

  if (shippingAddress.current.countryCode !== "TR") {
    return null;
  }
  const headers = useHeaders(extension);
  const { use_ai: useAi } = useSettings();
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [form, setForm] = useState({
    city: "",
    district: "",
    address: "",
    country: "",
  });

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const address = shippingAddress.current;
    const map = {
      order_id: orderConfirmation.current.order.id,
      postcode: address.zip,
      country: address.countryCode,
      city: address.city,
      district: address.address2,
      address: address.address1,
    };

    setForm(map);
    getAddress(map);
  };

  const getAddress = async (map) => {
    try {
      setLoading(true);
      const response = await fetch(`${getAppUrl()}/api/validate-address/get`, {
        method: "POST",
        headers: await headers(),
        body: JSON.stringify({
          use_ai: useAi,
          address: `${map.address} ${map.postcode ? ` ${map.postcode}` : ""}`,
          district: map.district,
          city: map.city,
          country: map.country,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        setForm({ ...map, ...data.data });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const storeAddress = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${getAppUrl()}/api/validate-address/store`,
        {
          method: "POST",
          headers: await headers(),
          body: JSON.stringify(form),
        }
      );
      if (response.ok) {
        setSaveSuccess(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View border="base" padding="base" borderRadius="base" background="base">
      {saveSuccess ? (
        <Banner
          status="success"
          title="Adres bilgileri başarıyla doğrulandı."
        />
      ) : (
        <BlockStack>
          <Heading>Adres bilgilerini doğrula</Heading>
          <Heading level={4}>
            Teslimat işleminde problem yaşamamak için siparişinizin adres
            bilgilerini doğrulayınız.
          </Heading>
          {loading ? (
            <SkeletonTextBlock lines={4} />
          ) : (
            <Grid columns={["50%", "50%"]} spacing="base">
              <TextField
                label="İlçe"
                value={form.district}
                onChange={(value) => setForm({ ...form, district: value })}
                required
              />
              <TextField
                label="İl"
                value={form.city}
                onChange={(value) => setForm({ ...form, city: value })}
                required
              />
              <GridItem columnSpan={2}>
                <TextField
                  label="Açık Adres"
                  value={form.address}
                  onChange={(value) => setForm({ ...form, address: value })}
                  multiline={2}
                />
              </GridItem>
            </Grid>
          )}
          <InlineStack>
            <Button
              accessibilityRole="submit"
              loading={loading}
              onPress={storeAddress}
            >
              Adresini Onayla
            </Button>
          </InlineStack>
        </BlockStack>
      )}
    </View>
  );
}
