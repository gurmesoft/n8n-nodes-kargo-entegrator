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
				description: 'Create a new shipment. <a href="https://dev.kargoentegrator.com/api/shipments/olusturma">API Docs</a>.',
				action: 'Create a shipment',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get shipment details by ID',
				action: 'Get a shipment',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many shipments with pagination',
				action: 'Get many shipments',
			},
			{
				name: 'Print PDF',
				value: 'printPdf',
				description: 'Download label/barcode PDF for one or more shipments. <a href="https://dev.kargoentegrator.com/api/print-pdf">API Docs</a>.',
				action: 'Print shipment PDF',
			},
		],
		default: 'create',
		required: true,
	},
];

export const shipmentFields: INodeProperties[] = [
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
				resource: ['shipment'],
				operation: ['create'],
			},
		},
		default: {},
		required: true,
		description: 'Recipient customer information. If customer_id is not provided, this object is required.',
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
						description: 'Recipient city / province (max 255 characters)',
					},
					{
						displayName: 'Country',
						name: 'country',
						type: 'string',
						default: 'TURKEY',
						required: true,
						description: 'Recipient country (max 255 characters)',
					},
					{
						displayName: 'District',
						name: 'district',
						type: 'string',
						default: '',
						required: true,
						description: 'Recipient district (max 255 characters)',
					},
					{
						displayName: 'Email',
						name: 'email',
						type: 'string',
						placeholder: 'name@email.com',
						default: '',
						description: 'Recipient email address (valid format, max 255 characters)',
					},
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
						required: true,
						description: 'Recipient first name (max 255 characters)',
					},
					{
						displayName: 'Phone',
						name: 'phone',
						type: 'string',
						default: '',
						required: true,
						description: 'Recipient phone number',
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
						description: 'Recipient last name (max 255 characters)',
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
				resource: ['shipment'],
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
				resource: ['shipment'],
				operation: ['create'],
			},
		},
		typeOptions: {
			loadOptionsMethod: 'getCargoCompanies',
		},
		description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
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
		description: 'Type of the package: "document" or "box"',
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
		description: 'Payment method: "cash_money" or "credit_card"',
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
				description: 'Sender pays for the shipment',
			},
			{
				name: 'Receiver',
				value: 'receiver',
				description: 'Receiver pays for the shipment',
			},
		],
		default: 'sender',
		required: true,
		description: 'Who pays for the shipment: "sender" or "receiver"',
	},
	{
		displayName: 'Platform ID',
		name: 'platformId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['shipment'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Global order ID from the platform (e.g. Shopify global ID, WooCommerce order ID). Max 255 characters.',
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
				resource: ['shipment'],
				operation: ['create'],
			},
		},
		default: 1,
		description: 'Volumetric weight (desi) of the package',
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
				resource: ['shipment'],
				operation: ['create'],
			},
		},
		default: 1,
		description: 'Actual weight of the package in kilograms',
	},
	{
		displayName: 'Pay at Door',
		name: 'isPayAtDoor',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['shipment'],
				operation: ['create'],
			},
		},
		default: false,
		description: 'Whether this is a cash-on-delivery (pay at door) shipment. When true, currency and total fields become required.',
	},
	{
		displayName: 'Currency',
		name: 'currency',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['shipment'],
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
		description: 'Currency for pay-at-door amount. Required when Pay at Door is enabled.',
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
				resource: ['shipment'],
				operation: ['create'],
				isPayAtDoor: [true],
			},
		},
		default: 0,
		description: 'Pay-at-door collection amount (max 2 decimal places). Required when Pay at Door is enabled.',
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

	// ── Optional Settings (Options collection) ──
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['shipment'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Barcode',
				name: 'barcode',
				type: 'string',
				default: '',
				description: 'Barcode value (max 255 characters)',
			},
			{
				displayName: 'Custom Barcode',
				name: 'createBarcode',
				type: 'string',
				default: '',
				placeholder: 'e.g. 1234567890',
				description: 'Assign a custom barcode / tracking number to the shipment. If left empty, the cargo company generates one automatically.',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Additional description for the shipment',
			},
			{
				displayName: 'Invoice Number',
				name: 'invoiceNumber',
				type: 'string',
				default: '',
				description: 'Invoice number (max 255 characters)',
			},
			{
				displayName: 'Notification URL (Webhook)',
				name: 'notificationUrl',
				type: 'string',
				default: '',
				placeholder: 'https://your-n8n-instance.com/webhook/xxx',
				description: 'Webhook URL for shipment status updates (picked up, in transit, delivered, etc.). You can paste the Kargo Entegratör Trigger node webhook URL here.',
			},
			{
				displayName: 'Package Count',
				name: 'packageCount',
				type: 'number',
				typeOptions: {
					minValue: 1,
				},
				default: 1,
				description: 'Number of packages/parcels for cumulative shipments. Used when combining multiple orders under a single barcode.',
			},
			{
				displayName: 'Platform Display ID',
				name: 'platformDId',
				type: 'string',
				default: '',
				description: 'Store-specific order number (e.g. Shopify store order number). Max 255 characters.',
			},
			{
				displayName: 'Waybill Number',
				name: 'waybillNumber',
				type: 'string',
				default: '',
				description: 'Waybill / dispatch number (max 255 characters)',
			},
		],
	},

	// ── Get operation fields ──
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
				resource: ['shipment'],
				operation: ['getAll'],
			},
		},
		default: 50,
		description: 'Max number of results to return',
	},

	// ── Print PDF operation fields ──
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
		description: 'Comma-separated list of shipment IDs to generate PDF for (e.g. "35,34"). Multiple IDs are sent as shipments[0], shipments[1], etc. <a href="https://dev.kargoentegrator.com/api/print-pdf">API Docs</a>.',
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
