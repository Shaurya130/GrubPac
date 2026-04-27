# Content Broadcasting System Backend

A scalable backend system for educational content broadcasting where teachers upload subject-based content, principals approve/reject it, and students access live rotating content through public APIs.

Built using:

* Node.js
* Express.js
* Prisma ORM
* PostgreSQL (Neon DB)
* JWT Authentication
* Multer
* Swagger

---

# Features

## Authentication & Authorization

* JWT-based authentication
* Role-Based Access Control (RBAC)
* Principal and Teacher roles
* Protected routes
* Current user endpoint

## Content Upload System

* Teacher-only upload access
* Image uploads using Multer
* Supported formats:

  * JPG
  * PNG
  * GIF
* Max file size: 10MB
* Scheduling support:

  * startTime
  * endTime
  * rotation duration

## Approval Workflow

* Principal-only approval/rejection
* Pending content management
* Rejection reasons
* Approval timestamps

## Live Broadcasting System

* Public live content API
* Subject-wise content rotation
* Scheduling validation
* Continuous looping logic
* Approved-only broadcasting

## Validation & Security

* Zod validation
* Rate limiting
* Helmet security
* Global error handling
* Environment validation

## Additional Features

* Swagger API documentation
* Pagination support
* Subject/status filtering
* Prisma ORM
* Neon PostgreSQL integration

---

# Tech Stack

| Technology | Usage             |
| ---------- | ----------------- |
| Node.js    | Runtime           |
| Express.js | Backend framework |
| Prisma     | ORM               |
| PostgreSQL | Database          |
| Neon DB    | Cloud PostgreSQL  |
| JWT        | Authentication    |
| Multer     | File uploads      |
| Zod        | Validation        |
| Swagger    | API docs          |
| Render     | Deployment        |

---

# Project Structure

```txt
src/
│
├── config/
│   ├── db.js
│   ├── env.js
│   ├── multer.js
│   └── swagger.js
│
├── controllers/
│   ├── auth.controller.js
│   ├── content.controller.js
│   └── approval.controller.js
│
├── middlewares/
│   ├── auth.middleware.js
│   ├── role.middleware.js
│   ├── error.middleware.js
│   ├── validate.middleware.js
│   └── rateLimiter.middleware.js
│
├── routes/
│   ├── auth.routes.js
│   ├── content.routes.js
│   └── approval.routes.js
│
├── services/
│   └── rotation.service.js
│
├── utils/
│   ├── jwt.js
│   └── asyncHandler.js
│
├── validations/
│   └── content.validation.js
│
├── app.js
└── server.js

prisma/
│
└── schema.prisma

uploads/
```

---

# Database Schema

## User

| Field        | Type                |
| ------------ | ------------------- |
| id           | String              |
| name         | String              |
| email        | String              |
| passwordHash | String              |
| role         | PRINCIPAL / TEACHER |

## Content

| Field           | Type                          |
| --------------- | ----------------------------- |
| id              | String                        |
| title           | String                        |
| description     | String                        |
| subject         | String                        |
| filePath        | String                        |
| status          | PENDING / APPROVED / REJECTED |
| rejectionReason | String                        |
| startTime       | DateTime                      |
| endTime         | DateTime                      |

## ContentSchedule

| Field         | Type   |
| ------------- | ------ |
| contentId     | String |
| rotationOrder | Number |
| duration      | Number |

---

# Installation & Setup

## 1. Clone Repository

```bash
git clone YOUR_REPOSITORY_URL
```

```bash
cd content-broadcasting-system
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Configure Environment Variables

Create `.env`

```env
PORT=5000

DATABASE_URL=your_neon_database_url

JWT_SECRET=your_secret_key
```

---

## 4. Run Prisma Migration

```bash
npx prisma migrate dev --name init
```

---

## 5. Generate Prisma Client

```bash
npx prisma generate
```

---

## 6. Run Development Server

```bash
npm run dev
```

---

# API Documentation

Swagger Docs:

```txt
http://localhost:5000/api-docs
```

Health Check:

```txt
http://localhost:5000/health
```

---

# API Endpoints

## Auth Routes

| Method | Endpoint           |
| ------ | ------------------ |
| POST   | /api/auth/register |
| POST   | /api/auth/login    |
| GET    | /api/auth/me       |

---

## Content Routes

| Method | Endpoint                     |
| ------ | ---------------------------- |
| POST   | /api/content/upload          |
| GET    | /api/content/my-content      |
| GET    | /api/content/live/:teacherId |

---

## Approval Routes

| Method | Endpoint                  |
| ------ | ------------------------- |
| GET    | /api/approval/pending     |
| PATCH  | /api/approval/:id/approve |
| PATCH  | /api/approval/:id/reject  |

---

# Scheduling & Rotation Logic

This project implements subject-wise rotating content broadcasting.

Each content item contains:

* Rotation duration
* Rotation order
* Subject association
* Scheduling window

Only content satisfying:

```txt
current_time >= startTime
AND
current_time <= endTime
```

is considered active.

---

## Rotation Algorithm

Example:

| Content | Duration |
| ------- | -------- |
| A       | 5 mins   |
| B       | 5 mins   |
| C       | 5 mins   |

Broadcast cycle:

```txt
0-5 mins   -> A
5-10 mins  -> B
10-15 mins -> C
15-20 mins -> A again
```

The system uses modulo-based looping:

```js
const cyclePosition =
  currentMinute % totalDuration;
```

Advantages:

* No cron jobs required
* Continuous infinite rotation
* Scalable approach
* Deterministic scheduling

---

# Edge Cases Handled

## No Content Available

Returns:

```json
{
  "message": "No content available"
}
```

## Invalid Subject

Returns empty response instead of server error.

## Content Outside Schedule Window

Automatically excluded from broadcasting.

## Unauthorized Access

Protected using JWT and RBAC.

---

# Security Features

* JWT Authentication
* Role-based authorization
* Password hashing using bcryptjs
* Helmet security middleware
* Rate limiting
* Request validation using Zod
* Global error handling

---

# Deployment

## Backend

Deployed on:

* Render

## Database

Hosted on:

* Neon PostgreSQL

---

# Future Improvements

* Redis caching
* AWS S3 uploads
* Queue-based scheduling
* Analytics dashboard
* Docker support
* Real-time notifications

---

# Author

Developed by Shaurya Awasthi.
