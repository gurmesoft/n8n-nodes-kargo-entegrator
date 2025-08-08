import {
	IDataObject,
	IHookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookFunctions,
	IWebhookResponseData,
	NodeConnectionType,
} from 'n8n-workflow';

export class KargoEntegratorTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Kargo Entegratör Trigger',
		name: 'kargoEntegratorTrigger',
		icon: 'file:kargoentegrator.svg',
		group: ['trigger'],
		version: 1,
		description: 'Triggers when shipment status changes via webhook',
		defaults: {
			name: 'Kargo Entegratör Trigger',
		},
		inputs: [],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'kargoEntegratorApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
				{
					displayName: 'Status to Track',
					name: 'statusToTrack',
				type: 'options',
				required: true,
				options: [
					{
						name: 'At Delivery Center',
						value: 'at_delivery_center',
						description: 'Gönderi dağıtım merkezinde',
					},
					{
						name: 'Canceled',
						value: 'canceled',
						description: 'Gönderi iptal edildi',
					},
					{
						name: 'Delivered',
						value: 'delivered',
						description: 'Gönderi teslim edildi',
					},
					{
						name: 'Failed',
						value: 'failed',
						description: 'Gönderi başarısız',
					},
					{
						name: 'In Courier',
						value: 'in_courier',
						description: 'Gönderi kuryede',
					},
					{
						name: 'Non Processed',
						value: 'non_processed',
						description: 'Gönderi henüz işlenmedi',
					},
					{
						name: 'On Return',
						value: 'on_return',
						description: 'Gönderi iade yolunda',
					},
					{
						name: 'On Transit',
						value: 'on_transit',
						description: 'Gönderi yolda',
					},
					{
						name: 'Shipped',
						value: 'shipped',
						description: 'Gönderi kargoya verildi',
					},
				],
				default: 'shipped',
				description: 'Which status changes should trigger the workflow',
			},
			{
				displayName: 'Authentication Type',
				name: 'authType',
				type: 'options',
				required: true,
				options: [
					{
						name: 'None',
						value: 'none',
						description: 'No authentication required',
					},
					{
						name: 'API Key',
						value: 'api_key',
						description: 'Use API key authentication',
					},
					{
						name: 'Bearer Token',
						value: 'bearer',
						description: 'Use Bearer token authentication',
					},
				],
				default: 'none',
				description: 'Authentication method for the webhook',
			},
			{
				displayName: 'Auth Key',
				name: 'authKey',
				type: 'string',
				displayOptions: {
					show: {
						authType: ['api_key', 'bearer'],
					},
				},
				default: '',
				placeholder: 'Authorization header key',
				description: 'The key name for the authorization header',
			},
			{
				displayName: 'Auth Value',
				name: 'authValue',
				type: 'string',
				typeOptions: {
					password: true,
				},
				displayOptions: {
					show: {
						authType: ['api_key', 'bearer'],
					},
				},
				default: '',
				placeholder: 'Authorization token/key value',
				description: 'The value for the authorization header',
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');
				if (webhookData.webhookId === undefined) {
					return false;
				}

				try {
					await this.helpers.httpRequestWithAuthentication.call(
						this,
						'kargoEntegratorApi',
						{
							method: 'GET',
							url: 'https://app.kargoentegrator.com/api/settings/webhooks',
						},
					);
					return true;
				} catch (error) {
					return false;
				}
			},
			async create(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');
				const webhookUrl = this.getNodeWebhookUrl('default');
				const statusToTrack = this.getNodeParameter('statusToTrack') as string;
				const authType = this.getNodeParameter('authType') as string;
				const authKey = this.getNodeParameter('authKey', '') as string;
				const authValue = this.getNodeParameter('authValue', '') as string;

				const webhookPayload = {
					url: webhookUrl,
					type: 'shipment',
					status: statusToTrack,
					auth_type: authType,
					auth_key: authType !== 'none' ? authKey : null,
					auth_value: authType !== 'none' ? authValue : null,
					is_active: true,
				};

				try {
					const response = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'kargoEntegratorApi',
						{
							method: 'POST',
							url: 'https://app.kargoentegrator.com/api/settings/webhooks',
							body: webhookPayload,
							json: true,
						},
					);

					webhookData.webhookId = response.id;
					return true;
				} catch (error) {
					return false;
				}
			},
			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');
				if (webhookData.webhookId === undefined) {
					return true;
				}

				try {
					await this.helpers.httpRequestWithAuthentication.call(
						this,
						'kargoEntegratorApi',
						{
							method: 'DELETE',
							url: `https://app.kargoentegrator.com/api/settings/webhooks/${webhookData.webhookId}`,
						},
					);
				} catch (error) {
					// Silent fail for cleanup
				}

				delete webhookData.webhookId;
				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const req = this.getRequestObject();
		const body = req.body as IDataObject;

		// Return the webhook data as trigger output
		return {
			workflowData: [
				[
					{
						json: {
							...body,
							timestamp: new Date().toISOString(),
							webhookReceived: true,
						},
					},
				],
			],
		};
	}
}