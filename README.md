# Forum Backend API

![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-RDS-4169E1?logo=postgresql&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-Elastic%20Beanstalk-FF9900?logo=amazonaws&logoColor=white)

A production-ready REST API for a forum application built with Node.js, TypeScript, and Express, backed by a PostgreSQL database managed with Prisma ORM. The API supports user registration and authentication, threaded discussions with posts and replies, a like/follow system, and role-based access control. Deployed to AWS Elastic Beanstalk with an RDS PostgreSQL instance.

---

## Features

- JWT authentication — stateless Bearer token auth with a 6-hour expiry
- Password hashing with bcrypt (10 salt rounds)
- Role-based access control — `ADMIN` role enforced at the middleware layer
- XSS sanitization middleware applied globally to all incoming request bodies
- Zod schema validation with custom password strength rules (min 8 chars, at least one number and one special character)
- Full CRUD for users, posts, and replies
- Like and follow system — many-to-many relationships between users and posts
- Versioned API endpoints under `/v1`
- Centralized error handling middleware
- Request logging middleware
- 404 handling for unknown routes and missing resources
- Prisma migrations for schema versioning
- Postman collection included for manual testing

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 18+ |
| Language | TypeScript 5 |
| Framework | Express 5 |
| Database | PostgreSQL (AWS RDS) |
| ORM | Prisma 6 |
| Auth | JSON Web Tokens (jsonwebtoken) |
| Password hashing | bcrypt |
| Validation | Zod |
| XSS protection | xss |
| Deploy | AWS Elastic Beanstalk |

---

## Project Structure

```
forum-backend/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── controllers/
│   │   ├── auth.ts
│   │   ├── posts.ts
│   │   ├── replies.ts
│   │   └── users.ts
│   ├── middleware/
│   │   ├── auth.ts          # JWT verification + isAdmin guard
│   │   ├── errors.ts        # Centralized error handler
│   │   ├── logging.ts       # Request logger
│   │   ├── notFound.ts      # 404 handler
│   │   ├── schemas.ts       # Zod schemas
│   │   ├── validation.ts    # Validation middleware factory
│   │   └── xss.ts           # XSS sanitization middleware
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── posts.ts
│   │   ├── replies.ts
│   │   └── users.ts
│   ├── types/
│   │   └── express/
│   │       └── index.d.ts
│   ├── app.ts
│   ├── prisma.ts
│   └── seed.ts
├── Forum- backend.postman_collection.json
├── .env.example
├── .gitignore
├── package.json
└── tsconfig.json
```

---

## Getting Started

### Prerequisites

- Node.js 18 or higher
- A PostgreSQL database (local or hosted)
- npm

### 1. Clone the repository

```bash
git clone https://github.com/jimmy1776/forum-backend.git
cd forum-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

Open `.env` and set the following:

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string, e.g. `postgresql://user:password@localhost:5432/forum` |
| `JWT_SECRET` | A long, random secret string used to sign JWT tokens |
| `PORT` | Port the server listens on (defaults to `8000` if omitted) |
| `NODE_ENV` | Set to `development` locally, `production` in deployment |

### 4. Run database migrations

```bash
npx prisma migrate dev
npx prisma generate
```

### 5. Seed the admin user (optional)

Creates a default admin account (`username: admin`, `email: admin@admin.com`) for testing admin-only routes:

```bash
node --loader ts-node/esm src/seed.ts
```

### 6. Start the development server

```bash
npm run dev
```

The server will be available at `http://localhost:8000`.

### Postman Collection

A Postman collection is included at the root of the repo (`Forum- backend.postman_collection.json`). Import it into Postman to test all endpoints without writing requests by hand.

---

## API Endpoints

All endpoints are prefixed with `/v1`.

### Auth (Public)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/v1/auth/register` | Register a new user. Validates email, username, name, and password strength. |
| POST | `/v1/auth/login` | Authenticate with username + password. Returns a signed JWT. |

### Users

GET endpoints are public. PATCH, DELETE, and admin routes require authentication.

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/v1/users` | Public | List all users |
| GET | `/v1/users/:id` | Public | Get a user by ID |
| PATCH | `/v1/users` | Required | Update the authenticated user's profile |
| DELETE | `/v1/users` | Required | Delete the authenticated user's account |
| DELETE | `/v1/users/:id` | Admin only | Delete any user by ID |
| GET | `/v1/users/:id/posts` | Public | Get all posts authored by a user |
| GET | `/v1/users/:id/posts-liked` | Public | Get all posts liked by a user |
| GET | `/v1/users/:id/posts-followed` | Public | Get all posts followed by a user |

### Posts

All post routes require authentication.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/v1/posts` | List all posts |
| POST | `/v1/posts` | Create a new post |
| GET | `/v1/posts/:id` | Get a post by ID |
| PATCH | `/v1/posts/:id` | Update a post |
| DELETE | `/v1/posts` | Delete the authenticated user's post |
| POST | `/v1/posts/:id/likes` | Like a post |
| DELETE | `/v1/posts/:id/likes` | Unlike a post |
| POST | `/v1/posts/:id/follows` | Follow a post |
| DELETE | `/v1/posts/:id/follows` | Unfollow a post |
| GET | `/v1/posts/:id/replies` | Get all replies for a post |
| POST | `/v1/posts/:id/replies` | Create a reply on a post |

### Replies

All reply routes require authentication.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/v1/replies/:id` | Get a reply by ID |
| PATCH | `/v1/replies/:id` | Update a reply |
| DELETE | `/v1/replies/:id` | Delete a reply |

---

## Authentication

After a successful login, include the returned token in the `Authorization` header for all protected routes:

```
Authorization: Bearer <token>
```

Tokens expire after 6 hours.

---

## Security

- Passwords hashed with bcrypt (10 salt rounds)
- JWT tokens expire after 6 hours
- XSS sanitization applied to all incoming request bodies before they reach any route handler
- Admin-only routes protected by a dedicated `isAdmin` middleware guard
- Zod validates and strips unexpected fields on all mutating requests before they reach controllers

---

## Deployment

Deployed to **AWS Elastic Beanstalk** with a **PostgreSQL RDS** database. Prisma's binary targets are configured for the Amazon Linux environment (`rhel-openssl-3.0.x`). Environment variables are configured securely through Elastic Beanstalk environment settings — no secrets are stored in the codebase.
