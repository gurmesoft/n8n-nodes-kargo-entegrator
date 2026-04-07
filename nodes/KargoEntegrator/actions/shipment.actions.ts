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

		let customerData = {};
		if (customerCollection && customerCollection.customerDetails) {
			if (Array.isArray(customerCollection.customerDetails) && customerCollection.customerDetails.length > 0) {
				customerData = customerCollection.customerDetails[0];
			} else {
				customerData = customerCollection.customerDetails;
			}
		}

		if (!customerData || Object.keys(customerData).length === 0) {
			throw new Error('Customer information is required. Please fill in all customer fields.');
		}

		// Validate required customer fields
		const requiredFields = ['name', 'surname', 'phone', 'country', 'city', 'district', 'address'];
		for (const field of requiredFields) {
			if (!(customerData as any)[field] || (customerData as any)[field].toString().trim() === '') {
				throw new Error(`Customer ${field} is required and cannot be empty.`);
			}
		}

		const options = this.getNodeParameter('options', i, {}) as {
			createBarcode?: string;
			notificationUrl?: string;
			packageCount?: number;
			platformDId?: string;
			barcode?: string;
			waybillNumber?: string;
			invoiceNumber?: string;
			description?: string;
		};

		const isPayAtDoor = this.getNodeParameter('isPayAtDoor', i) as boolean;

		const body: Record<string, any> = {
			cargo_integration_id: typeof cargoCompanyId === 'object' ? cargoCompanyId.value : cargoCompanyId,
			warehouse_id: typeof warehouseId === 'object' ? warehouseId.value : warehouseId,
			customer: customerData,
			payment_type: this.getNodeParameter('paymentType', i),
			package_type: this.getNodeParameter('packageType', i),
			payor_type: this.getNodeParameter('payorType', i),
			is_pay_at_door: isPayAtDoor,
			platform: 'n8n',
			desi: this.getNodeParameter('desi', i),
			kg: this.getNodeParameter('kg', i),
			note: this.getNodeParameter('note', i),
		};

		const platformId = this.getNodeParameter('platformId', i, '') as string;
		if (platformId) {
			body.platform_id = platformId;
		}

		// Pay at door fields (only when enabled)
		if (isPayAtDoor) {
			body.currency = this.getNodeParameter('currency', i);
			body.total = this.getNodeParameter('total', i);
		}

		// Optional fields from options collection
		if (options.createBarcode) {
			body.create_barcode = options.createBarcode;
		}
		if (options.notificationUrl) {
			body.notification_url = options.notificationUrl;
		}
		if (options.packageCount) {
			body.package_count = options.packageCount;
		}
		if (options.platformDId) {
			body.platform_d_id = options.platformDId;
		}
		if (options.barcode) {
			body.barcode = options.barcode;
		}
		if (options.waybillNumber) {
			body.waybill_number = options.waybillNumber;
		}
		if (options.invoiceNumber) {
			body.invoice_number = options.invoiceNumber;
		}
		if (options.description) {
			body.description = options.description;
		}

		responseData = await this.helpers.httpRequestWithAuthentication.call(
			this,
			'kargoEntegratorApi',
			{
				method: 'POST',
				url: `${baseUrl}/shipments`,
				body,
				json: true,
			}
		);
	} else if (operation === 'get') {
		const shipmentId = this.getNodeParameter('shipmentId', i);
		responseData = await this.helpers.httpRequestWithAuthentication.call(
			this,
			'kargoEntegratorApi',
			{
				method: 'GET',
				url: `${baseUrl}/shipments/${shipmentId}`,
				json: true,
			}
		);
	} else if (operation === 'getAll') {
		const limit = this.getNodeParameter('limit', i);
		responseData = await this.helpers.httpRequestWithAuthentication.call(
			this,
			'kargoEntegratorApi',
			{
				method: 'GET',
				url: `${baseUrl}/shipments?limit=${limit}`,
				json: true,
			}
		);
	} else if (operation === 'printPdf') {
		const shipmentIds = this.getNodeParameter('shipmentIds', i) as string;
		const outputFormat = this.getNodeParameter('outputFormat', i) as string;
		const shipmentArray = shipmentIds.split(',').map(id => id.trim());

		const queryParams = shipmentArray.map((id, index) => `shipments[${index}]=${id}`).join('&');

		const pdfBuffer = await this.helpers.httpRequestWithAuthentication.call(
			this,
			'kargoEntegratorApi',
			{
				method: 'GET',
				url: `${baseUrl}/print-pdf?${queryParams}`,
				headers: {
					Accept: 'application/pdf',
				},
				encoding: 'arraybuffer',
			}
		);

		const fileName = `shipments_${shipmentArray.join('_')}.pdf`;

		if (outputFormat === 'base64') {
			return {
				json: {
					pdfData: pdfBuffer.toString('base64'),
					fileName: fileName,
					mimeType: 'application/pdf',
					fileExtension: 'pdf',
					fileSize: pdfBuffer.length,
					shipmentIds: shipmentArray,
				},
				pairedItem: { item: i },
			};
		} else {
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
				binary: { data: convertedValue },
				pairedItem: { item: i },
			};
		}
	}

	return {
		json: responseData,
		pairedItem: { item: i },
	};
}
