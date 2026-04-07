import { INodeProperties } from 'n8n-workflow';

export const warehouseOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['warehouse'],
			},
		},
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'List many warehouses linked to your account. Use this to get warehouse_id values for shipment creation. <a href="https://dev.kargoentegrator.com/api/settings/depo-listeleme">API Docs</a>.',
				action: 'Get many warehouses',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a specific warehouse by ID',
				action: 'Get a warehouse',
			},
		],
		default: 'getAll',
		required: true,
	},
];

export const warehouseFields: INodeProperties[] = [
	{
		displayName: 'Warehouse ID',
		name: 'warehouseId',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['warehouse'],
				operation: ['get'],
			},
		},
		default: 1,
		required: true,
		description: 'ID of the warehouse to retrieve. You can find this in the warehouse addresses page of your account.',
	},
];
