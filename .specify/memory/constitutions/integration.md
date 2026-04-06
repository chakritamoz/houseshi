# Houseshi Constitution — Integration

## Ownership

| Role             | Name | Scope                                 |
|------------------|------|---------------------------------------|
| Integration Lead | Alex | All frontend–backend integration work |

Alex is the designated owner of all integration concerns: API contract design, service layer
implementation, authentication wiring, error handling across boundaries, and enforcement of
this constitution. Integration work MUST be reviewed and approved by Alex before merging.

## Scope

This constitution governs the integration layer between:

- **Frontend** (`app` workspace — Next.js), governed by `constitutions/frontend.md`
- **Backend** (Django REST Framework), governed by `constitutions/backend.md`

Frontend and Backend engineers MUST NOT independently implement cross-boundary concerns.
All integration work is owned by Alex.

---

# 1. Service Layer (Frontend → Backend)

The service layer resides in the `app` workspace and is owned exclusively by the integration
team.

## 1.1 Location

```
/services
  user.service.ts
  auth.service.ts
  <domain>.service.ts
```

## 1.2 Responsibilities

- All HTTP calls to the backend MUST go through the service layer.
- MUST NOT call backend APIs directly inside React components or pages.
- MUST handle and transform errors at the service boundary before propagating to UI.
- MUST return typed responses matching the agreed API contract shapes.

## 1.3 Rules

- Service layer is the ONLY point of contact between the `app` workspace and the backend.
- All service functions MUST have TypeScript return types matching the corresponding Django
  serializer schema.
- Error responses from the backend MUST be mapped to typed frontend error objects before
  returning; raw backend error payloads MUST NOT reach UI components.
- Mock implementations MUST be maintained alongside real implementations and MUST conform to
  the same TypeScript types.

---

# 2. API Contract

## 2.1 Contract Definition

- API contracts MUST be defined and agreed upon before implementation begins.
- Contracts MUST be documented in the relevant `spec.md` under an **API Contract** section.
- Both frontend and backend teams MUST sign off on the contract before any code is written.

## 2.2 Contract Rules

- Request/response shapes MUST be typed in TypeScript (frontend) and validated by Django
  serializers (backend).
- Breaking changes to an existing API contract MUST be communicated to all parties before
  implementation and reflected in a version increment.
- Versioned API paths (e.g. `/api/v2/`) MUST document the version bump rationale in the spec.

## 2.3 Mock-First Development

- Frontend MUST develop against mock data first, using types derived from the agreed contract.
- When the backend endpoint is ready, the service layer switches from mock to real API.
- UI components MUST require zero changes when switching from mock to real service.

---

# 3. Authentication

- Authentication token storage, refresh logic, and injection into API requests are
  integration concerns owned by Alex.
- The `app` workspace handles authentication UI (login/logout flows), but token lifecycle
  is implemented in the service layer.
- Frontend components MUST NOT handle tokens directly.
- Backend authentication rules are defined in `constitutions/backend.md`.

---

# 4. Error Handling

- All backend errors MUST be caught and transformed in the service layer.
- MUST NOT expose raw backend error messages or status codes to UI components.
- Error types MUST be defined as TypeScript types or enums in the service layer.
- UI components receive only typed, user-friendly error information from the service layer.

---

# 5. Testing

## 5.1 Contract Testing

- Integration MUST include contract tests verifying that frontend service calls match the
  agreed backend API shapes (request structure, response fields, status codes).
- Contract tests MUST run in CI and block merges on failure.

## 5.2 Scope

- Unit tests for all service layer functions: REQUIRED.
- End-to-end tests covering key user flows (authenticated + unauthenticated): REQUIRED.
- Mock implementations MUST be validated against real contract shapes in tests.

## 5.3 Enforcement in CI

| Setting       | Value                                        |
|---------------|----------------------------------------------|
| Framework     | Vitest (frontend) + pytest (backend)         |
| CI integration| Required                                     |
| Block on fail | Yes — failing contract tests block all merges|

---

# 6. Definition of Done

A feature is considered integration-complete when:

- Service layer functions exist for every backend endpoint consumed by the feature.
- All service functions are fully typed (no `any`).
- Authentication is wired through the service layer for protected endpoints.
- Contract tests pass for all new/modified endpoints.
- No backend API calls exist outside the service layer.
- Mock → real service switch requires no changes to UI components.

---

# 7. Enforcement (AI Agent Behavior)

When generating integration code, AI MUST:

- Place all backend API calls in the service layer — never in components or pages.
- Use TypeScript types that exactly match backend serializer schemas.
- Handle all error cases in the service layer before returning to UI.
- Keep authentication token logic in the service layer.
- Generate contract tests alongside service implementations.

If a violation is detected:

- MUST refactor instead of bypassing rules.
- MUST NOT leave untyped API calls in components as "temporary" code.

---

## Governance

This constitution governs all work that crosses the frontend–backend boundary. Amendments
require:

1. A documented rationale for the change.
2. A version bump following semantic versioning:
   - **MAJOR**: Removal or redefinition of ownership, contract rules, or integration patterns.
   - **MINOR**: New integration pattern, section, or materially expanded guidance.
   - **PATCH**: Clarifications, wording improvements, typo fixes.
3. Sign-off from Alex (Integration Lead) before ratification.
4. Sync review of `constitutions/frontend.md` and `constitutions/backend.md` for alignment.

**Version**: 1.0.0 | **Ratified**: 2026-04-06 | **Last Amended**: 2026-04-06
