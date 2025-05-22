# Payfluencer

## Pre-requisites

- NodeJs (v20) LTS
- tsx (installed globally)
- pnpm@latest (package manager)
- PostgreSQL database

## Installation

### Install tsx (typescript executable)

```bash
npm install -g tsx
```

### Clone the repository

```bash
git clone git@github.com:
```

### Install dependencies

```bash
pnpm install
```

### Database Setup and Management

1. Set up your database connection by creating a `.env` file with your database URL:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/your_database_name"
```

2. Generate Prisma Client (required after schema changes):

```bash
pnpm run prisma:generate
```

3. Apply existing migrations to your database \*(REQUIRED) on a new db:

```bash
pnpm run prisma:migrate:prod
```

4. When you make changes to the schema (development):

```bash
pnpm run prisma:migrate:dev
```

5. To view and manage your data through Prisma Studio:

```bash
pnpm run prisma:studio
```

### Start the server

```bash
pnpm run dev
```

## API Documentation

The API documentation is available through a web UI at:

```
http://localhost:8001/api/v1/docs
```

This interactive documentation allows you to:

- Browse all available endpoints
- Test API endpoints directly from the browser
- View request/response schemas
- Try out different parameters

## Project Structure

```
server/
├── app.ts                 # Main application entry point
├── controllers/           # Route controllers
├── middleware/           # Express middleware
├── prisma/
│   ├── migrations/       # Database migrations
│   ├── schema.prisma     # Database schema
│   └── seed.ts          # Database seeding
├── router/              # API routes
├── types/               # TypeScript type definitions
├── lib/                 # Utility functions and shared code
├── docs/               # API documentation
└── database/           # Database related files
```

### Key Directories:

- `controllers/`: Contains the business logic for each route
- `middleware/`: Custom middleware functions (auth, validation, etc.)
- `prisma/`: Database schema, migrations, and seeding
- `router/`: API route definitions
- `types/`: TypeScript interfaces and type definitions
- `lib/`: Shared utilities and helper functions
- `docs/`: API documentation files
- `database/`: Database configurations and utilities

## Available Scripts

- `pnpm run dev`: Start development server with hot reload
- `pnpm run build`: Build the project
- `pnpm run start`: Start production server
- `pnpm run prisma:generate`: Generate Prisma client
- `pnpm run prisma:migrate:dev`: Create new migrations
- `pnpm run prisma:migrate:prod`: Apply migrations
- `pnpm run prisma:studio`: Open Prisma Studio
