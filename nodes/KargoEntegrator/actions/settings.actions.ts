import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';

export async function executeSettingsActions(
	this: IExecuteFunctions,
	operation: string,
	i: number,
	credentials: any
): Promise<INodeExecutionData> {
	let responseData;
	const baseUrl = credentials.baseUrl || 'https://app.kargoentegrator.com/api';

	if (operation === 'getShipmentSettings') {
		// Get shipment settings
		responseData = await this.helpers.request({
			method: 'GET',
			url: `${baseUrl}/settings/shipment-setting`,
			headers: {
				Authorization: `Bearer ${credentials.apiKey}`,
				Accept: 'application/json',
			},
			json: true,
		});
	} else if (operation === 'getReturnSettings') {
		// Get return settings
		responseData = await this.helpers.request({
			method: 'GET',
			url: `${baseUrl}/settings/returned-setting`,
			headers: {
				Authorization: `Bearer ${credentials.apiKey}`,
				Accept: 'application/json',
				'X-Platform': 'n8n',
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