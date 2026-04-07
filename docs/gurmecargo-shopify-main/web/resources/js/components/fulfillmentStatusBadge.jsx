import React from 'react';
import { Badge } from '@shopify/polaris'; // Adjust the import based on your Badge component source

const FulfillmentStatusBadge = ({ fulfillmentStatus }) => {
	switch (fulfillmentStatus) {
		case "shipped":
			return <Badge progress="complete">Gönderildi</Badge>;
		case "unfulfilled":
		case "unshipped":
			return <Badge progress="incomplete" tone="attention">Hazırlanıyor</Badge>;
		case "partial":
			return <Badge progress="partiallyComplete" tone="warning">Kısmi Gönderim</Badge>;
		default:
			return null;
	}
};

export default FulfillmentStatusBadge;