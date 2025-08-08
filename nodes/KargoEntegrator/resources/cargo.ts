import { INodeProperties } from 'n8n-workflow';

export const cargoOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['cargo'],
			},
		},
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many cargo companies',
				action: 'Get many cargo companies',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get specific cargo company',
				action: 'Get a cargo company',
			},
		],
		default: 'getAll',
		required: true,
	},
];

export const cargoFields: INodeProperties[] = [
	{
		displayName: 'Cargo Company ID',
		name: 'cargoId',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['cargo'],
				operation: ['get'],
			},
		},
		default: 1,
		required: true,
		description: 'ID of the cargo company to retrieve',
	},
];