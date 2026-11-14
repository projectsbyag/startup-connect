# Startup Connect

Startup Connect is a platform for connecting startups, investors, and users through a REST API and web frontend. The backend is built with Node.js, Express, and MongoDB, with JWT-based authentication and separate resources for startups, investors, users, messages, and connections.

## Features

- User authentication and account management
- Startup and investor profiles
- Startup–investor connections
- Messaging between users
- MongoDB persistence through Mongoose
- JWT authentication
- Request logging and response compression
- Health-check endpoint for deployment monitoring

## Tech Stack

- **Backend:** Node.js, Express
- **Database:** MongoDB with Mongoose
- **Authentication:** JSON Web Tokens and bcryptjs
- **Validation:** validator
- **Frontend:** JavaScript application in [`frontend/`](frontend/)
- **Deployment:** Configured for Vercel

## Getting Started

### Prerequisites

- Node.js 22.x
- npm
- A MongoDB database

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/projectsbyag/startup-connect.git
   cd startup-connect
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a local environment file:

   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your MongoDB connection string and JWT secret.

5. Start the development server:

   ```bash
   npm run dev
   ```

The API runs on `http://localhost:5000` by default.

## Environment Variables

| Variable | Description | Example |
| --- | --- | --- |
| `DATABASE_URI` | MongoDB connection string | `your_mongodb_uri_here` |
| `MONGODB_URI` | Alternative MongoDB connection string | `your_mongodb_uri_here` |
| `JWT_SECRET` | Secret used to sign JWTs | `jwt_secret_here` |
| `JWT_EXPIRE` | JWT expiration period | `30d` |
| `NODE_ENV` | Runtime environment | `development` |
| `PORT` | API server port | `5000` |
| `SENDGRID_API_KEY` | Optional SendGrid API key | — |
| `EMAIL_FROM` | Optional sender email address | `noreply@startupconnect.com` |

## Available Scripts

| Command | Description |
| --- | --- |
| `npm start` | Start the production server |
| `npm run dev` | Start the server with Nodemon |
| `npm run seed` | Seed the database using `seeder.js` |
| `npm run build` | Run the project build command |

## API Endpoints

The API is served under the `/api` prefix:

- `/api/health` — Service health check
- `/api/users` — User registration, authentication, and profiles
- `/api/startups` — Startup resources
- `/api/investors` — Investor resources
- `/api/messages` — User messaging
- `/api/connections` — Startup and investor connections

## Project Structure

```text
.
├── config/          # Database configuration
├── controllers/     # Request handlers
├── frontend/        # Frontend application
├── middleware/      # Authentication and error handling middleware
├── models/          # Mongoose models
├── routes/          # Express API routes
├── seeder.js        # Database seeding script
├── server.js        # Application entry point
└── vercel.json      # Vercel deployment configuration
```

## Health Check

Once the server is running, verify it with:

```bash
curl http://localhost:5000/api/health
```

A healthy service returns a JSON response containing:

```json
{
  "success": true,
  "status": "ok"
}
```

## Deployment

The project includes Vercel configuration. Set the required environment variables in the deployment platform before deploying, especially the MongoDB connection string and JWT secret.

## License

No license has been specified for this repository yet.
```
