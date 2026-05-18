# Forum Backend API

A production-ready REST API for a forum application built with Node.js, TypeScript, Express, and PostgreSQL. Deployed to AWS Elastic Beanstalk with an RDS PostgreSQL database.

## Tech Stack
- TypeScript
- Node.js
- Express
- PostgreSQL
- Prisma ORM
- JSON Web Tokens (JWT)
- bcrypt
- Zod
- xss

## Features
- User registration and login with JWT authentication
- Password hashing with bcrypt
- Role-based access control (Admin role)
- XSS sanitization middleware on all incoming requests
- Zod schema validation with custom password strength rules
- CRUD operations for users, posts, replies
- Like and follow system for posts (many-to-many relationships)
- Request logging middleware
- Centralized error handling
- 404 handling for unknown routes and missing resources

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
│   │   ├── auth.ts
│   │   ├── errors.ts
│   │   ├── logging.ts
│   │   ├── notFound.ts
│   │   ├── schemas.ts
│   │   ├── validation.ts
│   │   └── xss.ts
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
├── .env
├── .gitignore
├── package.json
└── README.md
```

## API Endpoints

### Auth (Public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /v1/auth/register | Register a new user |
| POST | /v1/auth/login | Login and receive JWT token |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /v1/users | Get all users |
| GET | /v1/users/:id | Get user by ID |
| PATCH | /v1/users | Update current user |
| DELETE | /v1/users | Delete current user |
| DELETE | /v1/users/:id | Delete user by ID (Admin only) |
| GET | /v1/users/:id/posts | Get posts by user |
| GET | /v1/users/:id/posts-liked | Get posts liked by user |
| GET | /v1/users/:id/posts-followed | Get posts followed by user |

### Posts (Requires Auth)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /v1/posts | Get all posts |
| POST | /v1/posts | Create a post |
| GET | /v1/posts/:id | Get post by ID |
| PATCH | /v1/posts/:id | Update a post |
| DELETE | /v1/posts/:id | Delete a post |
| POST | /v1/posts/:id/likes | Like a post |
| DELETE | /v1/posts/:id/likes | Unlike a post |
| POST | /v1/posts/:id/follows | Follow a post |
| DELETE | /v1/posts/:id/follows | Unfollow a post |
| GET | /v1/posts/:id/replies | Get replies for a post |
| POST | /v1/posts/:id/replies | Create a reply |

### Replies (Requires Auth)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /v1/replies/:id | Get reply by ID |
| PATCH | /v1/replies/:id | Update a reply |
| DELETE | /v1/replies/:id | Delete a reply |

## Getting Started

### Prerequisites
- Node.js
- PostgreSQL database

### Installation
```bash
git clone https://github.com/jimmy1776/forum-backend
cd forum-backend
npm install
```

### Environment Variables
Create a `.env` file in the root directory:
```
DATABASE_URL="postgresql://user:password@localhost:5432/forum"
JWT_SECRET="your_jwt_secret"
PORT=8000
```

### Database Setup
```bash
npx prisma migrate dev
npx prisma generate
```

### Seed Admin User
```bash
npx ts-node src/seed.ts
```

### Run Locally
```bash
npm run dev
```

## Deployment
Deployed to AWS Elastic Beanstalk with a PostgreSQL RDS database. Prisma migrations are used for schema versioning. Environment variables are configured securely through Elastic Beanstalk environment settings.

## Security
- Passwords hashed with bcrypt (10 salt rounds)
- JWT tokens expire after 6 hours
- XSS sanitization applied to all request bodies
- Admin-only routes protected by role-based middleware
- Input validated with Zod before reaching controllers
