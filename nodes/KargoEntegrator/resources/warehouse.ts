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
				name: 'Get All',
				value: 'getAll',
				description: 'Get all warehouses',
				action: 'Get all warehouses',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get specific warehouse',
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
		description: 'ID of the warehouse to retrieve',
	},
];