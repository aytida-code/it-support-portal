COMMIT_MESSAGE: Add FastAPI backend for IT support frontend

## Features Added
- Added FastAPI backend entrypoint with health and root endpoints.
- Added PostgreSQL-backed ticket CRUD API matching the frontend's `/api/v1/tickets` contract.
- Added interaction-log APIs for listing, creating, reading, updating, deleting, and listing logs by ticket.
- Added minimal auth API for register, login, and current-user token validation.
- Added frontend reference-data APIs for agents, stores, devices, and escalation rules.
- Seeded initial ticket and interaction-log data from the existing frontend mock data when the database is empty.
- Switched the frontend ticket and log store flags from local mock storage to backend API calls.

## Files Modified
- src/data/store.ts — disabled mock ticket/log flags so frontend data calls use backend API endpoints.
- .env_bc2e33e87c3de2a9 — added DATABASE_URL, JWT_SECRET_KEY, and ACCESS_TOKEN_EXPIRE_MINUTES for backend runtime configuration.

## Files Added
- requirements.txt — Python backend and test dependencies.
- pytest.ini — pytest-asyncio configuration.
- app/__init__.py — backend package initialization and env loading.
- app/database.py — async SQLAlchemy engine, session factory, and DB dependency.
- app/models.py — SQLAlchemy models for users, tickets, and interaction logs.
- app/schemas.py — Pydantic request/response schemas matching frontend JSON fields.
- app/auth.py — password hashing, token creation/validation, and current-user dependency.
- app/crud_utils.py — shared ID, datetime, and response conversion helpers.
- app/static_data.py — reference data and seed data copied from frontend mock data.
- app/main.py — FastAPI app setup, CORS, routers, startup table creation, and seeding.
- app/routers/__init__.py — router package initialization.
- app/routers/auth.py — auth endpoints.
- app/routers/tickets.py — ticket CRUD and ticket interaction-log endpoints.
- app/routers/interaction_logs.py — interaction-log CRUD endpoints.
- app/routers/static.py — agents, stores, devices, and escalation-rule endpoints.
- tests/__init__.py — test package initialization.
- tests/conftest.py — real PostgreSQL async test fixtures using httpx ASGI transport.
- tests/utils/__init__.py — test utility package initialization.
- tests/utils/factories.py — request payload and model factories.
- tests/test_auth.py — auth endpoint tests.
- tests/test_tickets.py — ticket CRUD endpoint tests.
- tests/test_interaction_logs.py — interaction-log endpoint tests.

## Secrets Extracted
- JWT_SECRET_KEY -> written to .env_bc2e33e87c3de2a9
- ACCESS_TOKEN_EXPIRE_MINUTES -> written to .env_bc2e33e87c3de2a9

## DB URLs Resolved
- No existing DB URL found -> postgresql+asyncpg://myuser:mypassword@localhost:5432/gen_6ace0fad92

## Test Results Summary
- 15 PASSED, 0 FAILED, 0 SKIPPED
- Import check: PASSED
- Ruff lint: PASSED
- Real server boot on port 39219: PASSED
