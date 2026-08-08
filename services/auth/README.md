# Auth Service

The auth service is the authentication and user-account service for the Payment API microservices project. It exposes an Express/TypeScript HTTP API, stores users and token state in MySQL through Prisma, and publishes account-related events through RabbitMQ.

## Responsibilities

- Register users and keep new accounts inactive until verification.
- Verify registration and password-reset codes.
- Authenticate users with email and password.
- Issue short-lived access tokens and long-lived refresh tokens.
- Validate and refresh JWTs, while rejecting blacklisted tokens.
- Log users out by blacklisting their access and refresh tokens.
- Return safe user profile details by user ID.
- Publish verification and password-reset events for the notifications service.

## Technology

- Node.js, TypeScript, and Express
- MySQL with Prisma ORM
- JWT access and refresh tokens
- `bcryptjs` for password hashing
- RabbitMQ for asynchronous auth notifications
- Zod for request validation

## Project layout

```text
src/
|-- controllers/   HTTP request handlers
|-- middleware/    Request validation
|-- routes/        API route definitions
|-- schema/        Zod request schemas and TypeScript types
|-- services/      Authentication and token business logic
`-- utils/         Prisma, JWT, crypto, logging, and RabbitMQ helpers
prisma/
`-- schema.prisma  MySQL data model and migrations
```

## API

The service listens on `PORT` (default `5001`). All routes are prefixed with `/api`.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/api/auth/register` | Create an inactive user and publish a verification event |
| POST | `/api/auth/verify` | Activate a user with a verification code |
| POST | `/api/auth/login` | Authenticate a user and return access/refresh tokens |
| POST | `/api/auth/logout` | Blacklist the supplied access and refresh tokens |
| POST | `/api/auth/forgot-password` | Create a password-reset code and publish an event |
| POST | `/api/auth/reset-password` | Set a new password using a reset code |
| POST | `/api/token/validate` | Validate a JWT and return its decoded payload |
| POST | `/api/token/refresh` | Issue new tokens using a refresh token and user ID |
| GET | `/api/accounts/:userId` | Return public details for a user |

### Example request bodies

Register:

```json
{
  "firstName": "Jane",
  "lastName": "Doe",
  "emailAddress": "jane@example.com",
  "phoneNumber": "254700000000",
  "password": "strong-password",
  "rePassword": "strong-password"
}
```

Verify:

```json
{
  "userId": "user-uuid",
  "verificationCode": 123456
}
```

Login:

```json
{
  "emailAddress": "jane@example.com",
  "password": "strong-password"
}
```

Token validation requires `type` to be either `access` or `refresh`:

```json
{
  "token": "jwt-token",
  "type": "access"
}
```

## Configuration

Create a `.env` file from `.env.example`:

```dotenv
PORT=5001
NODE_ENV=development
DATABASE_URL="mysql://username:password@localhost:3306/payments_api_auth"
ACCESS_TOKEN_SECRET=replace-with-an-access-secret
REFRESH_TOKEN_SECRET=replace-with-a-refresh-secret
REFRESH_TOKEN_ENCRYPTION_KEY=replace-with-an-encryption-key
IV_LENGTH=16
RABBITMQ_URL=amqp://localhost:5672
```

Use strong, unique secrets outside local development. The refresh token is valid for one day and the access token is valid for one hour. Refresh tokens are encrypted before being stored in MySQL.

## Local development

Requirements: Node.js, MySQL, and RabbitMQ.

From this directory:

```bash
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

The API will be available at `http://localhost:5001` unless `PORT` is changed. Prisma migrations are stored in `prisma/migrations`.

## RabbitMQ events

Events are published to the `payment_api` topic exchange:

- `auth.verification` after registration
- `auth.forgotPassword` after a password-reset request

The event payload includes the user ID, email address, first name, and verification code. A notification service can bind queues to these routing keys to send email or SMS messages.

## Data model

The service manages users, one active refresh token per user, one verification code per user, and blacklisted access/refresh tokens. User passwords are hashed and are never returned by the account lookup endpoint or login response.

## Notes

- Login is allowed only after the account has been verified.
- Request bodies are validated with Zod and invalid input returns HTTP `400`.
- The current `package.json` defines the development command but does not define a `build` script. The production branch in the Dockerfile expects `npm run build` and `dist/index.js`; add and verify that build script before using the production Docker path.
