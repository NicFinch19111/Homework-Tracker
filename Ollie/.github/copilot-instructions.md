# Task Scheduling & Allocation App for Engineers

## Project Overview
Task scheduling and allocation system for engineers working on "below ground" and "above ground" work categories.

## Tech Stack
- **Backend**: Express + TypeScript (ES2020 target, CommonJS modules)
- **Database**: SQLite (direct `sqlite3` package, callback-based API)
- **Auth**: JWT tokens via `jsonwebtoken`, passwords hashed with `bcryptjs`
- **Validation**: `express-validator` for request validation

## Architecture & Key Patterns

### Database Layer (`backend/src/database/init.ts`)
- **Direct SQLite usage** - no ORM, use raw SQL with callbacks
- **Schema-first approach** - tables created via `CREATE TABLE IF NOT EXISTS` in `initializeDatabase()`
- **Singleton database connection** - `export const db` provides shared connection
- **Key tables**: `users`, `engineers`, `tasks` (with `category` enum: `below_ground`|`above_ground`), `task_assignments`
- Tasks have `required_skills` (TEXT), engineers have `skills` (TEXT) - stored as comma-separated or JSON strings
- Tasks require `location` field (TEXT) for geographical scheduling and `due_date` (DATETIME) for time-based prioritization

### API Structure (backend)
- **Route organization**: `src/routes/{auth,engineers,tasks}.ts` - separate routers per domain
- **Middleware**: Global error handler at `src/middleware/errorHandler.ts`
- **Base path**: All routes prefixed with `/api` (e.g., `/api/auth`, `/api/engineers`, `/api/tasks`)
- **Health check**: `/health` endpoint returns `{ status, timestamp }`

### TypeScript Configuration
- Target: ES2020, output: CommonJS
- Strict mode enabled
- Output to `dist/`, sources in `src/`

## Development Workflow

### Running the backend
```bash
cd backend
npm run dev      # Development with nodemon (auto-restart)
npm run build    # Compile TypeScript to dist/
npm start        # Run compiled JS from dist/
```

### Environment Setup
Copy `.env.example` to `.env` and configure:
- `PORT` - Server port (default: 3000)
- `JWT_SECRET` - **Must change in production**
- `DATABASE_PATH` - SQLite file path (default: `./database.sqlite`)

### Database Initialization
Database tables are automatically created on server start via `initializeDatabase()` called in `src/index.ts`.

## Project-Specific Conventions

### Task Categories
Tasks **must** have a `category` field with CHECK constraint: `'below_ground'` or `'above_ground'`. This is a domain-specific requirement for work categorization.

### Skills Matching
Both engineers and tasks have skills fields (TEXT). **Skill-to-category rules**:
- **Below ground tasks** → require `mechanical` skill
- **Above ground tasks** → require one of: `technician`, `electrician`, or `cni`

When assigning tasks, verify engineers have the appropriate skill for the task's category.

### Task Scheduling Logic
Tasks are planned based on:
- **Location** - geographical proximity for efficient routing
- **Due date** - prioritize tasks approaching deadlines

### Assignment Tracking
Use `task_assignments` table to maintain history of all task assignments, including completion timestamps. The `tasks.assigned_to` field shows current assignment only.

### Error Handling Pattern
All routes should use the centralized error handler middleware. Throw or pass errors to `next()` for consistent error responses.

### API Design
- Follow RESTful conventions
- Use `express-validator` for input validation
- Return consistent JSON responses
- Use HTTP status codes appropriately

## Status
**Early stage development** - Database schema exists, but route handlers, middleware, controllers, and frontend need implementation.
