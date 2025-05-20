# Payfluence

A modern web application built with a React frontend and Node.js backend, using PostgreSQL for data storage.

## Project Setup

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js](https://nodejs.org/) (for running scripts outside Docker)
- [pnpm](https://pnpm.io/installation) (for package management)

## Environment Configuration

1. Copy the example environment file to create your local configuration:

```bash
cp .env.example .env
```

2. Edit the `.env` file with your specific configuration values:
   - Update ports if needed
   - Set database credentials
   - Configure JWT secret for authentication
   - Add Google OAuth credentials if using Google authentication

## Local Development Setup

To start the development environment:

```bash
# Run the development environment
./dev.sh
```

This script will:

- Check if your `.env` file exists
- Build and start all services defined in docker-compose files
- Mount your local directories to enable hot reloading

The development environment includes:

- Frontend client at http://localhost:3000 (or custom port in .env)
- Backend server at http://localhost:8001 (or custom port in .env)
- PostgreSQL database at localhost:5432

## Production Deployment

To deploy in production mode:

```bash
# Run the production environment
./prod.sh
```

The production setup:

- Uses production-optimized Dockerfiles
- Runs with restart policies for reliability
- Doesn't include development-specific overrides

## Project Structure

The application consists of:

- `client/`: Frontend React application
- `server/`: Backend Node.js API with TypeScript
  - Uses Prisma ORM for database access
  - Includes authentication via JWT and Google OAuth
- `docker-compose.yml`: Main Docker Compose configuration
- `docker-compose.override.yml`: Development-specific overrides
- `.env`: Environment configuration (created from .env.example)

## Database Information

The project uses PostgreSQL with Prisma ORM. To access the database:

- Connection URL format: `postgresql://postgres:postgres@localhost:5432/payfluence_dev`
- Credentials are configured in the `.env` file

## Troubleshooting

- If containers fail to start, check Docker logs: `docker compose logs`
- For database connection issues, ensure PostgreSQL is running: `docker compose ps`
- If the frontend can't connect to the backend, verify the `FRONTEND_URL` in `.env`
