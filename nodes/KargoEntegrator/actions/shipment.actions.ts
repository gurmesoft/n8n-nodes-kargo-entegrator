import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';

export async function executeShipmentActions(
	this: IExecuteFunctions,
	operation: string,
	i: number,
	credentials: any
): Promise<INodeExecutionData> {
	let responseData;
	const baseUrl = credentials.baseUrl || 'https://app.kargoentegrator.com/api';

	if (operation === 'create') {
		// Create shipment
		const warehouseId = this.getNodeParameter('warehouseId', i) as any;
		const cargoCompanyId = this.getNodeParameter('cargoCompanyId', i) as any;

		// Get customer data from fixedCollection
		const customerCollection = this.getNodeParameter('customer', i) as any;
		
		// FixedCollection in n8n typically returns an array with the collection name as key
		let customerData = {};
		if (customerCollection && customerCollection.customerDetails) {
			// If customerDetails is an array (typical for fixedCollection)
			if (Array.isArray(customerCollection.customerDetails) && customerCollection.customerDetails.length > 0) {
				customerData = customerCollection.customerDetails[0];
			} else {
				// If customerDetails is an object
				customerData = customerCollection.customerDetails;
			}
		}
		// Customer bilgilerinin dolu olup olmadığını kontrol et
		if (!customerData || Object.keys(customerData).length === 0) {
			throw new Error('Müşteri bilgileri zorunludur. Lütfen tüm müşteri bilgilerini doldurun.');
		}

		// Zorunlu customer alanlarını kontrol et
		const requiredFields = ['name', 'surname', 'phone', 'email', 'country', 'postcode', 'city', 'district', 'address'];
		for (const field of requiredFields) {
			if (!(customerData as any)[field] || (customerData as any)[field].toString().trim() === '') {
				throw new Error(`Müşteri ${field} bilgisi zorunludur ve boş olamaz.`);
			}
		}

		const body = {
			cargo_integration_id: typeof cargoCompanyId === 'object' ? cargoCompanyId.value : cargoCompanyId,
			warehouse_id: typeof warehouseId === 'object' ? warehouseId.value : warehouseId,
			customer: customerData,
			payment_type: this.getNodeParameter('paymentType', i),
			package_type: this.getNodeParameter('packageType', i),
			payor_type: this.getNodeParameter('payorType', i),
			is_pay_at_door: this.getNodeParameter('isPayAtDoor', i),
			currency: this.getNodeParameter('currency', i),
			total: this.getNodeParameter('total', i),
			platform_d_id: this.getNodeParameter('platformId', i),
			platform: 'n8n',
			desi: this.getNodeParameter('desi', i),
			kg: this.getNodeParameter('kg', i),
			note: this.getNodeParameter('note', i),
		};

		responseData = await this.helpers.request({
			method: 'POST',
			url: `${baseUrl}/shipments`,
			headers: {
				Authorization: `Bearer ${credentials.apiKey}`,
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body,
			json: true,
		});
	} else if (operation === 'get') {
		// Get shipment
		const shipmentId = this.getNodeParameter('shipmentId', i);
		responseData = await this.helpers.request({
			method: 'GET',
			url: `${baseUrl}/shipments/${shipmentId}`,
			headers: {
				Authorization: `Bearer ${credentials.apiKey}`,
				Accept: 'application/json',
			},
			json: true,
		});
	} else if (operation === 'getAll') {
		// Get all shipments
		const limit = this.getNodeParameter('limit', i);
		responseData = await this.helpers.request({
			method: 'GET',
			url: `${baseUrl}/shipments?limit=${limit}`,
			headers: {
				Authorization: `Bearer ${credentials.apiKey}`,
				Accept: 'application/json',
			},
			json: true,
		});
	} else if (operation === 'printPdf') {
		// Generate PDF document for shipments
		const shipmentIds = this.getNodeParameter('shipmentIds', i) as string;
		const outputFormat = this.getNodeParameter('outputFormat', i) as string;
		const shipmentArray = shipmentIds.split(',').map(id => id.trim());
		
		// Build query parameters for multiple shipments
		const queryParams = shipmentArray.map((id, index) => `shipments[${index}]=${id}`).join('&');
		
		const pdfBuffer = await this.helpers.request({
			method: 'GET',
			url: `${baseUrl}/print-pdf?${queryParams}`,
			headers: {
				Authorization: `Bearer ${credentials.apiKey}`,
				Accept: 'application/pdf',
			},
			encoding: null, // Important for binary data
		});

		const fileName = `shipments_${shipmentArray.join('_')}.pdf`;
		
		if (outputFormat === 'base64') {
			// Return as JSON with base64 string and metadata
			return {
				json: {
					pdfData: pdfBuffer.toString('base64'),
					fileName: fileName,
					mimeType: 'application/pdf',
					fileExtension: 'pdf',
					fileSize: pdfBuffer.length,
					shipmentIds: shipmentArray
				},
				pairedItem: {
					item: i,
				},
			};
		} else {
			// Use n8n's prepareBinaryData helper for proper binary data format
			const convertedValue = await this.helpers.prepareBinaryData(
				pdfBuffer,
				fileName,
				'application/pdf'
			);
			
			if (!convertedValue.fileName) {
				const fileExtension = convertedValue.fileExtension
					? `.${convertedValue.fileExtension}`
					: '.pdf';
				convertedValue.fileName = `file${fileExtension}`;
			}
			
			return {
				json: { shipmentIds: shipmentArray },
				binary: {
					data: convertedValue
				},
				pairedItem: {
					item: i,
				},
			};
		}
	}

	return {
		json: responseData,
		pairedItem: {
			item: i,
		},
	};
}