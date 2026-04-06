# Houseshi Constitution — Backend

## Ownership

| Role         | Name  | Scope                          |
|--------------|-------|--------------------------------|
| Backend Lead | David | All backend work and decisions |

David is the designated owner of all backend concerns: architecture decisions, code review,
dependency approvals, and enforcement of this constitution.

## Technology Stack

The following backend stack is mandatory for all features. Introducing a technology outside
this list requires an explicit, documented justification recorded in the relevant `plan.md`
under **Complexity Tracking**.

| Layer    | Technology                     | Version Policy              |
|----------|--------------------------------|-----------------------------|
| Backend  | Django + Django REST Framework | LTS / latest stable release |
| Database | PostgreSQL                     | LTS / latest stable release |

## Rules

- MUST use only the technologies listed above for backend work.
- MUST NOT introduce additional backend frameworks or ORMs without documented justification.
- All selected versions MUST be LTS or latest stable; EOL releases are prohibited.
- When multiple valid approaches exist, the simpler and more maintainable option MUST be chosen.
- All API endpoints MUST be implemented via Django REST Framework; raw Django views are
  prohibited for API surfaces.

---

# Clean Architecture (Django REST Framework)

Reference: Robert C. Martin (Uncle Bob)

---

## 1. Project Structure

```
app/
├── models/
├── managers/
├── repositories/
├── usecases/
├── services/
├── serializers/
├── views/
├── adapters/
├── exceptions/
```

---

## 2. Components

### 2.1 Model

- Defines data structure only.
- MUST NOT contain heavy business logic.

### 2.2 Manager

- Handles query/filter/helper logic scoped to its own model only.
- MUST NOT contain cross-model business logic.

### 2.3 Repository ⭐

- Abstraction layer over Manager / ORM for data access.
- MUST be used as the only entry point for database operations from usecases.
- **Why**: decouples business logic from database, simplifies testing, enables future DB changes.

### 2.4 Usecase

- Owns all business logic for a given operation.
- MAY coordinate multiple models via repositories.
- Is the central orchestrator of the system.

### 2.5 Service (Domain Service) ⭐

- Contains logic that does not belong to any single model.
- Examples: payment calculation, complex business rules.

### 2.6 Serializer

- Validates and transforms request/response data.
- ALLOWED: validation, data transformation.
- MUST NOT contain business logic.

### 2.7 View (Controller)

- Accepts requests and returns responses.
- Delegates all processing to usecases.
- MUST NOT contain business logic.

### 2.8 Adapter (External Services) ⭐

- Connects to third-party services (e.g. Prefect, payment gateways, external APIs).
- MUST NOT call third-party services directly from views or usecases.
- All external calls MUST go through an adapter.

### 2.9 Exception Handling ⭐

- Custom exceptions MUST be defined (e.g. `BusinessError`, `ValidationError`).
- Views are responsible for mapping exceptions → HTTP responses.
- MUST NOT leak raw exceptions to the API response.

### 2.10 Dependency Injection

- Dependencies MUST be injected into usecases — MUST NOT be hardcoded.
- **Why**: reduces coupling, simplifies testing.

---

## 3. Core Rules

### 3.1 Dependency Direction

```
View → Usecase → Repository → Model
               ↘ Service
               ↘ Adapter
```

- MUST NOT have reverse dependencies.

### 3.2 Business Logic Placement

- ✅ ALLOWED: Usecase, Service
- ❌ FORBIDDEN: View, Serializer, Model, Manager

### 3.3 External Access

- Database access → Repository only
- External API access → Adapter only

### 3.4 Single Responsibility

- Each layer MUST have exactly one responsibility.
- Mixing responsibilities across layers is FORBIDDEN.

---

## 4. Definition of Done

- All business logic lives in Usecase or Service.
- All DB access goes through Repository.
- All external calls go through Adapter.
- Custom exceptions used and mapped in View.
- Dependencies injected (not hardcoded).

---

## 5. Enforcement (AI Agent Behavior)

When generating backend code, AI MUST:

- Place business logic in Usecase or Service — never in View or Serializer.
- Route all DB access through Repository.
- Route all third-party calls through Adapter.
- Define custom exceptions and map them in View.
- Use dependency injection for Usecase dependencies.

If violation detected:

- MUST refactor instead of bypassing rules.

---

## 6. Testing Rules

All backend code MUST comply with the following test case rules. These rules are enforced in CI
and block merging on failure.

### 6.1 Every Endpoint Must Have a Test

- **ID**: `every_endpoint_must_have_test`
- Every endpoint declared in the Django URL resolver MUST have at least one test covering it.
- **Enforcement**: static analysis — scan URL patterns and cross-reference against the test suite.
- **Fail condition**: any endpoint found with no reference in the test suite.

### 6.2 Minimum Test Coverage

- **ID**: `minimum_test_coverage`
- Project-wide coverage MUST NOT fall below **90%**.
- **Tool**: `coverage.py` via `pytest --cov=. --cov-fail-under=90`
- **Fail condition**: coverage report below threshold.

### 6.3 Enforce Authentication

- **ID**: `enforce_authentication`
- Every endpoint MUST require authentication, except those on the allowlist.
- **Allowlisted (unauthenticated) endpoints**:
  - `/api/auth/login/`
  - `/api/auth/register/`
- **Enforcement**: runtime test — send unauthenticated request to each non-allowlisted endpoint.
- **Fail condition**: endpoint returns `200` without authentication.

### 6.4 No Internal Server Error

- **ID**: `no_internal_server_error`
- No endpoint MUST return a `5xx` response under any test scenario.
- **Enforcement**: runtime test — exercise all endpoints and inspect status codes.
- **Fail condition**: `response.status_code >= 500`.

### 6.5 Response Schema Consistency

- **ID**: `response_schema_consistency`
- Every response MUST match the schema defined by its serializer.
- **Enforcement**: runtime test — validate response fields against expected serializer schema.
- **Fail condition**: response contains fields not present in, or missing fields required by, the schema.

### 6.6 No Sensitive Data Leak

- **ID**: `no_sensitive_data_leak`
- Responses MUST NOT contain sensitive fields such as `password`, `token`, or `secret`.
- **Enforcement**: runtime test — scan all response keys for forbidden field names.
- **Fail condition**: a forbidden field is found in any response body.

### 6.7 Execution & CI

| Setting        | Value                                  |
|----------------|----------------------------------------|
| Test runner    | `pytest`                               |
| Command        | `pytest --cov=. --cov-fail-under=90`   |
| CI integration | required                               |
| Block on fail  | yes — failing tests block all merges   |

---

**Version**: 2.1.0 | **Ratified**: 2026-03-23 | **Last Amended**: 2026-04-06
