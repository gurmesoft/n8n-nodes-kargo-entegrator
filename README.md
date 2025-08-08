# n8n-nodes-kargo-entegrator

This is an n8n community node. It lets you use Kargo Entegratör API in your n8n workflows.

Kargo Entegratör is a Turkish cargo integration platform that allows you to manage shipments across multiple cargo companies from a single interface.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  
[Compatibility](#compatibility)  
[Usage](#usage)  
[Resources](#resources)  

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

### Shipment
- **Create**: Create a new shipment
- **Get**: Retrieve shipment details
- **Create Return**: Create a return shipment

### Customer
- **Update**: Update customer information

### Cargo
- **Get All**: Get all available cargo companies
- **Get**: Get specific cargo company details

## Credentials

To use this node, you need:

1. Sign up for an account at [https://app.kargoentegrator.com](https://app.kargoentegrator.com)
2. Get your API key from the dashboard
3. Configure the credentials in n8n:
   - **API Key**: Your Kargo Entegratör API key
   - **Base URL**: https://app.kargoentegrator.com/api (default)

## Compatibility

Tested against n8n version 1.0+.

## Usage

### Creating a Shipment

1. Select "Shipment" as the resource
2. Choose "Create" as the operation
3. Fill in the required fields:
   - Receiver name, phone, and address
   - City and district
   - Cargo company ID
   - Package details (weight, count, description)

### Managing Returns

Use the "Create Return" operation to create return shipments with the same interface as regular shipments.

### Getting Cargo Companies

Use the "Cargo" resource to get information about available cargo companies and their IDs for use in shipment creation.

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
* [Kargo Entegratör API Documentation](https://documenter.getpostman.com/view/25047990/2sAY4vg2RR)
* [Kargo Entegratör Website](https://kargoentegrator.com/)

## License

[MIT](https://github.com/n8n-io/n8n-nodes-starter/blob/master/LICENSE.md)
