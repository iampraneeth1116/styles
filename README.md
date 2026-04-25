# Styles

Styles is a full-stack fashion commerce application built with a Next.js storefront, an Express API, PostgreSQL, and Prisma. The repository also includes automated tests, GitHub Actions workflows, deployment scripts for EC2, and a standalone AWS ECS canary deployment demo.

## Features

- Modern storefront built with Next.js, React, TypeScript, and Tailwind CSS
- Product catalogue with category, price, and detail views
- Shopping cart, checkout, orders, wishlist, authentication, and profile pages
- REST API for products, categories, orders, authentication, and wishlist management
- PostgreSQL data model managed through Prisma
- JWT-based authentication with password hashing
- Unit, integration, and end-to-end test coverage
- EC2 deployment workflow with PM2 process management
- Dockerized AWS ECS canary deployment demo with weighted traffic splitting

## Tech Stack

| Area | Technologies |
| --- | --- |
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS, Lucide React |
| Backend | Node.js, Express 5, Prisma 7, PostgreSQL, JWT, bcrypt |
| Testing | Jest, Testing Library, Supertest, Playwright |
| DevOps | GitHub Actions, PM2, Docker, Docker Compose, AWS EC2, AWS ECS |

## Repository Structure

```text
.
├── .github/workflows/              # CI, PR checks, Playwright, and deployment workflows
├── styles/
│   ├── client/                     # Next.js storefront
│   ├── server/                     # Express API and Prisma schema
│   ├── scripts/                    # Local setup and EC2 deployment scripts
│   └── aws-ecs-canary-deployment/  # Standalone ECS canary deployment demo
└── README.md
```

## Prerequisites

- Node.js 20 or later
- npm
- PostgreSQL
- Docker and Docker Compose, only for the ECS canary demo
- AWS CLI, only for AWS deployment workflows

## Getting Started

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd devops/styles
chmod +x scripts/setup.sh
./scripts/setup.sh
```

Create environment files from the examples:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env.local
```

Update `server/.env` with your PostgreSQL connection string and JWT secret:

```env
PORT=4000
DATABASE_URL="postgresql://user:password@localhost:5432/styles"
JWT_SECRET="replace-with-a-secure-secret"
CLIENT_URL="http://localhost:3000"
```

Update `client/.env.local` if your API URL is different:

```env
NEXT_PUBLIC_API_URL="http://localhost:4000/api"
```

Initialize the database and seed sample catalogue data:

```bash
cd server
npm run db:push
npm run db:seed
```

Start the API:

```bash
npm run dev
```

In a second terminal, start the storefront:

```bash
cd ../client
npm run dev
```

Open `http://localhost:3000` to use the application. The API runs on `http://localhost:4000` by default.

## Common Commands

### Frontend

```bash
cd styles/client
npm run dev      # Start the Next.js development server
npm run build    # Create a production build
npm run start    # Start the production server
npm run lint     # Run ESLint
npm run test     # Run Jest component tests
npm run e2e      # Run Playwright tests
```

### Backend

```bash
cd styles/server
npm run dev        # Start the Express API with nodemon
npm run start      # Start the Express API
npm run lint       # Run ESLint
npm run test       # Run Jest unit and integration tests
npm run db:push    # Push Prisma schema changes to the database
npm run db:seed    # Seed sample data
npm run db:studio  # Open Prisma Studio
```

## API Overview

The backend exposes REST endpoints under `/api`:

| Resource | Base Path | Description |
| --- | --- | --- |
| Health | `/api/health` | API health and uptime check |
| Authentication | `/api/auth` | Register, login, profile lookup, and profile update |
| Products | `/api/products` | Product listing, filtering, detail, create, update, and delete |
| Categories | `/api/categories` | Category listing and category detail |
| Orders | `/api/orders` | Order creation and order lookup |
| Wishlist | `/api/wishlist` | Authenticated wishlist retrieval, add, and remove |

Authenticated requests use a bearer token:

```http
Authorization: Bearer <token>
```

## Testing

Run backend tests:

```bash
cd styles/server
npm test
```

Run frontend unit tests:

```bash
cd styles/client
npm test
```

Run end-to-end tests:

```bash
cd styles/client
npm run e2e
```

## Deployment

### EC2 Deployment

The repository includes `styles/scripts/deploy.sh`, an idempotent EC2 deployment script that:

- Installs backend dependencies
- Generates the Prisma client
- Applies database schema changes
- Builds the frontend
- Starts or restarts the API and client with PM2

Run it from `styles/` on the target host:

```bash
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

The GitHub Actions deployment workflow uses the following repository secrets:

| Secret | Purpose |
| --- | --- |
| `EC2_HOST` | Public hostname or IP address of the EC2 instance |
| `EC2_USERNAME` | SSH user, defaults to `ubuntu` in the workflow |
| `EC2_SSH_KEY` | Private SSH key for the EC2 instance |
| `styles_DEPLOY_PATH` | Optional remote deployment path |
| `SERVER_ENV` | Full contents of the backend `.env` file |

### ECS Canary Deployment Demo

The `styles/aws-ecs-canary-deployment` directory contains a separate demo for visualizing stable and canary traffic distribution.

Run it locally:

```bash
cd styles/aws-ecs-canary-deployment
BUILD_TIME=$(date -u +%Y-%m-%dT%H:%M:%SZ) docker compose up --build
```

Open `http://localhost:8080` to view the dashboard. See `styles/aws-ecs-canary-deployment/README.md` for AWS ECS task definitions and weighted ALB rollout commands.

## CI/CD

GitHub Actions workflows are configured for:

- Backend and frontend linting
- Backend and frontend test execution
- Playwright end-to-end checks
- Pull request validation
- Manual backend deployment to EC2

## Security Notes

- Do not commit real `.env` files or private keys.
- Replace the example JWT secret before deploying.
- Use a managed PostgreSQL database with network restrictions in production.
- Store deployment credentials in GitHub Actions secrets.

## License

This project is currently licensed under ISC, as declared in the package metadata.
