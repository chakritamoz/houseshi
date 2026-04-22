<!--
SYNC IMPACT REPORT
==================
Version change: 1.0.0 → 2.0.0

Modified sections:
  - Error Handling: condensed envelope detail; added "MUST log internally" rule

Added sections:
  - Typing

Removed sections (MAJOR):
  - Ownership table
  - Workspace Naming Conventions — ⚠ SIGNIFICANT: this section was created to resolve
    the pending TODO in constitution.md v1.4.0 (canonical names: client, component, api).
    Removal means canonical workspace names are no longer documented anywhere.
    Recommend reinstating in a docs file or in constitution.md directly.
  - Versioning Standards — ⚠ SIGNIFICANT: API versioning rules (/api/v1/) removed.
    Recommend moving to constitutions/integration.md or a dedicated API standards doc.
  - Testing Minimums table — replaced by Testing Philosophy

Templates requiring updates:
  ✅ .specify/memory/constitutions/shared.md — this file (v2.0.0)

Follow-up TODOs:
  - ⚠ Canonical workspace names (client / component / api) are now undocumented.
    Reinstate in shared.md, constitution.md, or a dedicated workspace-conventions doc.
  - ⚠ API versioning standard (/api/v1/) is now undocumented. Reinstate in
    constitutions/integration.md or a dedicated API standards doc.
  - Domain-specific coverage minimums (Backend 80%, Frontend 70%, Integration 60%) have
    been replaced by general philosophy; confirm specific thresholds are captured in
    each domain constitution or CI config.
-->

# Houseshi Constitution — Shared

## Purpose

Define cross-domain shared rules applicable to all teams (frontend, backend, integration).
Every team MUST comply. Conflicts between this file and a domain constitution MUST be
escalated and resolved before proceeding — do not silently override.

---

## Error Handling

- MUST NOT expose raw errors to callers or end users.
- Error responses MUST be mapped to a safe, structured format before crossing a domain
  boundary.
- All errors MUST be logged internally with sufficient context for diagnosis.

---

## Typing

- All code MUST use strict typing.
- Untyped or loosely typed data (e.g., `any` in TypeScript, untyped dicts in Python) MUST
  NOT be used without explicit documented justification.

---

## Testing Philosophy

- Tests MUST verify observable behavior, not internal implementation details.
- Critical paths MUST have test coverage.
- Tests SHOULD be written to be maintainable — avoid brittle assertions tied to
  implementation internals.

---

**Version**: 2.0.0 | **Ratified**: 2026-04-22 | **Last Amended**: 2026-04-22
