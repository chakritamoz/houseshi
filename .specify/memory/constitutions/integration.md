<!--
SYNC IMPACT REPORT
==================
Version change: 1.0.0 → 2.0.0

Modified sections:
  - Ownership: table + paragraph → bullet format; added "approved reviewer" path
  - Scope: workspace name `app` → `client` (resolves pending TODO from constitution.md v1.4.0)
  - Section 1 (Service Layer): restructured from 1.1/1.2/1.3 subsections; added server-side Exception clause
  - Section 2 (API Contract): removed 2.3 Mock-First (elevated to standalone Section 3)
  - Section 3 (Mock-First Development): elevated from 2.3; rule relaxed from MUST zero-changes → SHOULD minimal changes
  - Section 4 → 4 (Authentication): simplified, unchanged in substance
  - Section 5 → 5 (Error Handling): simplified, unchanged in substance
  - Section 6 → 6 (Testing): simplified; CI enforcement table and framework specifics removed
  - Section 7 (DoD): renumbered from 6; condensed to 5 items

Removed sections:
  - Section 7 (AI Agent Behavior) — MINOR: enforcement guidance removed
  - Governance — MAJOR: local governance rules removed; governance now inherited from constitution.md

Templates requiring updates:
  ✅ .specify/memory/constitutions/integration.md — this file (v2.0.0)
  ⚠ .specify/memory/constitutions/frontend.md — workspace naming (`app`/`ui` refs) still pending

Follow-up TODOs:
  - Align frontend.md workspace naming to canonical `client` (per shared.md).
  - Confirm with Alex that local Governance removal is intentional; governance now defers to constitution.md.
  - CI enforcement specifics (Vitest/pytest, block-on-fail) should move to constitutions/shared.md or CI config docs.
-->

# Houseshi Constitution — Integration

## Ownership

All integration work MUST be reviewed and approved by:

- Integration Lead (Alex), OR
- At least one approved integration reviewer

---

## Scope

This constitution governs the integration layer between:

- **Frontend** (`client` workspace — Next.js), governed by `constitutions/frontend.md`
- **Backend** (Django REST Framework), governed by `constitutions/backend.md`

Frontend and Backend engineers MUST NOT independently implement cross-boundary concerns.
All integration work is owned by Alex.

---

# 1. Service Layer

The service layer resides in the `client` workspace and is owned exclusively by the
integration team.

## Location

```
/services
  user.service.ts
  auth.service.ts
  <domain>.service.ts
```

## Rules

- All backend calls MUST go through the service layer.
- MUST NOT call backend APIs directly inside UI components or pages.
- MUST handle and transform errors at the service boundary before propagating to UI.
- MUST return typed responses matching the agreed API contract shapes.
- All service functions MUST have TypeScript return types matching the corresponding Django
  serializer schema.
- Mock implementations MUST be maintained alongside real implementations and MUST conform to
  the same TypeScript types.

### Exception

Server-side logic (e.g., Next.js server components or API routes) MAY call the backend via
a service abstraction rather than direct HTTP, provided the abstraction is typed and owned
by the integration team.

---

# 2. API Contract

- Contracts MUST be defined and agreed upon before implementation begins.
- Contracts MUST be documented in the relevant `spec.md` under an **API Contract** section.
- Request/response shapes MUST be typed in TypeScript (frontend) and validated by Django
  serializers (backend).
- Breaking changes MUST be versioned; see `constitutions/shared.md` for versioning rules.

---

# 3. Mock-First Development

- Frontend MUST start with mock data using types derived from the agreed contract.
- The service layer switches from mock to real API when the backend endpoint is ready.

### Rule

UI components SHOULD require minimal or no changes when switching from mock to real service.

---

# 4. Authentication

- Token storage, refresh logic, and request injection are integration concerns owned by Alex.
- Token lifecycle MUST be implemented in the service layer.
- UI MUST NOT handle tokens directly.
- Backend authentication rules are defined in `constitutions/backend.md`.

---

# 5. Error Handling

- All backend errors MUST be caught and transformed in the service layer.
- MUST NOT expose raw backend error payloads to UI components.
- Error types MUST be defined as TypeScript types or enums in the service layer.
- See `constitutions/shared.md` for the canonical error envelope schema.

---

# 6. Testing

- Contract tests verifying service calls match backend API shapes: REQUIRED.
- Unit tests for all service layer functions: REQUIRED.
- E2E tests covering key user flows (authenticated + unauthenticated): REQUIRED.
- Mock implementations MUST be validated against real contract shapes in tests.
- Contract tests MUST run in CI and block merges on failure.

---

# 7. Definition of Done

A feature is integration-complete when:

- Service layer functions exist for every backend endpoint consumed by the feature.
- All service functions are fully typed (no `any`).
- Contract tests pass for all new/modified endpoints.
- Authentication is wired through the service layer for protected endpoints.
- No backend API calls exist outside the service layer.

---

**Version**: 2.0.0 | **Ratified**: 2026-04-06 | **Last Amended**: 2026-04-22
