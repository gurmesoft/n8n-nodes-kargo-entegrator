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
				description: 'Create a new return shipment. <a href="https://dev.kargoentegrator.com/api/returneds/olusturma">API Docs</a>.',
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
				description: 'List many return shipments linked to your account. <a href="https://dev.kargoentegrator.com/api/returneds/listeleme">API Docs</a>.',
				action: 'Get many return shipments',
			},
			{
				name: 'Print Return PDF',
				value: 'printReturnedPdf',
				description: 'Generate PDF label for a return shipment. <a href="https://dev.kargoentegrator.com/api/print-pdf">API Docs</a>.',
				action: 'Print return PDF',
			},
		],
		default: 'create',
		required: true,
	},
];

export const returnFields: INodeProperties[] = [
	// ── Create operation fields ──

	// Customer Information
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
		description: 'Customer / sender information for the return. Required when customer_id is not provided.',
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
						required: true,
						description: 'Full street address (max 255 characters)',
					},
					{
						displayName: 'City',
						name: 'city',
						type: 'string',
						default: '',
						required: true,
						description: 'Customer city / province (max 255 characters)',
					},
					{
						displayName: 'Country',
						name: 'country',
						type: 'string',
						default: 'TURKEY',
						required: true,
						description: 'Customer country (max 255 characters)',
					},
					{
						displayName: 'District',
						name: 'district',
						type: 'string',
						default: '',
						required: true,
						description: 'Customer district (max 255 characters)',
					},
					{
						displayName: 'Email',
						name: 'email',
						type: 'string',
						placeholder: 'name@email.com',
						default: '',
						required: true,
						description: 'Customer email address (valid format, max 255 characters)',
					},
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
						required: true,
						description: 'Customer first name (max 255 characters)',
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
						displayName: 'Postcode',
						name: 'postcode',
						type: 'string',
						default: '',
						description: 'Postal / ZIP code (max 255 characters)',
					},
					{
						displayName: 'Surname',
						name: 'surname',
						type: 'string',
						default: '',
						required: true,
						description: 'Customer last name (max 255 characters)',
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
		description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
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
		description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
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
		description: 'Date when the return was initiated (return_at field, date format)',
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
		description: 'Reason for the return',
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
				name: 'Box',
				value: 'box',
				description: 'Box package type',
			},
			{
				name: 'Document',
				value: 'document',
				description: 'Document / envelope package type',
			},
		],
		default: 'box',
		required: true,
		description: 'Type of the return package: "document" or "box"',
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
		description: 'Payment method: "cash_money" or "credit_card"',
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
				description: 'Sender pays for the return',
			},
			{
				name: 'Receiver',
				value: 'receiver',
				description: 'Receiver pays for the return',
			},
		],
		default: 'sender',
		required: true,
		description: 'Who pays for the return shipment: "sender" or "receiver"',
	},
	{
		displayName: 'Platform ID',
		name: 'platformId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['return'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Global order ID from the platform (e.g. Shopify global ID). Max 255 characters.',
	},
	{
		displayName: 'Desi (Volumetric Weight)',
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
		description: 'Volumetric weight (desi) of the return package',
	},
	{
		displayName: 'Weight (Kg)',
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
		description: 'Actual weight of the return package in kilograms',
	},
	{
		displayName: 'Pay at Door',
		name: 'isPayAtDoor',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['return'],
				operation: ['create'],
			},
		},
		default: false,
		description: 'Whether this is a cash-on-delivery return',
	},
	{
		displayName: 'Currency',
		name: 'currency',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['return'],
				operation: ['create'],
				isPayAtDoor: [true],
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
		description: 'Currency for pay-at-door amount',
	},
	{
		displayName: 'Total Amount',
		name: 'total',
		type: 'number',
		typeOptions: {
			numberPrecision: 2,
		},
		displayOptions: {
			show: {
				resource: ['return'],
				operation: ['create'],
				isPayAtDoor: [true],
			},
		},
		default: 0,
		description: 'Pay-at-door collection amount (max 2 decimal places)',
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

	// ── Get operation fields ──
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

	// ── Get All operation fields ──
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

	// ── Print Return PDF ──
	{
		displayName: 'Output Format',
		name: 'outputFormat',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['return'],
				operation: ['printReturnedPdf'],
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
