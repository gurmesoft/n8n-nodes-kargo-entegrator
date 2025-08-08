import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
	NodeConnectionType,
	ILoadOptionsFunctions,
	INodePropertyOptions,
	LoggerProxy as Logger,
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

export class KargoEntegrator implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Kargo Entegratör',
		name: 'kargoEntegrator',
		icon: 'file:kargoentegrator.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Kargo Entegratör API for shipment management',
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
						name: 'Cargo',
						value: 'cargo',
						description: 'Get cargo companies information',
					},
					{
						name: 'Return',
						value: 'return',
						description: 'Manage return shipments',
					},
					{
						name: 'Setting',
						value: 'settings',
						description: 'Get system settings',
					},
					{
						name: 'Shipment',
						value: 'shipment',
						description: 'Manage shipments',
					},
					{
						name: 'Warehouse',
						value: 'warehouse',
						description: 'Manage warehouses',
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
			Logger.info('getWarehouses çağrıldı', { baseUrl, endpoint: '/settings/warehouses' });
			const responseData = await this.helpers.request({
				method: 'GET',
				url: `${baseUrl}/settings/warehouses`,
				headers: {
					Authorization: `Bearer ${credentials.apiKey}`,
					Accept: 'application/json',
				},
				json: true,
			});
			Logger.info('getWarehouses response alındı', { 
				response: responseData,
				responseType: typeof responseData,
				isArray: Array.isArray(responseData),
				keys: responseData ? Object.keys(responseData) : 'null'
			});

			// Check response structure with better error handling
			if (!responseData) {
				Logger.error('getWarehouses: Boş response alındı');
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
				Logger.error('getWarehouses: Beklenmeyen response yapısı', { responseData });
				return [];
			}

			if (!warehouseArray || warehouseArray.length === 0) {
				Logger.warn('getWarehouses: Boş warehouse array');
				return [];
			}

			return warehouseArray.map((warehouse: any) => {
				Logger.info('getWarehouses: Warehouse item', { warehouse });
				return {
					name: warehouse.name || warehouse.title || `Warehouse ${warehouse.id}`,
					value: warehouse.id ? warehouse.id.toString() : '',
					description: `${warehouse.company || warehouse.name || ''} - ${warehouse.city || ''}`.trim().replace(/^-\s*|\s*-$/, '') || 'Warehouse',
				};
			});
		} catch (error) {
			Logger.error('getWarehouses error:', error);
			throw new ApplicationError(`Failed to load warehouses: ${error.message || error}`);
		}
	}

	async getCargoCompanies(
		this: ILoadOptionsFunctions,
	): Promise<INodePropertyOptions[]> {
		const credentials = await this.getCredentials('kargoEntegratorApi');
		const baseUrl = credentials.baseUrl || 'https://app.kargoentegrator.com/api';

		try {
			Logger.info('getCargoCompanies çağrıldı', { baseUrl, endpoint: '/integration/cargos' });
			const responseData = await this.helpers.request({
				method: 'GET',
				url: `${baseUrl}/integration/cargos`,
				headers: {
					Authorization: `Bearer ${credentials.apiKey}`,
					Accept: 'application/json',
				},
				json: true,
			});
			Logger.info('getCargoCompanies response alındı', { 
				response: responseData,
				responseType: typeof responseData,
				isArray: Array.isArray(responseData),
				keys: responseData ? Object.keys(responseData) : 'null'
			});

			// Check response structure with better error handling
			if (!responseData) {
				Logger.error('getCargoCompanies: Boş response alındı');
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
				Logger.error('getCargoCompanies: Beklenmeyen response yapısı', { responseData });
				return [];
			}

			if (!companiesArray || companiesArray.length === 0) {
				Logger.warn('getCargoCompanies: Boş companies array');
				return [];
			}

			return companiesArray.map((company: any) => {
				Logger.info('getCargoCompanies: Company item', { company });
				return {
					name: company.title || company.name || `Company ${company.id}`,
					value: company.id ? company.id.toString() : '',
					description: company.title || company.name || company.description || 'Cargo Company',
				};
			});
		} catch (error) {
			Logger.error('getCargoCompanies error:', error);
			throw new ApplicationError(`Failed to load cargo companies: ${error.message || error}`);
		}
	}

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const credentials = await this.getCredentials('kargoEntegratorApi');

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