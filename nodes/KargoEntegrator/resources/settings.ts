import { INodeProperties } from 'n8n-workflow';

export const settingsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['settings'],
			},
		},
		options: [
			{
				name: 'Get Shipment Settings',
				value: 'getShipmentSettings',
				action: 'Get shipment settings',
			},
			{
				name: 'Get Return Settings',
				value: 'getReturnSettings',
				action: 'Get return settings',
			},
		],
		default: 'getShipmentSettings',
		required: true,
	},
];

export const settingsFields: INodeProperties[] = [
	// No additional fields needed for settings operations
];