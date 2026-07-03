# Healthcare Management API

Healthcare Management API is a production-style REST API for a small hospital or clinic management system. It demonstrates backend engineering skills across REST API design, authentication, authorization, data modeling, validation, documentation, security, testing, Docker, and clean TypeScript project structure.

## Why This Project Exists

This project was built as a professional portfolio backend API for recruiter review. It focuses on realistic backend concerns rather than a frontend: secure authentication, role-based workflows, relational database design, API documentation, test coverage, and maintainable code organization.

## Tech Stack

- Node.js
- Express.js
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT authentication
- bcrypt password hashing
- Zod validation
- Swagger/OpenAPI
- Jest + Supertest
- Docker and Docker Compose
- ESLint + Prettier

## Main Features

- User registration and login with JWT access tokens
- Password hashing with bcrypt
- Role-based access control for `ADMIN`, `DOCTOR`, and `STAFF`
- Patient CRUD with pagination and search
- Appointment management connected to patients and doctors
- Hospital document management for patients
- Audit logs for important actions
- Centralized error handling
- Security middleware with Helmet, CORS, and rate limiting
- Swagger documentation at `/api/docs`

## Database Entities

- `User`: application users with role-based access
- `Patient`: patient demographic and emergency contact data
- `Appointment`: scheduled visits connecting patients and doctors
- `HospitalDocument`: simple medical certificates, referral letters, and discharge summaries
- `AuditLog`: important system actions with user and entity metadata

## API Endpoints

| Method | Endpoint | Description | Auth |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Register a user | Public |
| `POST` | `/api/auth/login` | Login user | Public |
| `GET` | `/api/users/doctors` | List doctors | ADMIN, STAFF, DOCTOR |
| `POST` | `/api/patients` | Create patient | ADMIN, STAFF |
| `GET` | `/api/patients` | List patients with pagination/search | ADMIN, STAFF, DOCTOR |
| `GET` | `/api/patients/:id` | Get patient by ID | ADMIN, STAFF, DOCTOR |
| `PATCH` | `/api/patients/:id` | Update patient | ADMIN, STAFF |
| `DELETE` | `/api/patients/:id` | Delete patient | ADMIN, STAFF |
| `POST` | `/api/appointments` | Create appointment | ADMIN, STAFF, DOCTOR |
| `GET` | `/api/appointments` | List appointments | ADMIN, STAFF, DOCTOR |
| `GET` | `/api/appointments/:id` | Get appointment by ID | ADMIN, STAFF, DOCTOR |
| `PATCH` | `/api/appointments/:id/status` | Update appointment status | ADMIN, STAFF, DOCTOR |
| `DELETE` | `/api/appointments/:id` | Delete appointment | ADMIN, STAFF |
| `POST` | `/api/documents` | Create hospital document | ADMIN, STAFF, DOCTOR |
| `GET` | `/api/documents/patient/:patientId` | Get documents by patient | ADMIN, STAFF, DOCTOR |
| `GET` | `/api/audit-logs` | List audit logs | ADMIN |
| `GET` | `/health` | Health check | Public |
| `GET` | `/api/docs` | Swagger documentation | Public |

## Run Locally

1. Install dependencies:

```bash
npm install
```

2. Create an environment file:

```bash
cp .env.example .env
```

3. Start PostgreSQL with Docker:

```bash
docker compose up -d postgres
```

4. Run migrations and seed data:

```bash
npm run prisma:migrate
npm run prisma:seed
```

5. Start the development server:

```bash
npm run dev
```

The API will run at `http://localhost:4000`.

## Run With Docker

```bash
docker compose up --build
```

The API container runs migrations automatically before starting the server.

## Run Tests

```bash
npm test
```

The test suite uses Jest and Supertest with a mocked Prisma layer, so the API behavior can be tested without requiring a live database connection.

## Swagger Documentation

Swagger UI is available at:

```text
http://localhost:4000/api/docs
```

## Demo Credentials

All seeded users use this password:

```text
Password123!
```

| Role | Email |
| --- | --- |
| ADMIN | `admin@healthcare.local` |
| DOCTOR | `doctor.one@healthcare.local` |
| DOCTOR | `doctor.two@healthcare.local` |
| STAFF | `staff.one@healthcare.local` |
| STAFF | `staff.two@healthcare.local` |

## Screenshots

Screenshots can be added here after running the API and opening Swagger UI.

## Future Improvements

- Refresh tokens and token rotation
- User invitation workflow
- Appointment availability rules
- Document PDF generation
- Soft deletes for healthcare records
- More detailed audit log filtering
- CI pipeline with PostgreSQL-backed integration tests

## Author

Daffa Ahmad Rivaldi
