# Project Gantt & timeline

This file explains the project timeline shown in `GANTT.mmd` (Mermaid Gantt). The plan is scoped to finalize docs, add developer conveniences, implement basic CI/tests, and prepare a release.

High-level phases and rationale
- Documentation (done/near-done): architecture, API, DB schema, quickstart, diagrams.
- Developer Experience: small helpers and health endpoints to make local dev & CI reliable.
- CI / Tests: add linting, unit/integration tests, and OpenAPI generation for client/server integration.
- Release: QA, deploy, and monitor.

Task list (summary)
- Project kickoff & repo review — 2 days (review codebase and docs)
- Architecture — completed (ARCHITECTURE.MD)
- DB Schema — completed (DB_SCHEMA.MD)
- API Reference — completed (API.MD)
- Quickstart — completed (QUICKSTART.MD)
- Diagrams — create mermaid/plantuml sources and render SVGs
- .env examples — produce `.env.example` files for `client/` and `server/`
- GET /health — add a health endpoint and document it
- Seeder — small script to insert sample data into the local DB for dev/testing
- CI pipeline — lint/test/build steps (GitHub Actions recommended)
- Tests — add unit + integration tests (Jest + supertest, Vitest for client)
- OpenAPI/Swagger — generate an OpenAPI spec from controllers or manually author it
- Pre-release QA & docs finalization — finalize docs, fix outstanding items
- Release & deploy — push and monitor stable release

Dependencies and ordering notes
- Diagrams should be created before embedding into docs.
- CI requires seeders/tests to produce meaningful pipeline results.
- OpenAPI generation should be completed before API client generation or published API docs.

How to render the Gantt
- In VS Code: install the "Mermaid Markdown Syntax Highlighting" or any Mermaid preview extension and open `GANTT.mmd`.
- Mermaid CLI: `mmdc -i docs/GANTT.mmd -o docs/GANTT.svg` (requires `@mermaid-js/mermaid-cli`).

Adjusting the plan
- These dates are a suggested schedule. To shorten timeline, parallelize CI/tests and seeder tasks.

If you want, I can:
- Generate `docs/GANTT.svg` and commit it to `docs/`.
- Create `.github/workflows/ci.yml` skeleton that runs lint/test/build and renders diagrams.
