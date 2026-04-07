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
				description: 'List all cargo company integrations linked to your account. <a href="https://dev.kargoentegrator.com/api/integrations/kargo-listeleme">API Docs</a>.',
				action: 'Get many cargo integrations',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a specific cargo company integration by ID',
				action: 'Get a cargo integration',
			},
		],
		default: 'getAll',
		required: true,
	},
];

export const cargoFields: INodeProperties[] = [
	{
		displayName: 'Cargo Integration ID',
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
		description: 'ID of the cargo integration to retrieve. You can find this in the cargo integrations page of your account.',
	},
];
