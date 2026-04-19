# Pharmacy Patient Medication Profile API

Built by Chi Chi Yip for Queensland University of Technology, IFN666 Web and Mobile Application Development.

## Purpose

This is the server-side component of a Pharmacy Patient Medication Profile Management system. It provides a RESTful HTTP API that allows pharmacy staff to manage patient records, a medication catalogue, and each patient's medication history (profiles).

The system enforces a two-tier role model: **Pharmacists** have full read/write access across all resources, while **Pharmacy Assistants** have read-only access. New staff accounts require pharmacist approval before they can log in, preventing unauthorised access to sensitive patient data.

The API is deployed at: `https://lyrebird04.ifn666.com/a02/`

---

## API Endpoints

All endpoints are prefixed with `/api`. Protected endpoints require a `Bearer` token in the `Authorization` header.

### Authentication

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/auth/register` | Public | Register a new staff account |
| POST | `/auth/login` | Public | Login and receive a JWT token |
| GET | `/auth/users/pending` | Pharmacist only | List accounts awaiting approval |
| PUT | `/auth/users/:id/approve` | Pharmacist only | Approve a pending account |
| DELETE | `/auth/users/:id/decline` | Pharmacist only | Decline and remove a pending account |

**Register request body:**
```json
{
  "username": "jsmith",
  "password": "securepassword",
  "userRole": "pharmacist",
  "isPharmacist": true
}
```

**Login response:**
```json
{
  "token": "<jwt>"
}
```

---

### Patients

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/patients` | Authenticated | Get all patients (paginated) |
| GET | `/patients/search` | Authenticated | Search patients by name |
| GET | `/patients/:id` | Authenticated | Get a patient by ID |
| POST | `/patients` | Pharmacist only | Create a new patient |
| PUT | `/patients/:id` | Pharmacist only | Update a patient |
| DELETE | `/patients/:id` | Pharmacist only | Delete a patient |

**Query parameters for GET `/patients`:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | integer | Page number (default: 1) |
| `limit` | integer | Results per page (default: 10) |
| `sortBy` | string | Field to sort by (e.g. `lastName`) |
| `sortOrder` | string | `asc` |

**Query parameters for GET `/patients/search`:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `name` | string | Partial or full patient name (case-insensitive) |

---

### Medications

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/medications` | Authenticated | Get all medications (paginated) |
| GET | `/medications/search` | Authenticated | Search medications by active ingredient |
| GET | `/medications/:id` | Authenticated | Get a medication by ID |
| POST | `/medications` | Pharmacist only | Add a medication to the catalogue |
| PUT | `/medications/:id` | Pharmacist only | Update a medication |
| DELETE | `/medications/:id` | Pharmacist only | Remove a medication from the catalogue |

**Query parameters for GET `/medications`:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | integer | Page number (default: 1) |
| `limit` | integer | Results per page (default: 10) |
| `activeIngredient` | string | Filter by active ingredient (case-insensitive) |

---

### Medication Profiles (nested under Patient)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/patients/:id/medicationProfiles` | Authenticated | Get all profiles for a patient (paginated) |
| GET | `/patients/:id/medicationProfiles/:profileId` | Authenticated | Get a specific profile |
| POST | `/patients/:id/medicationProfiles` | Pharmacist only | Create a profile for a patient |
| PUT | `/patients/:id/medicationProfiles/:profileId` | Pharmacist only | Update a profile |
| DELETE | `/patients/:id/medicationProfiles/:profileId` | Pharmacist only | Delete a profile |

---

### Health Check

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/health` | Public | Returns server uptime status |

---

## How to Contribute

1. Fork the repository and clone it to your local machine.
2. Create a new branch for your feature or fix - use a descriptive name, e.g. `feature/medication-search` or `fix/profile-validation`.
3. Make your changes, following the existing layered structure: routes define paths, controllers hold logic, models define data.
4. Ensure all new endpoints include appropriate input validation via `express-validator` and return correct HTTP status codes.
5. Test your changes against the API using Hoppscotch or Postman before opening a pull request. Update `API-collection.json` if you add or modify any endpoints.
6. Commit with clear, descriptive messages (e.g. `Add search by brand name to medication list endpoint`).
7. Push to your fork and open a Pull Request against the `main` branch with a description of what was changed and why.

---

## Features

- **Role-based access control** — Pharmacists and Pharmacy Assistants have distinct permissions enforced at the route level via JWT claims.
- **Staff approval workflow** — Newly registered accounts are inactive until approved by a Pharmacist, with endpoints to list, approve, and decline pending registrations.
- **Patient management** — Full CRUD for patient records, with name-based search and sort.
- **Medication catalogue** — Full CRUD for the medication catalogue, with active-ingredient-based search.
- **Medication profiles** — Full CRUD for a patient's medication history, nested under the patient resource. Each profile links a patient to a medication with dosage, frequency, status, and date fields.
- **Input validation** — All write endpoints validate request bodies using `express-validator`, returning structured error messages on invalid input.
- **Pagination** — All list endpoints are paginated using `mongoose-paginate-v2`. Navigation links (first, prev, next, last) are provided via the HTTP `Link` response header.
- **CORS support** — The `Link` and `Authorization` headers are explicitly exposed to support browser clients.

---

## Dependencies

Listed in `package.json`. Install all dependencies with:

```bash
npm install
```

| Package | Purpose |
|---------|---------|
| `express` | Web framework — handles HTTP routing and middleware |
| `mongoose` | MongoDB ODM — defines schemas, models, and database queries |
| `mongoose-paginate-v2` | Adds `.paginate()` to Mongoose models for server-side pagination |
| `bcrypt` | Hashes and verifies user passwords before storing to the database |
| `jsonwebtoken` | Issues and verifies JWT tokens for stateless authentication |
| `express-validator` | Validates and sanitises request body fields on write endpoints |
| `express-async-handler` | Wraps async controller functions to forward errors to Express error handling |
| `cors` | Enables Cross-Origin Resource Sharing, exposing `Authorization` and `Link` headers |
| `dotenv` | Loads environment variables from a `.env` file |
| `mongodb` | MongoDB Node.js driver (peer dependency for Mongoose) |

**Environment variables required in `.env`:**

```
PORT=3000
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>
JWT_SECRET=<your_secret_key>
```

---

## Application Architecture

The API follows a layered RESTful architecture. Each layer has a single responsibility:

```
server/
├── node_modules
├── .gitignore
├── .env
├── API-collection.json # a collection file that is compatible with a popular API platform (like Postman, Hoppscotch or Insomnia)
├── package-lock.json
├── package.json
├── README.md
├── server.js # Entry point - Express app setup, DB connection, middleware, top-level routing
├── src/
│   ├── controllers/ # Business logic - handles requests, calls models, sends responses
│   │   ├── authController.js
│   │   ├── patientController.js
│   │   ├── medicationProfileController.js
│   │   └── patientController.js
│   ├── middleware/ # Reusable middleware - authentication, authorisation, validation helpers
│   │   ├── authenticateWithJwt.js
│   │   ├── authoriseRole.js
│   │   ├── validateMongoId.js
│   │   └── validatePaginateQueryParams.js
│   ├── models/ # Mongoose schemas and models - defines data shape and DB interface
│   │   ├── medicationModel.js
│   │   ├── medicationProfileModel.js
│   │   ├── patientModel.js
│   │   └── userModel.js
│   ├── routes/ # Route definitions - maps HTTP methods and paths to controllers
│   │   ├── auth.js
│   │   ├── index.js
│   │   ├── medication.js
│   │   ├── medicationProfile.js
│   │   └── patient.js
│   └── utils/ # Helper functions not belonging to middleware or controllers
│       └── generatePaginationLinks.js
└── scripts/ # One-off database seed scripts and data for the scripts
    ├── createAdminPharmacist.js
    ├── createMedications.js
    ├── createPatients.js
    ├── medications.json
    └── patients.json
```

**Data model relationships:**

- A `Patient` has many `MedicationProfiles` (one-to-many)
- A `MedicationProfile` contains `Medication` entries (many-to-one)
- A `Medication` can be referenced across many `MedicationProfiles` and many `Patients` (many-to-many via `MedicationProfile`)

**Request lifecycle:**

1. `server.js` receives the request and applies global middleware (JSON parsing, CORS).
2. The router in `src/routes/` matches the path and HTTP method.
3. Route-level middleware runs in order: JWT authentication, role authorisation, input validation, pagination parameter parsing.
4. The controller handler executes business logic, queries the model, and sends the response.
5. Pagination metadata is written to the `Link` response header before the JSON body is sent.

---

## How to Report Issues

1. Check the [Issues](../../issues) page on Github to confirm the issue has not already been reported.
2. Open a new issue and include:
   - A clear description of the problem.
   - The endpoint and HTTP method involved.
   - The request body or query parameters used.
   - The response received (status code and body).
   - Expected behaviour vs actual behaviour.
   - Any relevant error output from the server logs.
3. Label the issue appropriately (e.g. `bug`, `enhancement`, `question`).

---

## Licence

This project is licensed under the MIT Licence - see the LICENSE file for details.