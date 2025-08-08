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
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many return shipments',
				action: 'Get many return shipments',
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
	// Create operation fields - Customer Information
	{
		displayName: 'Customer',
		name: 'customer',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: false,
		},
		displayOptions: {
			show: {
				resource: ['return'],
				operation: ['create'],
			},
		},
		default: {},
		required: true,
		description: 'Customer information',
		options: [
			{
				name: 'customerDetails',
				displayName: 'Customer Details',
				values: [
					{
						displayName: 'Address',
						name: 'address',
						type: 'string',
						default: '',
							required:	true,
						description: 'Customer full address',
					},
					{
						displayName: 'City',
						name: 'city',
						type: 'string',
						default: '',
							required:	true,
						description: 'Customer city',
					},
					{
						displayName: 'Country',
						name: 'country',
						type: 'string',
						default: 'TURKEY',
							required:	true,
						description: 'Customer country',
					},
					{
						displayName: 'District',
						name: 'district',
						type: 'string',
						default: '',
							required:	true,
						description: 'Customer district',
					},
					{
						displayName: 'Email',
						name: 'email',
						type: 'string',
						placeholder: 'name@email.com',
						default: '',
							required:	true,
						description: 'Customer email address',
					},
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
							required:	true,
						description: 'Customer first name',
					},
					{
						displayName: 'Phone',
						name: 'phone',
						type: 'string',
						default: '',
							required:	true,
						description: 'Customer phone number',
					},
					{
						displayName: 'Postcode',
						name: 'postcode',
						type: 'string',
						default: '',
							required:	true,
						description: 'Customer postal code',
					},
					{
						displayName: 'Surname',
						name: 'surname',
						type: 'string',
						default: '',
							required:	true,
						description: 'Customer surname',
					},
				],
			},
		],
	},
	{
		displayName: 'Warehouse Name or ID',
		name: 'warehouseId',
		type: 'options',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['return'],
				operation: ['create'],
			},
		},
		typeOptions: {
			loadOptionsMethod: 'getWarehouses',
		},
		description: 'The warehouse to use for the return shipment. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Cargo Company Name or ID',
		name: 'cargoCompanyId',
		type: 'options',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['return'],
				operation: ['create'],
			},
		},
		typeOptions: {
			loadOptionsMethod: 'getCargoCompanies',
		},
		description: 'The cargo company to use for the return shipment. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Return Date',
		name: 'returnDate',
		type: 'dateTime',
		displayOptions: {
			show: {
				resource: ['return'],
				operation: ['create'],
			},
		},
		default: '',
		required: true,
		description: 'Date when the return was initiated',
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
	{
		displayName: 'Package Weight (Kg)',
		name: 'weight',
		type: 'number',
		typeOptions: {
			minValue: 0,
			numberPrecision: 2,
		},
		displayOptions: {
			show: {
				resource: ['return'],
				operation: ['create'],
			},
		},
		default: 1,
		description: 'Weight of the return package in kilograms',
	},
	{
		displayName: 'Package Count',
		name: 'packageCount',
		type: 'number',
		typeOptions: {
			minValue: 1,
		},
		displayOptions: {
			show: {
				resource: ['return'],
				operation: ['create'],
			},
		},
		default: 1,
		description: 'Number of return packages',
	},
	{
		displayName: 'Package Type',
		name: 'packageType',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['return'],
				operation: ['create'],
			},
		},
		options: [
			{
				name: 'Document',
				value: 'document',
				description: 'Document package type',
			},
			{
				name: 'Box',
				value: 'box',
				description: 'Box package type',
			},
		],
		default: 'document',
		required: true,
		description: 'Type of the return package',
	},
	{
		displayName: 'Payment Type',
		name: 'paymentType',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['return'],
				operation: ['create'],
			},
		},
		options: [
			{
				name: 'Cash',
				value: 'cash_money',
				description: 'Cash payment',
			},
			{
				name: 'Credit Card',
				value: 'credit_card',
				description: 'Credit card payment',
			},
		],
		default: 'cash_money',
		required: true,
		description: 'Payment method for the return shipment',
	},
	{
		displayName: 'Payor Type',
		name: 'payorType',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['return'],
				operation: ['create'],
			},
		},
		options: [
			{
				name: 'Sender',
				value: 'sender',
				description: 'Sender pays',
			},
			{
				name: 'Receiver',
				value: 'receiver',
				description: 'Receiver pays',
			},
		],
		default: 'sender',
		required: true,
		description: 'Who will pay for the return shipment',
	},
	{
		displayName: 'Platform ID',
		name: 'platformId',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['return'],
				operation: ['create'],
			},
		},
		default: 6484981,
		required: true,
		description: 'Order ID',
	},
	{
		displayName: 'Desi',
		name: 'desi',
		type: 'number',
		typeOptions: {
			minValue: 0,
			numberPrecision: 2,
		},
		displayOptions: {
			show: {
				resource: ['return'],
				operation: ['create'],
			},
		},
		default: 1,
		required: true,
		description: 'Return package desi value',
	},
	{
		displayName: 'KG',
		name: 'kg',
		type: 'number',
		typeOptions: {
			minValue: 0,
			numberPrecision: 2,
		},
		displayOptions: {
			show: {
				resource: ['return'],
				operation: ['create'],
			},
		},
		default: 1,
		required: true,
		description: 'Return package weight in kg',
	},
	{
		displayName: 'Currency',
		name: 'currency',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['return'],
				operation: ['create'],
			},
		},
		options: [
			{
				name: 'TRY',
				value: 'TRY',
				description: 'Turkish Lira',
			},
			{
				name: 'USD',
				value: 'USD',
				description: 'US Dollar',
			},
			{
				name: 'EUR',
				value: 'EUR',
				description: 'Euro',
			},
		],
		default: 'TRY',
		required: true,
		description: 'Currency type',
	},
	{
		displayName: 'Total',
		name: 'total',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['return'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Total amount (optional)',
	},
	{
		displayName: 'Is Pay at Door',
		name: 'isPayAtDoor',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['return'],
				operation: ['create'],
			},
		},
		default: false,
		description: 'Whether payment is at door',
	},
	{
		displayName: 'Note',
		name: 'note',
		type: 'string',
		typeOptions: {
			rows: 3,
		},
		displayOptions: {
			show: {
				resource: ['return'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Additional notes for the return shipment',
	},
	// Get operation fields
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
	// Get All operation fields
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: {
			minValue: 1,
		},
		displayOptions: {
			show: {
				resource: ['return'],
				operation: ['getAll'],
			},
		},
		default: 50,
		description: 'Max number of results to return',
	},
];