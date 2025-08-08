import { INodeProperties } from 'n8n-workflow';

export const returnOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['return'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a return shipment',
				action: 'Create a return shipment',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a return shipment by ID',
				action: 'Get a return shipment',
			},
			{
				name: 'Get All',
				value: 'getAll',
				description: 'Get all return shipments',
				action: 'Get all return shipments',
			},
			{
				name: 'Print Returned PDF',
				value: 'printReturnedPdf',
				description: 'Generate PDF output for a returned shipment',
				action: 'Print returned PDF',
			},
		],
		default: 'create',
		required: true,
	},
];

export const returnFields: INodeProperties[] = [
	{
		displayName: 'Return ID',
		name: 'returnId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['return'],
				operation: ['get', 'printReturnedPdf'],
			},
		},
		default: '',
		required: true,
		description: 'ID of the return shipment to retrieve',
	},
	{
		displayName: 'Original Shipment ID',
		name: 'originalShipmentId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['return'],
				operation: ['create'],
			},
		},
		default: '',
		required: true,
		description: 'ID of the original shipment for return',
	},
	{
		displayName: 'Return Reason',
		name: 'returnReason',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['return'],
				operation: ['create'],
			},
		},
		default: '',
		required: true,
		description: 'Reason for the return',
	},
];