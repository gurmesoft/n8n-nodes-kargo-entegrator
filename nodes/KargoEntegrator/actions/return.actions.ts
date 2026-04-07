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
		const warehouseId = this.getNodeParameter('warehouseId', i);
		const cargoCompanyId = this.getNodeParameter('cargoCompanyId', i);
		const customerCollection = this.getNodeParameter('customer', i);
		const returnDate = this.getNodeParameter('returnDate', i);
		const returnReason = this.getNodeParameter('returnReason', i, '') as string;
		const packageType = this.getNodeParameter('packageType', i);
		const paymentType = this.getNodeParameter('paymentType', i);
		const payorType = this.getNodeParameter('payorType', i);
		const platformId = this.getNodeParameter('platformId', i, '') as string;
		const desi = this.getNodeParameter('desi', i);
		const kg = this.getNodeParameter('kg', i);
		const isPayAtDoor = this.getNodeParameter('isPayAtDoor', i) as boolean;
		const note = this.getNodeParameter('note', i, '') as string;

		// Extract customer data from fixedCollection
		let customerData: any = {};
		if (customerCollection && typeof customerCollection === 'object') {
			const collection = customerCollection as any;
			if (collection.customerDetails) {
				if (Array.isArray(collection.customerDetails)) {
					customerData = collection.customerDetails[0] || {};
				} else {
					customerData = collection.customerDetails;
				}
			} else {
				customerData = collection;
			}
		}

		// Validate required customer fields
		const requiredFields = ['name', 'surname', 'phone', 'email', 'country', 'city', 'district', 'address'];
		for (const field of requiredFields) {
			if (!customerData[field] || (customerData as any)[field].trim() === '') {
				throw new Error(`Customer ${field} is required and cannot be empty`);
			}
		}

		const body: Record<string, any> = {
			warehouse_id: warehouseId,
			cargo_integration_id: cargoCompanyId,
			return_at: returnDate,
			package_type: packageType,
			payment_type: paymentType,
			payor_type: payorType,
			platform: 'n8n',
			desi: desi,
			kg: kg,
			is_pay_at_door: isPayAtDoor,
			note: note,
			customer: {
				name: customerData.name,
				surname: customerData.surname,
				phone: customerData.phone,
				email: customerData.email,
				country: customerData.country,
				postcode: customerData.postcode || '',
				city: customerData.city,
				district: customerData.district,
				address: customerData.address,
			},
		};

		if (returnReason) {
			body.return_reason = returnReason;
		}
		if (platformId) {
			body.platform_id = platformId;
		}

		// Pay at door fields
		if (isPayAtDoor) {
			body.currency = this.getNodeParameter('currency', i);
			body.total = this.getNodeParameter('total', i);
		}

		responseData = await this.helpers.httpRequestWithAuthentication.call(
			this,
			'kargoEntegratorApi',
			{
				method: 'POST',
				url: `${baseUrl}/returneds`,
				body,
				json: true,
			}
		);
	} else if (operation === 'get') {
		const returnId = this.getNodeParameter('returnId', i);
		responseData = await this.helpers.httpRequestWithAuthentication.call(
			this,
			'kargoEntegratorApi',
			{
				method: 'GET',
				url: `${baseUrl}/returneds/${returnId}`,
				json: true,
			}
		);
	} else if (operation === 'getAll') {
		responseData = await this.helpers.httpRequestWithAuthentication.call(
			this,
			'kargoEntegratorApi',
			{
				method: 'GET',
				url: `${baseUrl}/returneds`,
				json: true,
			}
		);
	} else if (operation === 'printReturnedPdf') {
		const returnId = this.getNodeParameter('returnId', i);
		const outputFormat = this.getNodeParameter('outputFormat', i, 'binary') as string;

		const pdfBuffer = await this.helpers.httpRequestWithAuthentication.call(
			this,
			'kargoEntegratorApi',
			{
				method: 'GET',
				url: `${baseUrl}/print-returned-pdf/${returnId}`,
				headers: {
					Accept: 'application/pdf',
				},
				encoding: 'arraybuffer',
			}
		);

		const fileName = `return_${returnId}.pdf`;

		if (outputFormat === 'base64') {
			return {
				json: {
					pdfData: pdfBuffer.toString('base64'),
					fileName: fileName,
					mimeType: 'application/pdf',
					size: pdfBuffer.length,
				},
				pairedItem: { item: i },
			};
		} else {
			const binaryData = await this.helpers.prepareBinaryData(
				pdfBuffer,
				fileName,
				'application/pdf'
			);

			return {
				json: {
					fileName: fileName,
					mimeType: 'application/pdf',
					size: pdfBuffer.length,
				},
				binary: { data: binaryData },
				pairedItem: { item: i },
			};
		}
	}

	return {
		json: responseData,
		pairedItem: { item: i },
	};
}
