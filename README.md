# n8n-nodes-kargo-entegrator

This is an n8n community node. It lets you use Kargo Entegratör API in your n8n workflows.

Kargo Entegratör is a Turkish cargo integration platform that allows you to manage shipments across multiple cargo companies from a single interface.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

## Table of Contents

- [Quick Start](#quick-start)
- [Development Setup](#development-setup)
- [Docker Environment](#docker-environment)
- [Installation](#installation)
- [Operations](#operations)
- [Credentials](#credentials)
- [Scripts](#scripts)
- [Compatibility](#compatibility)
- [Usage](#usage)
- [Resources](#resources)
- [Version History](#version-history)
- [License](#license)

## Quick Start

### Prerequisites
- Node.js >= 20.15
- npm or yarn
- Docker (optional, for containerized development)

### Local Development

1. **Clone and Install**
   ```bash
   git clone https://github.com/gurmesoft/n8n-nodes-kargo-entegrator.git
   cd n8n-nodes-kargo-entegrator
   npm install
   ```

2. **Build the Project**
   ```bash
   npm run build
   ```

3. **Start Development**
   ```bash
   npm run dev
   ```

### Docker Development (Recommended)

1. **Quick Start with Docker**
   ```bash
   # Build and start development environment
   npm run dev:docker
   
   # Access N8N at http://localhost:5678
   # Username: admin
   # Password: admin123
   ```

2. **View Logs**
   ```bash
   npm run dev:docker:logs
   ```

3. **Stop Environment**
   ```bash
   npm run dev:docker:stop
   ```

## Development Setup

### Environment Requirements
- **Node.js**: >= 20.15
- **TypeScript**: ^5.8.2
- **n8n-workflow**: Latest (peer dependency)

### Project Structure
```
n8n-nodes-kargo-entegrator/
├── credentials/           # API credentials configuration
├── nodes/                # Node implementations
│   └── KargoEntegrator/
│       ├── *.node.ts     # Node logic
│       ├── actions/      # Node actions
│       └── resources/    # Node resources
├── dist/                 # Built files (generated)
├── docker-compose*.yml   # Docker configurations
└── package.json          # Project configuration
```

### Development Workflow

1. **Make Changes**: Edit TypeScript files in `nodes/` or `credentials/`
2. **Build**: Run `npm run build` to compile TypeScript
3. **Test**: Use Docker environment or local N8N instance
4. **Format**: Run `npm run format` to format code
5. **Lint**: Run `npm run lint` to check code quality

## Docker Environment

Three Docker configurations are available:

### 1. Development Environment (Recommended)
```bash
npm run dev:docker
# or
docker-compose -f docker-compose.dev.yml up -d
```
- **Services**: N8N + PostgreSQL + Node development container
- **Features**: Hot reload, debugging, persistent data
- **Access**: http://localhost:5678

### 2. Simple Environment
```bash
docker-compose -f docker-compose.simple.yml up -d
```
- **Services**: N8N only (SQLite database)
- **Use Case**: Quick testing
- **Access**: http://localhost:5678

### 3. Production Environment
```bash
docker-compose up -d
```
- **Services**: N8N + PostgreSQL
- **Use Case**: Production deployment
- **Access**: http://localhost:5678

### Docker Commands
```bash
# Start development environment
npm run dev:docker

# View logs
npm run dev:docker:logs

# Restart services
npm run dev:docker:restart

# Stop environment
npm run dev:docker:stop

# Build and restart with live reload
npm run dev:live
```

### Access Information
- **N8N Web Interface**: http://localhost:5678
- **Username**: admin
- **Password**: admin123
- **PostgreSQL**: localhost:5432 (production) / localhost:5433 (development)
  - User: n8n
  - Password: n8n123
  - Database: n8n

## Scripts

| Script | Description |
|--------|-------------|
| `npm run build` | Build TypeScript and copy icons |
| `npm run dev` | Watch TypeScript files for changes |
| `npm run dev:live` | Development with auto-restart |
| `npm run dev:docker` | Start Docker development environment |
| `npm run dev:docker:logs` | View Docker logs |
| `npm run dev:docker:stop` | Stop Docker environment |
| `npm run dev:docker:restart` | Restart Docker services |
| `npm run format` | Format code with Prettier |
| `npm run lint` | Lint code with ESLint |
| `npm run lintfix` | Fix linting issues automatically |  

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

### Community Nodes (Recommended)

1. Go to **Settings > Community Nodes**
2. Select **Install**
3. Enter `n8n-nodes-kargo-entegrator`
4. Agree to the risks of using community nodes
5. Select **Install**

### Manual Installation

```bash
npm install n8n-nodes-kargo-entegrator
```

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

## Version History

### 0.1.0
- Initial release
- Support for shipment creation, retrieval, and PDF generation
- Support for return shipment management
- Cargo company and warehouse information retrieval
- Webhook trigger for shipment status changes
- System settings access

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For support, please contact [destek@kargoentegrator.com](mailto:destek@kargoentegrator.com) or visit our [website](https://kargoentegrator.com/).

## License

[MIT](https://github.com/gurmesoft/n8n-nodes-kargo-entegrator/blob/main/LICENSE.md)
