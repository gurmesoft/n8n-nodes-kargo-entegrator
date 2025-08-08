import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';

export async function executeCargoActions(
	this: IExecuteFunctions,
	operation: string,
	i: number,
	credentials: any
): Promise<INodeExecutionData> {
	let responseData;
	const baseUrl = credentials.baseUrl || 'https://app.kargoentegrator.com/api';

	if (operation === 'getAll') {
		// Get all cargo companies
		responseData = await this.helpers.request({
			method: 'GET',
			url: `${baseUrl}/integration/cargos`,
			headers: {
				Authorization: `Bearer ${credentials.apiKey}`,
				Accept: 'application/json',
			},
			json: true,
		});
	} else if (operation === 'get') {
		// Get specific cargo company
		const cargoId = this.getNodeParameter('cargoId', i);
		responseData = await this.helpers.request({
			method: 'GET',
			url: `${baseUrl}/integration/cargos/${cargoId}`,
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