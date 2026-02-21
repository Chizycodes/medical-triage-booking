# MediTriage - Fullstack Developer Assignment

Medical triage and booking application. Patients log in, complete a 5-question symptom questionnaire, receive a care recommendation (Chat / Nurse / Doctor), and book a 15-minute appointment slot.

---

## Tech Stack

### Frontend

| Tool | Purpose |
|------|---------|
| React 19 + TypeScript + Vite | SPA framework with fast DX and full type safety |
| Tailwind CSS v4 | Utility-first styling; theme tokens defined in `index.css` via `@theme` |
| React Router v7 | Client-side routing with nested protected routes via `<Outlet />` |
| Zustand | Lightweight state management, split into `useTriageStore` and `useAuthStore` |
| Axios | HTTP client with a shared instance; replaces raw `fetch` |
| React Hook Form | Form state, validation, and submission handling |
| React Toastify | Non-blocking toast notifications for errors and feedback |

### Backend

| Tool | Purpose |
|------|---------|
| Java 17 | Language requirement per the brief |
| Spring Boot 4 | REST framework with auto-configuration and built-in validation |
| Maven | Build and dependency management |

---

## Project Structure

```
.
├── frontend/
│   └── src/
│       ├── assets/         # Static files (logo.svg)
│       ├── components/     # Reusable UI components (Button, Input, Logo, Header, Footer, AuthLayout, LoginForm, QuestionCard)
│       ├── data/           # Question definitions, mock user credentials
│       ├── pages/          # LoginPage, HomePage, Questionnaire, Recommendation, Confirmation
|       ├── routes/         # ProtectedRoute
│       ├── services/       # Axios instance and API call functions
│       ├── store/          # useAppStore (booking flow), useAuthStore (auth)
│       ├── types/          # TypeScript interfaces
│       └── utils/          # Slot formatting helpers, recommendation metadata
└── backend/
    └── src/
        ├── main/java/com/med_triage_api/
        │   ├── controller/     # MedTriageController, GlobalExceptionHandler
        │   ├── model/          # Request/Response POJOs
        │   └── service/        # SchedulingService, BookingService
        └── test/java/com/med_triage_api/service/
            └── SchedulingServiceTest.java
```

---

## Running the Frontend

### Prerequisites

- Node.js 18+
- npm

### Steps

```bash
cd frontend

# Install dependencies
npm install

# Start dev server (runs on http://localhost:5173)
npm run dev
```

The frontend expects the backend at `http://localhost:8080` by default.
To override, create a `.env` file in the `frontend/` directory:

```
VITE_API_URL=http://localhost:8080
```

### Demo login credentials

```
demo@meditriage.com     / Demo@1234
patient@meditriage.com  / Password123
```

---

## Running the Backend

### Prerequisites

- **Java 17** (e.g. via [SDKMAN](https://sdkman.io/): `sdk install java 17.0.10-tem`)
- **Maven 3.9+**

### Steps

```bash
cd backend

# Compile and run
mvn spring-boot:run

# The API starts on http://localhost:8080
```

### Verify it's running

```bash
curl -X POST http://localhost:8080/assessment \
  -H "Content-Type: application/json" \
  -d '{"score": 11}'
```

---

## Running the Tests

```bash
cd backend
mvn test
```

Tests cover:

- Recommendation logic (score ranges → Chat / Nurse / Doctor)
- Clinician availability (before shift, during break, after shift)
- Slot generation (no past slots, within clinic hours, 3-day window, 15-min intervals)

---

## API Reference

### `POST /assessment`

**Request**

```json
{ "score": 11 }
```

**Response**

```json
{
  "recommendation": "Nurse",
  "availableSlots": ["2026-02-20T09:00:00", "2026-02-20T09:15:00"]
}
```

### `POST /booking`

**Request**

```json
{ "slot": "2026-02-20T09:15:00", "recommendation": "Nurse" }
```

**Response**

```json
{ "confirmationId": "a1b2c3d4", "slot": "2026-02-20T09:15:00", "recommendation": "Nurse" }
```

---

## Scheduling Assumptions

1. **4 clinicians** with start times: 08:00, 08:30, 09:00, 09:30. This ensures near-continuous coverage and avoids simultaneous breaks blacking out the whole clinic.
2. Each clinician works exactly **8 hours** with a **1-hour break exactly 4 hours after starting** (e.g. starts 08:00 → break 12:00–13:00).
3. A slot is **available** if at least one clinician is not on break and has not exceeded their 8-hour limit.
4. Slots are 15-minute windows between **08:00 and 18:00** local time.
5. Slots are returned for **today through today + 3 calendar days**, excluding any that have already passed.
6. **No database** - bookings are stored in a `ConcurrentHashMap`. Data is lost on restart.

---

## Key Decisions & Trade-offs

- **Zustand over Context API** — two separate stores (`useTriageStore`, `useAuthStore`) keep auth and booking concerns independent. Components subscribe to only the slices they need, avoiding unnecessary re-renders.
- **React Router nested routes** — a single `<ProtectedRoute />` layout route wraps all authenticated pages, so the auth check is declared once rather than repeated per route.
- **React Hook Form** — replaces manual `useState` for form fields. Gives built-in validation, error state, and `isSubmitting` for free.
- **Axios instance** — base URL and headers configured once; easy to attach interceptors later (e.g. auth tokens).
- **Tailwind v4 `@theme`** — no `tailwind.config.js`; all custom colour tokens live in `index.css`.
- **SVG logo as an asset** — imported once in a `<Logo />` component with a `size` prop, eliminating repeated inline SVG blocks across pages.
- **Mock authentication** — seeded user list in `data/users.ts` with a simulated network delay. No real auth is wired up; acceptable per the brief.
- **CORS is open (`*`)** — fine for local development. Restrict to the frontend's domain in production.

---

## What I Would Improve Given More Time

1. **Slot conflict prevention** — exclude already-booked slots from future `/assessment` responses.
2. **Persist auth across refresh** — store the user session in `localStorage` or a cookie so login survives a page reload.
3. **Frontend tests** — Vitest + React Testing Library covering the questionnaire flow and store logic.
4. **Docker Compose** — single `docker compose up` to spin up both services.
5. **CI** — GitHub Actions workflow to run backend tests and lint the frontend on every push.
6. **Real authentication** — JWT-based login endpoint on the backend with token validation on protected API routes.
