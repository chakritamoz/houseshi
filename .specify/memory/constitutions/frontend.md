<!--
SYNC IMPACT REPORT
==================
Version change: 3.3.0 → 4.0.0

NOTE: User-supplied target version was 3.4.0. Corrected to 4.0.0 per semantic versioning
rules: multiple backward-incompatible rule redefinitions and mass section removals require
a MAJOR bump.

Modified rules:
  - Storybook: "EVERY component MUST have stories" → "Reusable components MUST; trivial/
    internal components MAY skip with justification" — MAJOR relaxation
  - shadcn/ui: "MUST use as base, MUST NOT create from scratch" → "SHOULD use, MAY create
    custom with justification" — MAJOR relaxation
  - Color rules: hardcoded colors absolutely FORBIDDEN → MAY use during development, MUST
    replace before merge — MAJOR relaxation

Added rules: none

Removed sections (MAJOR):
  - Ownership table
  - Scope
  - Technology Stack table
  - Package Manager rules
  - Section 1: Architecture Overview (workspace paths, dependency rules)
  - Section 2: Global Rules (TypeScript strict, naming conventions)
  - Section 3: client workspace rules (routing, responsibilities, file structure)
  - Section 4: component workspace rules (directory structure, component requirements)
  - Section 5: Storybook Rules detail (required story variants, file location)
  - Section 6: Integration workflow and restrictions
  - Section 7: Definition of Done
  - Section 8: Design Principles
  - Section 9: AI Agent Behavior enforcement
  - Section 10: Testing Rules (interaction, a11y, visual, snapshot, coverage, CI, Vitest, test-runner, unit)

Templates requiring updates:
  ✅ .specify/memory/constitutions/frontend.md — this file (v4.0.0)

Follow-up TODOs:
  - ⚠ TypeScript strict mode and naming conventions are no longer documented — confirm
    intentional or add back as a patch.
  - ⚠ Directory structure rules (components/ui/, components/integrations/, pages/, stories/)
    removed — confirm whether these moved to a different doc or are intentionally dropped.
  - ⚠ Testing minimums for frontend (80% coverage) now only exist in constitutions/shared.md
    — ensure teams are aware of that reference.
  - ⚠ CI step order and Storybook build requirements removed — move to CI config docs if
    still required.
  - Audit if Ownership removal is intentional; confirm with Lisa.

Previous report (3.2.0 → 3.3.0):
==================
Version change: 3.2.0 → 3.3.0

Modified principles:
  - Section 2: Added 2.3 Color & Theming Rules (new MANDATORY global rule)
  - Section 9: Enforcement — added color rule enforcement
  - Section 7: DoD Component Layer — added color token compliance check

Added sections:
  - Section 2.3 Color & Theming Rules

Removed sections: none

Templates requiring updates:
  ✅ .specify/memory/constitutions/frontend.md — this file
  ⚠ .specify/memory/constitutions/integration.md — workspace name refs (app/ui) still pending update

Follow-up TODOs:
  - Audit existing components for hardcoded color values (hex, rgb, hsl literals not via CSS vars).
  - Ensure global.css / index.css defines all design token CSS variables before migration.
-->

# Houseshi Constitution — Frontend

## Workspaces

| Workspace   | Technology   | Description              |
|-------------|--------------|--------------------------|
| `client`    | Next.js      | Primary application      |
| `component` | Vite + Storybook | UI component system  |

---

## Rules

### API

- Frontend workspaces MUST NOT call backend APIs directly.
- All backend communication is handled by the integration layer only.
- Refer to `constitutions/integration.md` for all API and service layer rules.

---

### Color Rules

- Components MUST use CSS variables (design tokens) in production code.
- Hardcoded color values (hex, rgb, hsl, named colors, Tailwind arbitrary values) MAY be
  used temporarily during development.
- All hardcoded color values MUST be replaced with CSS variables before merging.

---

### Components

- SHOULD use shadcn/ui as the base component library.
- MAY create custom base components when no suitable shadcn/ui equivalent exists; MUST
  document the justification in the relevant `plan.md` under **Complexity Tracking**.

---

### Storybook

- Reusable components MUST have Storybook stories.
- Trivial or internal-only components MAY skip stories; justification MUST be documented
  in the component file or PR description.

---

### Restrictions

Components MUST NOT:

- Call backend APIs.
- Contain business logic.
- Use global state.

---

**Version**: 4.0.0 | **Ratified**: 2026-03-23 | **Last Amended**: 2026-04-22
