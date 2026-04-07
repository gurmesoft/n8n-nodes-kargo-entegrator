import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class KargoEntegratorApi implements ICredentialType {
	name = 'kargoEntegratorApi';
	displayName = 'Kargo Entegratör API';
	documentationUrl = 'https://dev.kargoentegrator.com/authentication';
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
			description: 'Your Bearer API key from Kargo Entegratör. Get it from <a href="https://app.kargoentegrator.com">app.kargoentegrator.com</a> panel. See <a href="https://dev.kargoentegrator.com/authentication">authentication docs</a> for details.',
		},
	];

	// Base URL is defined as a constant
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
			url: '/helpers/check-connection',
			method: 'GET',
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
	};
}