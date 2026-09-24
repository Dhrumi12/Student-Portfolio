# Student Portfolio

This portfolio app has been extended with React Router, state management, and a MongoDB-backed task manager.

## Features

- Multi-page navigation using React Router
- Contact form with controlled input and live character count
- Task page connected to the local Express and MongoDB API
- Create, read, update, complete, and delete task operations
- Loading, error, confirmation, and toast feedback states

## Practical 8: Performance Optimization

Projects and Contact use route-based `React.lazy()` imports with a Suspense
fallback. The build comparison, chunk sizes, DevTools measurement procedure,
and analysis are documented in [docs/performance.md](docs/performance.md).

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
