# Commit history

feat(api): scaffold Express + PostgreSQL API with full event CRUD support

- initialize TypeScript project with strict compiler settings
- create initial PostgreSQL schema with `events` table
- implement full CRUD controller logic (create, read, delete)
- add RESTful routes for events, including batch insert and full delete
- configure project structure with middleware, config, router, and db pool
- set up scripts for linting, formatting, and type-checking
- configure ESLint and Prettier with TypeScript + import-ordering rules
- add environment variable validation for DB config

refactor(api): restructure events table and update controller logic

- Dropped old events table and created a new one with updated schema
- Added "league", "team_name", and "event_name" columns
- Added CORS middleware to enable cross-origin requests
- Extracted column names into a reusable array for cleaner SQL construction
- Updated controller functions to match new table schema
