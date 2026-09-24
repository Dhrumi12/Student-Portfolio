# Practicals 1-8 Evidence

This repository contains the completed cumulative implementation for the
Student Portfolio and Task Management application.

## Practical 1: React and Components

- Vite React application with reusable `Header`, `About`, `Skills`, `Footer`,
  and project components.
- `Home` passes data through props, including `skillList` and the project list.
- `PortfolioProjects` renders three project cards from a prop array.

## Practical 2: State and Routing

- React Router routes `/`, `/projects`, `/contact`, `/login`, `/register`, and
  a custom 404 route.
- `NavLink` navigation avoids full page reloads.
- Contact state drives controlled inputs, live preview, and character count.
- The navigation theme button toggles a dark/light visual mode with state.

## Practical 3: API Integration

- The Projects route uses `useEffect` and API calls to render task data.
- Loading, empty, error, retry, and success states are visible in the UI.
- Create, edit, completion, and delete actions update rendered data.

## Practical 4: Express REST API

- Express provides GET, POST, PUT, and DELETE task endpoints.
- Global request logging records method, URL, and timestamp.
- POST and PUT requests require `Content-Type: application/json`.
- A structured 404 response and final error handler are provided.

## Practical 5: MongoDB and Mongoose

- Task, user, and contact schemas persist data in MongoDB.
- Task validation includes required title, defaults, and low/medium/high
  priority values.
- Mongoose validation and invalid ID errors return structured JSON.

## Practical 6: Full-Stack Integration

- React calls the Express API through `src/api.js`.
- CORS is enabled and CRUD operations persist to MongoDB.
- Optimistic task creation, delete confirmation, and toast feedback are
  implemented.

## Practical 7: Authentication

- Registration hashes passwords with bcrypt.
- Login returns an expiring JWT.
- Task routes are protected by Bearer-token middleware.
- The frontend clears expired credentials and redirects to login.

## Practical 8: Performance

- Projects and Contact are route-level lazy imports.
- Suspense provides the route loading fallback.
- Build measurements and the before/after comparison are in
  [performance.md](performance.md).

## Verification commands

```bash
npm run lint
npm run build
cd task-manager-api
node --check server.js
```

Run the frontend and API in separate terminals. MongoDB must be available and
`task-manager-api/.env` must contain `MONGO_URI`, `PORT`, and `JWT_SECRET`.