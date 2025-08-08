import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class KargoEntegratorApi implements ICredentialType {
	name = 'kargoEntegratorApi';
	displayName = 'Kargo Entegratör API';
	documentationUrl = 'https://documenter.getpostman.com/view/25047990/2sAY4vg2RR';
	baseUrl = 'https://app.kargoentegrator.com/api';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'API key from Kargo Entegratör. Get it from https://app.kargoentegrator.com',
		},
	];

	// Base URL sabit olarak tanımlandı
	getBaseUrl(): string {
		return 'https://app.kargoentegrator.com/api';
	}

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://app.kargoentegrator.com/api',
			url: '/integration/cargos',
			method: 'GET',
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},

	};
}