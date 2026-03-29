# Houseshi Constitution — Backend

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

**Version**: 2.0.0 | **Ratified**: 2026-03-23 | **Last Amended**: 2026-03-25
