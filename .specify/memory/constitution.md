<!--
SYNC IMPACT REPORT
==================
Version change: 1.3.0 → 1.4.0

Modified sections:
  - Core Principles: Added IV. Priority of Principles
  - Domain-Specific Constitutions table: added constitutions/shared.md row
  - Governance: Added Deprecation Policy subsection
  - Style: Added section dividers (---); tightened principle formatting

Added sections:
  - IV. Priority of Principles
  - Deprecation Policy (under Governance)

Removed sections: none

Templates requiring updates:
  ✅ .specify/memory/constitution.md — this file (v1.4.0)
  ✅ .specify/memory/constitutions/shared.md — created (v1.0.0)
  ⚠ .specify/memory/constitutions/frontend.md — workspace naming alignment pending
  ⚠ .specify/memory/constitutions/integration.md — workspace name refs (app/ui) pending update

Follow-up TODOs:
  - Align workspace naming across frontend.md and integration.md (app vs ui).
  - Audit CI rules for updated coverage thresholds.
  - ⚠ Canonical workspace names (client / component / api) removed from shared.md v2.0.0 —
    reinstate in shared.md, constitution.md, or a dedicated workspace-conventions doc.
  - ⚠ API versioning standard (/api/v1/) removed from shared.md v2.0.0 — reinstate in
    constitutions/integration.md or a dedicated API standards doc.

---

Previous report (1.2.0 → 1.3.0):
==================
Version change: 1.2.0 → 1.3.0

Modified sections:
  - Domain-Specific Constitutions table: integration.md row added

Added sections: none (table row only)
Removed sections: none

Templates requiring updates:
  ✅ .specify/memory/constitution.md — this file
  ✅ .specify/memory/constitutions/frontend.md — ownership + scope updated (v3.0.0)
  ✅ .specify/memory/constitutions/integration.md — created (v1.0.0)

Follow-up TODOs:
  - Existing frontend code that owns API service calls must be migrated to the integration layer.

---

Previous report (1.1.0 → 1.2.0):
==================
Version change: 1.1.0 → 1.2.0

Modified sections: Merged constitutions/global.md back into constitution.md

Added: Purpose, Core Principles, Development Rules & Output Standards, Governance sections
Removed: constitutions/global.md (content merged here); index table row for global.md

Templates requiring updates:
  ✅ .specify/memory/constitution.md — merged global content (this file)
  ✅ .specify/memory/constitutions/global.md — deleted
  ✅ .specify/memory/constitutions/frontend.md — no change required
  ✅ .specify/memory/constitutions/backend.md — no change required

Follow-up TODOs: None
-->

# Houseshi Constitution

## Purpose

เพื่อให้ระบบสร้าง spec และคำตอบที่ชัดเจน ถูกต้อง และใช้งานได้จริง
(To enable the system to produce clear, accurate, and immediately actionable specs and answers.)

---

## Core Principles

### I. Clarity Over Length

Responses and specs MUST prioritize clarity over comprehensiveness.

- Use bullet points when explaining multiple items.
- Use plain, accessible language.
- Every output MUST be actionable — the reader can apply it immediately without further clarification.

**Rationale**: Verbose output increases cognitive overhead and obscures the signal. Actionable
clarity reduces rework and misunderstanding downstream.

---

### II. Honesty Over Assumptions

- Agents MUST NOT fabricate data, facts, or references when none exist.
- If information is insufficient, the agent MUST explicitly state uncertainty and ask for
  clarification before proceeding.
- Guessing is prohibited.

**Rationale**: Incorrect assumptions cascade into incorrect specs and implementations. A
transparent "I don't know" is always safer than a confident wrong answer.

---

### III. Reasoned Responses

- Every significant decision or recommendation MUST be accompanied by a rationale.
- Decisions without justification MUST be challenged during review.

**Rationale**: Traceable reasoning allows reviewers to identify flawed premises early and
supports knowledge transfer across team members.

---

### IV. Priority of Principles

When principles conflict, resolve in the following order:

1. Correctness > Clarity
2. Clarity > Completeness
3. Simplicity > Flexibility

**Rationale**: Explicit conflict resolution eliminates ambiguity when agents must trade off
competing values. Correctness is non-negotiable; unnecessary complexity is always a last resort.

---

## Development Rules & Output Standards

### Scope Compliance

- Agents MUST NOT answer or generate content outside the scope of the active spec.
- Requirements not present in the spec MUST be flagged explicitly, not assumed.

---

### Data Integrity

- Facts stated in outputs MUST have a traceable source or be explicitly marked as inference.
- When uncertain, the agent MUST declare uncertainty rather than speculate.

---

### Decision Guidelines

- When multiple valid solutions exist, choose the simplest and most maintainable option.
- When information is insufficient to make a decision, ask for clarification before proceeding.

---

### Output Formatting

- Use bullet points for multi-item explanations.
- Use plain, accessible language.
- Every output MUST be actionable — the reader can apply it without additional context.

---

## Domain-Specific Constitutions

Domain stack rules are defined in the following files. All files carry equal authority;
agents MUST comply with every applicable constitution for their domain.

| File                               | Scope                                       |
|------------------------------------|---------------------------------------------|
| [constitutions/frontend.md](constitutions/frontend.md) | Next.js (TypeScript) and Tailwind CSS stack |
| [constitutions/backend.md](constitutions/backend.md)   | Django, DRF, and PostgreSQL stack           |
| [constitutions/integration.md](constitutions/integration.md) | Frontend–backend API integration layer |
| [constitutions/shared.md](constitutions/shared.md)     | Cross-domain shared rules                   |

---

## Governance

This constitution supersedes all other project practices and agent instructions where they
conflict. Amendments require:

1. A documented rationale for the change.
2. A version bump following semantic versioning:
   - **MAJOR**: Removal or redefinition of a principle; backward-incompatible governance change.
   - **MINOR**: New principle, section, or materially expanded guidance added.
   - **PATCH**: Clarifications, wording improvements, typo fixes.
3. A Sync Impact Report (as an HTML comment at the top of this file) listing all affected
   templates and artifacts.
4. All dependent templates MUST be reviewed and updated before the amendment is ratified.

### Deprecation Policy

- Deprecated rules MUST remain in effect for at least one MINOR version before removal.
- Removal of a deprecated rule requires a MAJOR version bump.
- Every deprecation notice MUST include a documented rationale and a replacement rule
  (if applicable).

All PRs and spec reviews MUST verify compliance with the principles in this document.
Domain-specific deviations from the defined tech stacks MUST be justified in the relevant
`plan.md` under **Complexity Tracking**.

**Version**: 1.4.0 | **Ratified**: 2026-03-23 | **Last Amended**: 2026-04-22
