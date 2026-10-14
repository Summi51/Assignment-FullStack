# CRM Backend — Enquiry Claiming System

A REST API for a CRM where counselors/employees can view, and "claim" prospective
client enquiries. Built with **Node.js, Express, MongoDB (Mongoose), and JWT** auth.

## Business Logic

- Each employee/counselor has a CRM account (email + password).
- Prospective clients submit the **public enquiry form** (no auth required).
- All logged-in employees can see **unclaimed (public)** enquiries.
- An employee can **claim** an enquiry — it is then assigned only to them and
  disappears from the public/unclaimed list.
- Each employee can view the list of enquiries **they have claimed**.

## Setup

```bash
cd backend
npm install
cp .env.example .env   # edit values as needed
npm run dev             # or: npm start
```

### Environment variables (`.env`)

| Variable         | Description                          | Example                              |
|------------------|---------------------------------------|---------------------------------------|
| `PORT`           | Server port                           | `5000`                                 |
| `MONGO_URI`      | MongoDB connection string             | `mongodb://127.0.0.1:27017/crm`        |
| `JWT_SECRET`     | Secret used to sign JWTs              | any random string                      |
| `JWT_EXPIRES_IN` | JWT expiry                            | `7d`                                   |

Requires a running MongoDB instance (local `mongod` or a cloud Atlas cluster).

## API Endpoints

### Auth

| Method | Route                | Auth | Description                |
|--------|-----------------------|------|-----------------------------|
| POST   | `/api/auth/register`  | No   | Register a new employee     |
| POST   | `/api/auth/login`     | No   | Login, returns JWT token    |

**Register/Login body:**
```json
{ "name": "Jane Doe", "email": "jane@brahma.ai", "password": "secret123" }
```
Response includes `{ employee, token }`. Pass the token as
`Authorization: Bearer <token>` on protected routes.

### Enquiries

| Method | Route                        | Auth        | Description                                  |
|--------|-------------------------------|-------------|------------------------------------------------|
| POST   | `/api/enquiries`               | **Public**  | Submit the enquiry form (lead capture)         |
| GET    | `/api/enquiries/unclaimed`     | Protected   | List all unclaimed (public) enquiries          |
| GET    | `/api/enquiries/my-leads`      | Protected   | List enquiries claimed by the logged-in user   |
| PATCH  | `/api/enquiries/:id/claim`     | Protected   | Claim an enquiry (atomic — prevents race conditions) |

**Submit enquiry (public):**
```json
{ "name": "John Student", "email": "john@example.com", "phone": "9999999999", "courseInterest": "MBA" }
```

## Example curl flow

```bash
# 1. Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane","email":"jane@brahma.ai","password":"secret123"}'

# 2. Submit a public enquiry (no auth)
curl -X POST http://localhost:5000/api/enquiries \
  -H "Content-Type: application/json" \
  -d '{"name":"John Student","email":"john@example.com","courseInterest":"MBA"}'

# 3. View unclaimed leads (use token from step 1)
curl http://localhost:5000/api/enquiries/unclaimed \
  -H "Authorization: Bearer <TOKEN>"

# 4. Claim a lead (use the enquiry _id from step 3)
curl -X PATCH http://localhost:5000/api/enquiries/<ENQUIRY_ID>/claim \
  -H "Authorization: Bearer <TOKEN>"

# 5. View my claimed leads
curl http://localhost:5000/api/enquiries/my-leads \
  -H "Authorization: Bearer <TOKEN>"
```

## Project Structure

```
backend/
├── src/
│   ├── app.js              # Express app, routes, error handling
│   ├── server.js           # Entry point, DB connect + listen
│   ├── config/db.js        # Mongoose connection
│   ├── models/             # Employee, Enquiry schemas
│   ├── controllers/        # auth + enquiry business logic
│   ├── middleware/auth.js  # JWT verification middleware
│   ├── routes/             # authRoutes, enquiryRoutes
│   └── utils/generateToken.js
├── .env.example
└── package.json
```
