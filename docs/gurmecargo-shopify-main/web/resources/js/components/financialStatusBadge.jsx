import React from 'react';
import { Badge } from '@shopify/polaris';

const FinancialStatusBadge = ({ financialStatus }) => {
	switch (financialStatus) {
		case "paid":
			return <Badge progress="complete">Ödendi</Badge>;
		case "pending":
			return <Badge progress="partiallyComplete" tone="warning">Bekleniyor</Badge>;
		case "unpaid":
			return <Badge progress="incomplete" tone="attention">Ödenmedi</Badge>;
		case "partially_paid":
			return <Badge progress="partiallyComplete" tone="warning">Kısmi Ödeme</Badge>;
		case "partially_refunded":
			return <Badge progress="partiallyComplete" tone="warning">Kısmi İade</Badge>;
		case "refunded":
			return <Badge complete tone="subdued">İade Edildi</Badge>;
		case "voided":
			return <Badge progress="incomplete" tone="critical">İptal Edildi</Badge>;
		case "authorized":
			return <Badge progress="complete">Yetkilendirildi</Badge>;
		default:
			return null;
	}
};

export default FinancialStatusBadge;