# Task Manager API

## Run it

From this directory:

```bash
cp .env.example .env
npm start
```

Set `MONGO_URI` in `.env` first. Use MongoDB locally or paste a MongoDB Atlas connection string.

## Endpoints

- `GET /tasks`
- `GET /tasks/:id`
- `POST /tasks`
- `PUT /tasks/:id`
- `DELETE /tasks/:id`
- `POST /contacts` - saves portfolio contact form submissions
- `GET /contacts` - lists saved contact submissions

Example request body:

```json
{
  "title": "Complete Practical 5",
  "description": "Connect Express to MongoDB",
  "priority": "high"
}
```

Contact submissions are stored in the `contacts` collection inside the `task_management` database. To see them in MongoDB Compass, connect to the same URI from `.env`, open `task_management`, and select `contacts`.

The server logs every request with its method, URL, and timestamp. JSON is
required for POST and PUT requests, and malformed task data receives a
structured validation response.