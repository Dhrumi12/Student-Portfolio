# Student Portfolio

This repository contains the completed Student Portfolio and full-stack Task
Management application for Practicals 1-8. It combines a Vite React frontend,
an Express REST API, MongoDB persistence, JWT authentication, and route-level
performance optimization.

## Features

- Multi-page navigation using React Router
- Reusable Header, About, Skills, Footer, and project components
- Props-driven skills and three-project portfolio showcase
- Dark/light mode toggle
- Contact form with controlled input and live character count
- Task page connected to the local Express and MongoDB API
- Create, read, update, complete, and delete task operations
- Loading, empty, error, retry, confirmation, optimistic update, and toast states
- User registration, bcrypt password hashing, JWT login, logout, and protected task routes
- Express request logging, JSON content-type validation, structured errors, and 404 handling
- Personal GitHub profile link in the portfolio footer: https://github.com/Dhrumi12

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Portfolio home, skills, and project showcase |
| `/projects` | Authenticated MongoDB task manager |
| `/contact` | Controlled contact form saved through the API |
| `/login` | JWT user login |
| `/register` | New user registration |
| Any other path | Custom 404 page |

## Practical completion

### Practical 1: React and component architecture

The app uses independently structured functional components. `Home` passes
props for the name, theme color, biography, skills, email, and project list.
The project showcase renders three projects dynamically from props.

### Practical 2: State management and routing

React Router provides client-side navigation without full page reloads. The
Contact page uses controlled form state, a live preview, character count, and
help visibility toggle. The navigation includes a dark/light mode state toggle
and the app includes a custom 404 route.

### Practical 3: API integration and data rendering

The Projects page uses `useEffect` and centralized functions in `src/api.js`
to load task data. It handles loading, empty, error, retry, create, update,
complete, and delete states.

### Practical 4: REST API with Express

The backend provides CRUD task endpoints, a global request logger, JSON
content-type validation for write requests, structured 404 responses, and a
final error handler.

### Practical 5: MongoDB and Mongoose

Mongoose models persist users, tasks, and contact messages. Task schemas
validate required titles, completion defaults, timestamps, and low/medium/high
priority values. Validation errors are returned as structured JSON.

### Practical 6: Full-stack integration

The React frontend communicates with the Express API using fetch and CORS.
Task changes persist in MongoDB and the UI provides optimistic creation,
delete confirmation, success notifications, and failure feedback.

### Practical 7: Authentication and middleware

Registration hashes passwords with bcrypt. Login returns a one-hour JWT, and
the task endpoints require a valid Bearer token. Expired protected requests
clear local credentials and redirect to the login page.

## Practical 8: Performance Optimization

Projects and Contact use route-based `React.lazy()` imports with a Suspense
fallback. The build comparison, chunk sizes, DevTools measurement procedure,
and analysis are documented in [docs/performance.md](docs/performance.md).

Measured production build comparison:

| Build | Initial JavaScript | Gzip | Route chunks |
| --- | ---: | ---: | --- |
| Before code splitting | 244.08 kB | 77.27 kB | None |
| After code splitting | 238.28 kB | 75.94 kB | Projects and Contact |

The optimized build creates separate lazy chunks for the Projects and Contact
routes. Full evidence and the DevTools measurement procedure are in
[docs/performance.md](docs/performance.md).

## Practicals 1-8 evidence

The complete practical checklist, implementation mapping, and verification
commands are documented in [docs/practicals.md](docs/practicals.md).

## Run locally

Start MongoDB, then run the backend and frontend in separate terminals.

Terminal 1:

```bash
cd task-manager-api
npm install
npm run dev
```

Terminal 2:

```bash
cd student-portfolio
npm install
npm run dev -- --host localhost
```

Then open:

```text
http://localhost:5173
```

The React app calls the Express API at `http://localhost:5001`. The backend must have `task-manager-api/.env` configured with a working `MONGO_URI`. MongoDB Compass can be used to verify the persisted `tasks` collection.

## Practical 5: MongoDB Task API

This repository includes an Express API backed by MongoDB and validated with Mongoose.

### Setup

1. Run `npm install`.
2. Start MongoDB locally, or create a MongoDB Atlas database.
3. Copy `.env.example` to `.env` and set `MONGO_URI` to your connection string.
4. Start the API with `npm run server` (or `npm run server:dev` for watch mode).
5. Use `http://localhost:5001` in Postman or Thunder Client.

### Endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/tasks` | List all tasks |
| GET | `/tasks/:id` | Get one task; returns JSON 404 when missing |
| POST | `/tasks` | Create a task |
| PUT | `/tasks/:id` | Update a task |
| DELETE | `/tasks/:id` | Delete a task |

Example POST body:

```json
{
	"title": "Complete Practical 5",
	"description": "Connect Express to MongoDB",
	"priority": "high"
}
```

`completed` defaults to `false`, `priority` defaults to `medium`, and `createdAt` defaults to the current date. `title` is required and `priority` accepts only `low`, `medium`, or `high`. Validation failures return structured JSON with an `error` and field-level `details` object.

### What to demonstrate

- Create, read, update, and delete tasks in Postman.
- Submit a task without `title` and show the structured 400 response.
- Restart the API and show that tasks remain in MongoDB.
- Open MongoDB Compass or Atlas to show the `task_management` database and `tasks` collection.

Mongoose provides application-level structure and validation even though MongoDB is schema-flexible. A failed validation stops the Mongoose operation before the document is sent to MongoDB; Express then converts the error into a clean JSON response.

### Portfolio contact messages

Run both applications in separate terminals:

```bash
npm run server
npm run dev
```

The Contact page sends `name`, `email`, and `message` to `POST /contacts` through the Vite `/api` proxy. Successful submissions appear in MongoDB Compass under `task_management > contacts`.

## Practical 6: Full-Stack Integration Details

The frontend and backend run as two connected applications:

- React runs on `http://localhost:5173`.
- Express runs on `http://localhost:5001`.
- CORS allows the frontend to call the API.
- `src/api.js` centralizes task, authentication, and user requests.
- Task create, read, update, complete, and delete operations use MongoDB.
- The UI includes optimistic creation, loading states, error states, retry,
  delete confirmation, and toast feedback.

## Practical 7: Authentication Details

- `/register` validates credentials and hashes passwords with bcrypt.
- `/login` verifies the password and returns a JWT with a one-hour expiry.
- `/me` returns the authenticated user's details.
- All task endpoints require `Authorization: Bearer <token>`.
- Logout removes the token and stored user from browser storage.
- Expired or invalid protected requests redirect the user to login.

## Practical 8: Lazy Loading Details

The Projects and Contact route components are loaded only when their routes are
visited:

```jsx
const Projects = lazy(() => import('./components/Projects.jsx'))
const Contact = lazy(() => import('./components/Contact.jsx'))
```

The routes are wrapped with `Suspense` and display `Loading page...` while a
lazy chunk loads. The optimized Vite build produces separate `Projects` and
`Contact` JavaScript files. The complete before/after measurements and
Slow 3G testing steps are documented in [docs/performance.md](docs/performance.md).
