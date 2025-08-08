import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';

export async function executeReturnActions(
	this: IExecuteFunctions,
	operation: string,
	i: number,
	credentials: any
): Promise<INodeExecutionData> {
	const baseUrl = credentials.baseUrl || 'https://app.kargoentegrator.com/api';
	let responseData;

	if (operation === 'create') {
		// Get parameters
		const warehouseId = this.getNodeParameter('warehouseId', i);
		const cargoCompanyId = this.getNodeParameter('cargoCompanyId', i);
		const customerCollection = this.getNodeParameter('customer', i);
		const returnDate = this.getNodeParameter('returnDate', i);
		const returnReason = this.getNodeParameter('returnReason', i);
		const weight = this.getNodeParameter('weight', i);
		const packageCount = this.getNodeParameter('packageCount', i);
		const packageType = this.getNodeParameter('packageType', i);
		const paymentType = this.getNodeParameter('paymentType', i);
		const payorType = this.getNodeParameter('payorType', i);
		const platformId = this.getNodeParameter('platformId', i);
		const desi = this.getNodeParameter('desi', i);
		const kg = this.getNodeParameter('kg', i);
		const currency = this.getNodeParameter('currency', i);
		const total = this.getNodeParameter('total', i) || '';
		const isPayAtDoor = this.getNodeParameter('isPayAtDoor', i);
		const note = this.getNodeParameter('note', i) || '';

		// Extract customer data from fixedCollection
		let customerData: any = {};
		if (customerCollection && typeof customerCollection === 'object') {
			const collection = customerCollection as any;
			if (collection.customerDetails) {
				// If customerDetails is an array, take the first element
				if (Array.isArray(collection.customerDetails)) {
					customerData = collection.customerDetails[0] || {};
				} else {
					// If customerDetails is a direct object
					customerData = collection.customerDetails;
				}
			} else {
				// Fallback: customerCollection might be the data directly
				customerData = collection;
			}
		}

		// Validate required customer fields
		const requiredFields = ['name', 'surname', 'phone', 'email', 'country', 'postcode', 'city', 'district', 'address'];
		for (const field of requiredFields) {
			if (!customerData[field] || (customerData as any)[field].trim() === '') {
				throw new Error(`Customer ${field} is required and cannot be empty`);
			}
		}

		// Create return shipment
		const body = {
			warehouse_id: warehouseId,
			cargo_integration_id: cargoCompanyId,
			return_at: returnDate,
			return_reason: returnReason,
			weight: weight,
			package_count: packageCount,
			package_type: packageType,
			payment_type: paymentType,
			payor_type: payorType,
			platform_id: platformId,
			platform: 'n8n',
			desi: desi,
			kg: kg,
			currency: currency,
			total: total,
			is_pay_at_door: isPayAtDoor,
			note: note,
			customer: {
				name: customerData.name,
				surname: customerData.surname,
				phone: customerData.phone,
				email: customerData.email,
				country: customerData.country,
				postcode: customerData.postcode,
				city: customerData.city,
				district: customerData.district,
				address: customerData.address,
			},
		};

		responseData = await this.helpers.request({
			method: 'POST',
			url: `${baseUrl}/returneds`,
			headers: {
			Authorization: `Bearer ${credentials.apiKey}`,
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
			body,
			json: true,
		});
	} else if (operation === 'get') {
		// Get return shipment
		const returnId = this.getNodeParameter('returnId', i);
		responseData = await this.helpers.request({
			method: 'GET',
			url: `${baseUrl}/returneds/${returnId}`,
			headers: {
				Authorization: `Bearer ${credentials.apiKey}`,
				Accept: 'application/json',
			},
			json: true,
		});
	} else if (operation === 'getAll') {
		// Get all return shipments
		responseData = await this.helpers.request({
			method: 'GET',
			url: `${baseUrl}/returneds`,
			headers: {
			Authorization: `Bearer ${credentials.apiKey}`,
			Accept: 'application/json',
		},
			json: true,
		});
	} else if (operation === 'printReturnedPdf') {
		// Print returned PDF
		const returnId = this.getNodeParameter('returnId', i);
		responseData = await this.helpers.request({
			method: 'GET',
			url: `${baseUrl}/print-returned-pdf/${returnId}`,
			headers: {
				Authorization: `Bearer ${credentials.apiKey}`,
				Accept: 'application/pdf',
			},
			encoding: null,
		});
	}

	return {
		json: responseData,
		pairedItem: {
			item: i,
		},
	};
}