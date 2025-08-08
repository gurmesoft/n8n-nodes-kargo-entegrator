import { INodeProperties } from 'n8n-workflow';

export const shipmentOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['shipment'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new shipment',
				action: 'Create a shipment',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get shipment details',
				action: 'Get a shipment',
			},
			{
				name: 'Get All',
				value: 'getAll',
				description: 'Get all shipments with pagination',
				action: 'Get all shipments',
			},
			{
				name: 'Print Shipment PDF',
				value: 'printPdf',
				description: 'Generate PDF document for shipments',
				action: 'Print shipment PDF',
			},
		],
		default: 'create',
		required: true,
	},
];

export const shipmentFields: INodeProperties[] = [
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
				resource: ['shipment'],
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
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
						required: true,
						description: 'Customer first name',
					},
					{
						displayName: 'Surname',
						name: 'surname',
						type: 'string',
						default: '',
						required: true,
						description: 'Customer surname',
					},
					{
						displayName: 'Phone',
						name: 'phone',
						type: 'string',
						default: '',
						required: true,
						description: 'Customer phone number',
					},
					{
						displayName: 'Email',
						name: 'email',
						type: 'string',
						default: '',
						required: true,
						description: 'Customer email address',
					},
					{
						displayName: 'Country',
						name: 'country',
						type: 'string',
						default: 'TURKEY',
						required: true,
						description: 'Customer country',
					},
					{
						displayName: 'Postcode',
						name: 'postcode',
						type: 'string',
						default: '',
						required: true,
						description: 'Customer postal code',
					},
					{
						displayName: 'City',
						name: 'city',
						type: 'string',
						default: '',
						required: true,
						description: 'Customer city',
					},
					{
						displayName: 'District',
						name: 'district',
						type: 'string',
						default: '',
						required: true,
						description: 'Customer district',
					},
					{
						displayName: 'Address',
						name: 'address',
						type: 'string',
						typeOptions: {
							rows: 3,
						},
						default: '',
						required: true,
						description: 'Customer full address',
					},
				],
			},
		],
	},
	{
		displayName: 'Warehouse',
		name: 'warehouseId',
		type: 'options',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['shipment'],
				operation: ['create'],
			},
		},
		typeOptions: {
			loadOptionsMethod: 'getWarehouses',
		},
		description: 'The warehouse to use for the shipment',
	},
	{
		displayName: 'Cargo Company',
		name: 'cargoCompanyId',
		type: 'options',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['shipment'],
				operation: ['create'],
			},
		},
		typeOptions: {
			loadOptionsMethod: 'getCargoCompanies',
		},
		description: 'The cargo company to use for the shipment',
	},
	{
		displayName: 'Package Weight (kg)',
		name: 'weight',
		type: 'number',
		typeOptions: {
			minValue: 0,
			numberPrecision: 2,
		},
		displayOptions: {
			show: {
				resource: ['shipment'],
				operation: ['create'],
			},
		},
		default: 1,
		description: 'Weight of the package in kilograms',
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
				resource: ['shipment'],
				operation: ['create'],
			},
		},
		default: 1,
		description: 'Number of packages',
	},
	{
		displayName: 'Package Type',
		name: 'packageType',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['shipment'],
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
		description: 'Type of the package',
	},
	{
		displayName: 'Payment Type',
		name: 'paymentType',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['shipment'],
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
		description: 'Payment method for the shipment',
	},
	{
		displayName: 'Payor Type',
		name: 'payorType',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['shipment'],
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
		description: 'Who will pay for the shipment',
	},


	// Additional fields
	{
		displayName: 'Platform ID',
		name: 'platformId',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['shipment'],
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
				resource: ['shipment'],
				operation: ['create'],
			},
		},
		default: 1,
		required: true,
		description: 'Package desi value',
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
				resource: ['shipment'],
				operation: ['create'],
			},
		},
		default: 1,
		required: true,
		description: 'Package weight in kg',
	},
	{
		displayName: 'Currency',
		name: 'currency',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['shipment'],
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
				resource: ['shipment'],
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
				resource: ['shipment'],
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
				resource: ['shipment'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Additional notes for the shipment',
	},

	// Get operation fields
	{
		displayName: 'Shipment ID',
		name: 'shipmentId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['shipment'],
				operation: ['get'],
			},
		},
		default: '',
		required: true,
		description: 'ID of the shipment to retrieve',
	},
	// Get All operation fields
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: {
			minValue: 1,
			maxValue: 100,
		},
		displayOptions: {
			show: {
				resource: ['shipment'],
				operation: ['getAll'],
			},
		},
		default: 10,
		description: 'Number of shipments to retrieve (max 100)',
	},
	// Print PDF operation fields
	{
		displayName: 'Shipment IDs',
		name: 'shipmentIds',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['shipment'],
				operation: ['printPdf'],
			},
		},
		default: '',
		required: true,
		description: 'Comma-separated list of shipment IDs to generate PDF for (e.g., 35,34)',
	},
	{
		displayName: 'Output Format',
		name: 'outputFormat',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['shipment'],
				operation: ['printPdf'],
			},
		},
		options: [
			{
				name: 'Binary Data (for Write to Disk)',
				value: 'binary',
				description: 'Return PDF as binary data suitable for Write to Disk node',
			},
			{
				name: 'Base64 String',
				value: 'base64',
				description: 'Return PDF as base64 encoded string in JSON format',
			},
		],
		default: 'binary',
		required: true,
		description: 'Choose how to return the PDF data',
	},
];