import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';

export async function executeWarehouseActions(
	this: IExecuteFunctions,
	operation: string,
	i: number,
	credentials: any
): Promise<INodeExecutionData> {
	let responseData;
	const baseUrl = credentials.baseUrl || 'https://app.kargoentegrator.com/api';

	if (operation === 'getAll') {
		// Get all warehouses
		responseData = await this.helpers.request({
			method: 'GET',
			url: `${baseUrl}/settings/warehouses`,
			headers: {
				Authorization: `Bearer ${credentials.apiKey}`,
				Accept: 'application/json',
			},
			json: true,
		});
	} else if (operation === 'get') {
		// Get specific warehouse
		const warehouseId = this.getNodeParameter('warehouseId', i);
		responseData = await this.helpers.request({
			method: 'GET',
			url: `${baseUrl}/settings/warehouses/${warehouseId}`,
			headers: {
				Authorization: `Bearer ${credentials.apiKey}`,
				Accept: 'application/json',
			},
			json: true,
		});
	}

	return {
		json: responseData,
		pairedItem: {
			item: i,
		},
	};
}