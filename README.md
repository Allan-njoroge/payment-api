📦 payment-api
 ├── 📂 services
 │   ├── 📂 auth
 │   │   ├── 📂 controllers         # Business logic (login, register, JWT)
 │   │   ├── 📂 models              # User & session schemas (Prisma models)
 │   │   ├── 📂 routes              # API routes (e.g., /register, /login)
 │   │   ├── 📂 middleware          # Auth middlewares (JWT verification, rate limits)
 │   │   ├── 📂 utils               # Helper functions (hashing, validation)
 │   │   ├── 📂 prisma              # Prisma ORM setup
 │   │   │   ├── schema.prisma      # Prisma schema file
 │   │   │   ├── client.ts          # Prisma client instance
 │   │   ├── server.ts              # Express server setup
 │   │   ├── package.json           # Dependencies for this service
 │   │   ├── tsconfig.json          # TypeScript config
 │   │   ├── .env                   # Environment variables
 │
 │   ├── 📂 accounts               # Manages user accounts (creation, updates)
 │   │   ├── 📂 controllers
 │   │   ├── 📂 models
 │   │   ├── 📂 routes
 │   │   ├── 📂 prisma
 │   │   │   ├── schema.prisma
 │   │   │   ├── client.ts
 │   │   ├── server.ts
 │
 │   ├── 📂 transactions           # Handles payments (send, receive, request money)
 │   │   ├── 📂 controllers
 │   │   ├── 📂 models
 │   │   ├── 📂 routes
 │   │   ├── 📂 prisma
 │   │   │   ├── schema.prisma
 │   │   │   ├── client.ts
 │   │   ├── server.ts
 │
 │   ├── 📂 notifications           # Sends email & SMS alerts
 │   │   ├── 📂 controllers
 │   │   ├── 📂 templates           # Email/SMS templates
 │   │   ├── server.ts
 │
 │   ├── 📂 gateway-service         # API Gateway to manage requests between services
 │   │   ├── 📂 routes
 │   │   ├── server.ts
 │
 ├── 📂 config                      # Centralized configurations (database, API keys)
 │   ├── db.ts                       # Prisma database connection config
 │   ├── env.ts                      # Loads environment variables
 │   ├── logger.ts                    # Logging configuration (Winston, Morgan)
 │   ├── mail.ts                      # Email service config (Nodemailer)
 │   ├── sms.ts                       # SMS provider config
 │
 ├── 📂 logs                        # Logs for debugging & tracking transactions
 ├── 📂 docs                        # API documentation (Swagger/Postman)
 ├── docker-compose.yml             # Docker setup for running services
 ├── package.json                   # Main package.json for dependencies
 ├── tsconfig.json                   # TypeScript configuration
 ├── prisma                          # Main Prisma config for global models
 │   ├── schema.prisma
 │   ├── client.ts
 ├── README.md                      # Project overview
