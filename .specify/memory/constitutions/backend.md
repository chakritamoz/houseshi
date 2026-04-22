<!--
SYNC IMPACT REPORT
==================
Version change: 2.1.0 → 3.0.0

NOTE: User-supplied target version was 2.2.0. Corrected to 3.0.0 per semantic versioning
rules: multiple backward-incompatible governance and rule changes require a MAJOR bump.

Modified sections:
  - Technology Stack: unchanged in substance; simplified presentation
  - Clean Architecture flow diagram: unchanged
  - Section 3 (Core Rules): condensed from 3.1–3.4 subsections to flat bullet rules
  - Section 6 (Testing Rules): coverage threshold changed from fixed 90% → tiered MVP/Prod;
    endpoint rule downgraded from "every endpoint MUST" → "critical MUST, others SHOULD"

Added sections:
  - Simplicity Exception (between Clean Architecture and Core Rules)

Removed sections:
  - Ownership table — MAJOR governance change
  - Tech Stack "Rules" sub-section — content condensed into stack declaration
  - Section 2 (Component details 2.1–2.10) — MAJOR: detailed layer descriptions removed
  - Section 4 (Definition of Done) — MAJOR: removed
  - Section 5 (AI Agent Behavior enforcement) — removed
  - Section 6.3 (Enforce Authentication) — ⚠ SIGNIFICANT: per-endpoint auth enforcement
    rule removed; recommend reinstating or moving to constitutions/shared.md
  - Section 6.7 (CI enforcement table) — CI specifics removed; recommend moving to
    constitutions/shared.md or CI config docs

Templates requiring updates:
  ✅ .specify/memory/constitutions/backend.md — this file (v3.0.0)
  ⚠ .specify/memory/constitutions/shared.md — CI enforcement and auth rules should be
    added here

Follow-up TODOs:
  - Reinstate or relocate 6.3 Enforce Authentication rule (allowlisted endpoints) — this
    was a security-critical rule that was not explicitly deprecated.
  - Move CI enforcement specifics (pytest command, block-on-fail) to shared.md.
  - Confirm with David that Ownership removal is intentional.
-->

# Houseshi Constitution — Backend

## Technology Stack

The following backend stack is mandatory for all features. Introducing a technology outside
this list requires documented justification in the relevant `plan.md` under
**Complexity Tracking**.

| Layer    | Technology                     | Version Policy              |
|----------|--------------------------------|-----------------------------|
| Backend  | Django + Django REST Framework | LTS / latest stable release |
| Database | PostgreSQL                     | LTS / latest stable release |

---

# Clean Architecture

```
View → Usecase → Repository → Model
               ↘ Service
               ↘ Adapter
```

---

## Simplicity Exception

For simple CRUD operations the full architecture MAY be relaxed:

- MAY skip Service layer.
- MAY combine Usecase + Repository into a single layer.

**Requirement**: Any relaxation MUST be justified in the relevant `plan.md` under
**Complexity Tracking**.

---

## Core Rules

- Business logic MUST reside in Usecase or Service only.
- Database access MUST go through Repository only.
- External service calls MUST go through Adapter only.

---

## Testing Rules

### Coverage

| Stage      | Minimum Coverage |
|------------|-----------------|
| MVP        | ≥ 70%           |
| Production | ≥ 85–90%        |

### Endpoint Testing

- Critical endpoints MUST have tests.
- All other endpoints SHOULD have tests.

### Security

- Responses MUST NOT contain sensitive fields (e.g. `password`, `token`, `secret`).
- No endpoint MUST return a `5xx` response under any test scenario.

---

**Version**: 3.0.0 | **Ratified**: 2026-03-23 | **Last Amended**: 2026-04-22
