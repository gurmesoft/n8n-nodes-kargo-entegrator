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
		// Create return shipment
		const body = {
			original_shipment_id: this.getNodeParameter('originalShipmentId', i),
			return_reason: this.getNodeParameter('returnReason', i),
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
				'X-Platform': 'n8n',
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