import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
	NodeConnectionType,
	ILoadOptionsFunctions,
	INodePropertyOptions,
	ApplicationError,
} from 'n8n-workflow';

// Import resource definitions
import { shipmentOperations, shipmentFields } from './resources/shipment';
import { returnOperations, returnFields } from './resources/return';
import { cargoOperations, cargoFields } from './resources/cargo';
import { warehouseOperations, warehouseFields } from './resources/warehouse';
import { settingsOperations, settingsFields } from './resources/settings';

// Import action functions
import { executeShipmentActions } from './actions/shipment.actions';
import { executeReturnActions } from './actions/return.actions';
import { executeCargoActions } from './actions/cargo.actions';
import { executeWarehouseActions } from './actions/warehouse.actions';
import { executeSettingsActions } from './actions/settings.actions';

// Node version from package.json
import packageJson from '../../package.json';
const nodeVersion: string = packageJson.version;

// Send tracking ping only once per API key (n8n process lifetime)
const _pingedKeys = new Set<string>();

export class KargoEntegrator implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Kargo Entegratör',
		name: 'kargoEntegrator',
		icon: 'file:kargoentegrator.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Kargo Entegratör API for shipment management',
		documentationUrl: 'https://dev.kargoentegrator.com',
		defaults: {
			name: 'Kargo Entegratör',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'kargoEntegratorApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Cargo Integration',
						value: 'cargo',
						description: 'List cargo company integrations linked to your account. <a href="https://dev.kargoentegrator.com/api/integrations/kargo-listeleme">API Docs</a>.',
					},
					{
						name: 'Return',
						value: 'return',
						description: 'Create and manage return shipments. <a href="https://dev.kargoentegrator.com/api/returneds/olusturma">API Docs</a>.',
					},
					{
						name: 'Setting',
						value: 'settings',
						description: 'Get shipment and return settings for your account',
					},
					{
						name: 'Shipment',
						value: 'shipment',
						description: 'Create, list, and manage shipments. <a href="https://dev.kargoentegrator.com/api/shipments/olusturma">API Docs</a>.',
					},
					{
						name: 'Warehouse',
						value: 'warehouse',
						description: 'List warehouses linked to your account. <a href="https://dev.kargoentegrator.com/api/settings/depo-listeleme">API Docs</a>.',
					},
				],
				default: 'shipment',
				required: true,
			},
			...shipmentOperations,
			...shipmentFields,
			...returnOperations,
			...returnFields,
			...cargoOperations,
			...cargoFields,
			...warehouseOperations,
			...warehouseFields,
			...settingsOperations,
			...settingsFields,
		],

	};

	methods = {
		loadOptions: {
			getWarehouses: this.getWarehouses,
			getCargoCompanies: this.getCargoCompanies,
		},
	};

	async getWarehouses(
		this: ILoadOptionsFunctions,
	): Promise<INodePropertyOptions[]> {
		const credentials = await this.getCredentials('kargoEntegratorApi');
		const baseUrl = credentials.baseUrl || 'https://app.kargoentegrator.com/api';

		try {
			const responseData = await this.helpers.httpRequestWithAuthentication.call(
				this,
				'kargoEntegratorApi',
				{
					method: 'GET',
					url: `${baseUrl}/settings/warehouses`,
					json: true,
				}
			);

			// Check response structure with better error handling
			if (!responseData) {
				return [];
			}

			let warehouseArray = null;
			
			if (Array.isArray(responseData)) {
				warehouseArray = responseData;
			} else if (responseData.data && Array.isArray(responseData.data)) {
				warehouseArray = responseData.data;
			} else if (responseData.data && responseData.data.data && Array.isArray(responseData.data.data)) {
				warehouseArray = responseData.data.data;
			} else {
				return [];
			}

			if (!warehouseArray || warehouseArray.length === 0) {
				return [];
			}

			return warehouseArray.map((warehouse: any) => {
				return {
					name: warehouse.name || warehouse.title || `Warehouse ${warehouse.id}`,
					value: warehouse.id ? warehouse.id.toString() : '',
					description: `${warehouse.company || warehouse.name || ''} - ${warehouse.city || ''}`.trim().replace(/^-\s*|\s*-$/, '') || 'Warehouse',
				};
			});
		} catch (error) {
			throw new ApplicationError(`Failed to load warehouses: ${error.message || error}`);
		}
	}

	async getCargoCompanies(
		this: ILoadOptionsFunctions,
	): Promise<INodePropertyOptions[]> {
		const credentials = await this.getCredentials('kargoEntegratorApi');
		const baseUrl = credentials.baseUrl || 'https://app.kargoentegrator.com/api';

		try {
			const responseData = await this.helpers.httpRequestWithAuthentication.call(
				this,
				'kargoEntegratorApi',
				{
					method: 'GET',
					url: `${baseUrl}/integration/cargos`,
					json: true,
				}
			);

			// Check response structure with better error handling
			if (!responseData) {
				return [];
			}

			let companiesArray = null;
			
			if (Array.isArray(responseData)) {
				companiesArray = responseData;
			} else if (responseData.data && Array.isArray(responseData.data)) {
				companiesArray = responseData.data;
			} else if (responseData.data && responseData.data.data && Array.isArray(responseData.data.data)) {
				companiesArray = responseData.data.data;
			} else {
				return [];
			}

			if (!companiesArray || companiesArray.length === 0) {
				return [];
			}

			return companiesArray.map((company: any) => {
				return {
					name: company.title || company.name || `Company ${company.id}`,
					value: company.id ? company.id.toString() : '',
					description: company.title || company.name || company.description || 'Cargo Company',
				};
			});
		} catch (error) {
			throw new ApplicationError(`Failed to load cargo companies: ${error.message || error}`);
		}
	}

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const credentials = await this.getCredentials('kargoEntegratorApi');

		// Send tracking ping on first execution after API key is saved
		const apiKey = credentials.apiKey as string;
		if (apiKey && !_pingedKeys.has(apiKey)) {
			_pingedKeys.add(apiKey);
			await sendTrackingPing();
		}

		for (let i = 0; i < items.length; i++) {
			const resource = this.getNodeParameter('resource', i) as string;
			const operation = this.getNodeParameter('operation', i) as string;

			let responseData;

			try {
			if (resource === 'shipment') {
				const shipmentResult = await executeShipmentActions.call(this, operation, i, credentials);
				// For printPdf operation, shipmentResult is already a complete INodeExecutionData
				if (operation === 'printPdf') {
					returnData.push(shipmentResult);
				} else {
					// For other operations, wrap the response in the standard format
					returnData.push({
						json: shipmentResult || {},
						pairedItem: {
							item: i,
						},
					});
				}
			} else if (resource === 'return') {
				// Return actions return INodeExecutionData directly
				const returnResult = await executeReturnActions.call(this, operation, i, credentials);
				returnData.push(returnResult);
			} else if (resource === 'warehouse') {
				responseData = await executeWarehouseActions.call(this, operation, i, credentials);
				returnData.push({
					json: responseData || {},
					pairedItem: {
						item: i,
					},
				});
			} else if (resource === 'settings') {
				responseData = await executeSettingsActions.call(this, operation, i, credentials);
				returnData.push({
					json: responseData || {},
					pairedItem: {
						item: i,
					},
				});
			} else if (resource === 'cargo') {
				responseData = await executeCargoActions.call(this, operation, i, credentials);
				returnData.push({
					json: responseData || {},
					pairedItem: {
						item: i,
					},
				});
			}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error.message,
						},
						pairedItem: {
							item: i,
						},
					});
					continue;
				}
				throw new NodeOperationError(this.getNode(), error.message, {
					itemIndex: i,
				});
			}
		}

		return [returnData];
	}
}

async function sendTrackingPing(): Promise<void> {
	const log = (globalThis as any).console;

	try {
		const env = (globalThis as any).process?.env || {};
		const n8nUrl = env.N8N_HOST || env.WEBHOOK_URL || env.N8N_EDITOR_BASE_URL || '';
		const n8nEmail = env.N8N_EMAIL || '';

		const payload = {
			site_name: 'n8n / ' + n8nUrl,
			url: n8nUrl,
			admin_email: n8nEmail,
			platform: 'n8n',
			plugin: 'kargo-entegrator',
			plugin_version: nodeVersion,
			active_plugins: [{ name: 'kargo-entegrator', version: nodeVersion }],
			server: { php_version: null, php_curl: null, mysql_version: null, php_soap: null, software: null },
			wp: {
				version: null, debug_mode: null, memory_limit: null, multisite: null,
				theme_author: null, theme_name: null, theme_slug: null, theme_uri: null, theme_version: null,
			},
			is_local: n8nUrl.includes('localhost') || n8nUrl.includes('127.0.0.1') ? 'yes' : 'no',
			ip_address: null,
			users: { total: null },
		};

		log.log('[KargoEntegrator] Tracking ping request:', JSON.stringify(payload, null, 2));

		const response = await (globalThis as any).fetch('https://trackingdata-gobg2kq4lq-uc.a.run.app', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
			body: JSON.stringify(payload),
		});

		const responseText = await response.text();
		log.log('[KargoEntegrator] Tracking ping response:', response.status, responseText);
	} catch (error: any) {
		log.error('[KargoEntegrator] Tracking ping error:', error.message || error);
	}
}
