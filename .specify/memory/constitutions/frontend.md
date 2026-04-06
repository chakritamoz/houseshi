<!--
SYNC IMPACT REPORT
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

## Ownership

| Role          | Name | Scope                              |
|---------------|------|------------------------------------|
| Frontend Lead | Lisa | All frontend UI work and decisions |

Lisa is the designated owner of all frontend concerns: UI architecture, component design,
Storybook coverage, styling, and enforcement of this constitution. Frontend work MUST NOT
include backend API integration — that is owned by the Integration team and governed by
`constitutions/integration.md`.

## Scope

Frontend Architecture (Multi-Workspace)

## Technology Stack

The following frontend stack is mandatory for all features. Introducing a technology outside
this list requires an explicit, documented justification recorded in the relevant `plan.md`
under **Complexity Tracking**.

| Layer              | Technology           | Version Policy              |
|--------------------|----------------------|-----------------------------|
| Framework          | Next.js (TypeScript) | LTS / latest stable release |
| Component System   | Vite + Storybook (TypeScript) | Latest stable release  |
| Base UI Components | shadcn/ui            | Latest stable release       |
| Styling            | Tailwind CSS         | Latest stable release       |

## Package Manager

- MUST use: pnpm
- MUST use: pnpm workspace (monorepo)

---

# 1. Architecture Overview

Frontend MUST be split into 2 workspaces:

## 1.1 Workspace: client

- Path: `web/client/`
- Framework: Next.js (App Router only)
- Responsibility:
  - Routing
  - Authentication (UI-side flows: login/logout pages)
  - Page composition — MUST call Page components from `component/src/pages/` only
- NOT RESPONSIBLE FOR:
  - API calls to backend
  - Server actions connecting to backend
  - Service layer implementation

> API integration is owned by the Integration team. See `constitutions/integration.md`.

## 1.2 Workspace: component

- Path: `web/component/`
- Stack:
  - Vite
  - Storybook
- Responsibility:
  - UI components (`ui/` and `integrations/`)
  - Page compositions (`pages/`)
  - Storybook stories (`stories/`)
  - Design system

## 1.3 Dependency Rule (STRICT)

- `client` → `component` ✅ ALLOWED
- `component` → `client` ❌ FORBIDDEN

`component` MUST be independent and reusable.

---

# 2. Global Rules

## 2.1 Language

- MUST use TypeScript
- MUST enable strict mode
- MUST NOT use `any` (unless explicitly justified)

## 2.2 Naming Convention

- Components: PascalCase
- Hooks: `useSomething`
- Files: kebab-case

## 2.3 Color & Theming Rules

Colors MUST only be applied via CSS custom properties (design tokens) defined in
`global.css` or `index.css`. This is required for theme flexibility and consistency.

### FORBIDDEN — direct color values in components

- MUST NOT use hardcoded hex values: `color: #1a2b3c`
- MUST NOT use hardcoded `rgb()` / `rgba()` / `hsl()` / `hsla()` literals
- MUST NOT use Tailwind arbitrary color values: `bg-[#1a2b3c]`, `text-[rgb(0,0,0)]`
- MUST NOT use named CSS colors: `color: red`, `background: white`

### REQUIRED — token-based color usage

- MUST define all colors as CSS variables in `global.css` or `index.css`:
  ```css
  /* global.css or index.css */
  :root {
    --color-primary: hsl(220 90% 56%);
    --color-background: hsl(0 0% 100%);
    --color-foreground: hsl(220 10% 10%);
  }
  .dark {
    --color-background: hsl(220 10% 10%);
    --color-foreground: hsl(0 0% 100%);
  }
  ```
- Components MUST consume colors only via CSS variables:
  ```tsx
  // ✅ Tailwind CSS variable utility
  <div className="bg-background text-foreground" />
  // ✅ Inline CSS variable
  <div style={{ color: 'var(--color-primary)' }} />
  ```
- Tailwind theme extension in `tailwind.config.ts` MUST map all design tokens to CSS
  variables — MUST NOT hardcode color values in the config itself.

### Rationale

Theme switching (light/dark/brand) requires all color decisions to live in one place.
Hardcoded colors in component files make global theming impossible to maintain.

---

# 3. Workspace: client (Next.js)

## 3.1 Framework Rules

- MUST use Next.js App Router
- MUST follow nextjs-best-practices

## 3.2 Responsibilities

### ALLOWED

- Routing
- Auth UI handling (login/logout page flows)
- Page composition — each `app/` route file (`page.tsx`) MUST import its Page component
  from `component/src/pages/` exclusively
  - Example: `app/assets/page.tsx` → imports `AssetPage` from `component/src/pages/asset-page/AssetPage.tsx`

### FORBIDDEN

- API calls to backend
- Server actions connecting to backend
- Creating reusable UI components
- Creating design system logic
- Writing duplicated UI
- Defining Page layout/content inline in `page.tsx` (delegate to `component/src/pages/`)

> Backend API integration is out of scope for this workspace.
> All integration work is governed by `constitutions/integration.md`.

## 3.3 API Integration (Out of Scope)

Frontend does NOT own or implement backend API calls. All API integration — service layer,
error handling, and authentication wiring — is owned by the Integration team.

- Frontend components MUST use mock data or receive data via props only.
- MUST NOT create `/services` that call real backend endpoints.
- Refer to `constitutions/integration.md` for all API and service layer rules.

## 3.4 UI Usage Rules

- MUST use Page components from `component/src/pages/` only inside `app/` route files
- MUST NOT create custom base UI elements (e.g. button, input) inside `client/`
- MUST NOT inline complex UI logic in `page.tsx` files

## 3.5 State Management

- SHOULD prefer server state (React Server Components)
- SHOULD minimize client state

---

# 4. Workspace: component (Component System)

## 4.1 Core Stack

- Vite
- Storybook
- shadcn/ui (MANDATORY base)

## 4.2 Critical Rules

### Rule 1: Base Components

- MUST use shadcn/ui as base
- MUST NOT create components from scratch if shadcn equivalent exists

### Rule 2: Component Scope

Each component MUST be:

- Reusable
- Isolated
- Presentation-only

### Rule 3: Forbidden Logic

Components MUST NOT contain:

- API calls
- Business logic
- Global state
- Routing logic

## 4.3 Component Directory Structure

```
web/component/src/
  components/
    ui/           ← shadcn/ui imports ONLY (no custom code here)
    integrations/ ← composed components (multiple shadcn components combined)
                    or custom components built on top of shadcn
  pages/
    asset-page/
      AssetPage.tsx   ← page composition consumed by client/app/
  stories/
    AssetPage.stories.tsx  ← .stories.tsx files ONLY
```

### Directory Rules (STRICT)

| Directory              | Allowed content                                                      |
|------------------------|----------------------------------------------------------------------|
| `components/ui/`       | ONLY direct shadcn/ui component imports — no custom logic            |
| `components/integrations/` | Composed components: multiple shadcn components → 1 component, or custom shadcn extensions |
| `pages/`               | Page compositions used by `client/app/`. May contain page-specific sub-components (e.g. `asset-page/AssetPage.tsx`) |
| `stories/`             | ONLY `*.stories.tsx` files — no component source code                |

## 4.4 Component Requirements

Each component MUST have:

- Typed props
- Default variants
- Accessibility support (ARIA)
- A corresponding `.stories.tsx` file in `src/stories/`

## 4.5 Page Composition Rules

Pages in `component/src/pages/` MUST:

- Be presentation-only
- MUST NOT fetch data
- MUST use mock data or props only
- MUST be independently renderable in Storybook

---

# 5. Storybook Rules (MANDATORY)

## 5.1 Coverage

EVERY component and EVERY page in the `component` workspace MUST have Storybook stories.
No component or page may be considered done without a corresponding story.
Stories MUST also satisfy all testing strategies defined in Section 10.

## 5.2 Required Stories

Each component MUST include:

- Default state
- Variants
- Edge cases

## 5.3 Quality Criteria

A component is considered VALID only if:

- Renders successfully in Storybook
- Has no runtime errors
- Supports interaction (if applicable)

## 5.4 Stories File Location

- ALL story files MUST be placed in `component/src/stories/`
- Filename convention: `ComponentName.stories.tsx` (PascalCase matching component name)
- MUST NOT place `.stories.tsx` files inside `components/` or `pages/` directories
- Story files MUST NOT contain component source definitions — import the component only

---

# 6. Integration Rules

## 6.1 Workflow

### New UI Component (integrations or ui)

1. Create component in `component/src/components/ui/` (shadcn) or `component/src/components/integrations/` (custom)
2. Add story in `component/src/stories/`
3. Verify component renders in Storybook
4. Export component from `component`

### New Page

1. Create page composition in `component/src/pages/<page-name>/<PageName>.tsx`
2. Add story in `component/src/stories/<PageName>.stories.tsx`
3. Verify page renders in Storybook
4. Import Page component into `client/app/<route>/page.tsx`
   - `page.tsx` MUST contain only the import and a thin wrapper/export — no layout logic

## 6.2 Restrictions

- MUST NOT use components without Storybook stories
- MUST NOT use unstable components
- `client/app/` `page.tsx` files MUST NOT define UI inline — always delegate to `component/src/pages/`

---

# 7. Definition of Done

## Component Layer (`component` workspace)

- Component exists in correct directory:
  - shadcn import → `component/src/components/ui/`
  - composed/custom → `component/src/components/integrations/`
  - page composition → `component/src/pages/<page-name>/`
- Story file exists in `component/src/stories/`
- Component renders successfully in Storybook
- Uses shadcn as base (no from-scratch base components)
- No hardcoded color values — all colors via CSS variables from `global.css` / `index.css`
- All Section 10 tests pass:
  - ✅ Interaction test (`play` function) if component is interactive
  - ✅ Accessibility: zero axe violations at WCAG AA
  - ✅ Visual baseline committed
  - ✅ Snapshot committed and up to date
  - ✅ Coverage meets thresholds (80 % statements/functions/lines, 75 % branches)
  - ✅ Unit tests for non-trivial logic
  - ✅ Test runner passes all stories
  - ✅ Vitest addon passes
  - ✅ CI green

## App Layer (`client` workspace)

- `app/<route>/page.tsx` imports Page component from `component/src/pages/` only
- No UI defined inline in `page.tsx`
- No direct API calls in components
- No backend integration code (owned by Integration team per `constitutions/integration.md`)
- No duplicated UI logic

---

# 8. Design Principles (AI Guidance)

- Separation of concerns is REQUIRED
- UI and Logic MUST be strictly separated
- Reusability is PRIORITY
- Predictability over flexibility

---

# 9. Enforcement (AI Agent Behavior)

When generating code, AI MUST:

- Prefer existing components from `component` workspace
- Reject creating new base UI if shadcn alternative exists
- Place shadcn imports in `component/src/components/ui/` only
- Place composed/custom components in `component/src/components/integrations/`
- Place page compositions in `component/src/pages/<page-name>/`
- Create a `.stories.tsx` for EVERY new component or page — without exception
- Place all stories in `component/src/stories/`
- Keep `client/app/` `page.tsx` files thin — only a Page component import
- MUST NOT generate API calls or backend integration code (refer to Integration team)
- MUST NOT output hardcoded color values (hex, rgb, hsl, named colors) in any component,
  story, or style file — use CSS variables from `global.css` / `index.css` only
- MUST NOT use Tailwind arbitrary color values `bg-[#...]` or `text-[rgb(...)]`

If violation detected:

- MUST refactor instead of bypassing rules
- MUST add missing tests before merging
- MUST replace any hardcoded color with the appropriate CSS variable

---

# 10. Testing Rules (MANDATORY)

All components and pages in the `component` workspace MUST satisfy all 9 testing strategies
described below. A component is NOT considered done until all applicable tests pass.

## 10.1 Interaction Testing

**Purpose**: Simulate user behavior (click, type, keyboard navigation).

- MUST use `@storybook/addon-interactions` with the `play` function in stories.
- Each interactive component MUST have at least one `play` story that exercises its
  primary user interaction.
- Use `userEvent` from `@storybook/test` — MUST NOT use `fireEvent`.

```ts
// example
export const Filled: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole('textbox'), 'Hello');
    await expect(canvas.getByRole('textbox')).toHaveValue('Hello');
  },
};
```

## 10.2 Accessibility Testing

**Purpose**: Ensure components meet WCAG accessibility standards.

- MUST install and configure `@storybook/addon-a11y`.
- Every story MUST pass automated axe checks with zero violations at level AA.
- MUST NOT disable a11y rules without a documented justification in the story file.
- Keyboard navigation MUST be verified via interaction tests for focusable elements.

## 10.3 Visual Testing

**Purpose**: Catch unintended visual regressions in component appearance.

- MUST use Storybook's built-in visual diffing (Chromatic or equivalent).
- Each story represents one visual snapshot baseline.
- Visual tests MUST run on every pull request.
- MUST NOT merge PRs that introduce unapproved visual diffs.

## 10.4 Snapshot Testing

**Purpose**: Detect unexpected rendering changes, errors, and warnings.

- MUST use `@storybook/addon-storyshots` or Vitest inline snapshots.
- Snapshot MUST be committed alongside the story.
- When a snapshot changes intentionally, it MUST be explicitly updated and reviewed.
- Console errors or warnings during render MUST be treated as test failures.

## 10.5 Test Coverage

**Purpose**: Measure how much component code is exercised by tests.

- MUST configure Vitest coverage via `@vitest/coverage-v8` or `@vitest/coverage-istanbul`.
- Minimum coverage thresholds (enforced in CI):

  | Metric     | Minimum |
  |------------|---------|
  | Statements | 80 %    |
  | Branches   | 75 %    |
  | Functions  | 80 %    |
  | Lines      | 80 %    |

- Coverage report MUST be generated on every CI run.
- MUST NOT exclude source files from coverage without justification.

## 10.6 CI

**Purpose**: Run all tests automatically on every pull request and main branch push.

- All test suites (interaction, a11y, snapshot, unit, coverage) MUST run in CI.
- CI MUST fail if any test fails or coverage drops below thresholds.
- Storybook MUST be built (`storybook build`) before test runner executes in CI.
- MUST NOT merge a PR with failing CI.

Recommended CI step order:

```
1. pnpm install
2. pnpm --filter component build-storybook
3. pnpm --filter component test-storybook  (test runner)
4. pnpm --filter component test:coverage   (vitest + coverage)
```

## 10.7 Vitest Addon

**Purpose**: Run unit and component tests directly inside Storybook's browser environment.

- MUST install `@storybook/experimental-addon-test` (or stable release when available).
- Vitest config MUST reference the Storybook plugin so stories are treated as test files.
- Tests written with `vi`, `expect`, `describe` from `vitest` MUST be co-located in
  `component/src/stories/` alongside the story they test.
- MUST run with `pnpm --filter component test` (Vitest) and also within Storybook UI.

## 10.8 Test Runner

**Purpose**: Automate execution of all Storybook stories as tests (smoke + interactions).

- MUST install `@storybook/test-runner`.
- Every story is automatically executed as a test — no story may skip this.
- Configure via `component/.storybook/test-runner.ts` if custom setup is needed.
- Test runner MUST be run as part of CI (see Section 10.6).
- Local command: `pnpm --filter component test-storybook`.

## 10.9 Unit Testing

**Purpose**: Test component logic and utility functions in isolation.

- MUST use Vitest as the test framework.
- Unit tests MUST be placed in `component/src/stories/` with filename `ComponentName.test.ts(x)`.
- Each component with non-trivial logic (conditional rendering, state, computed props) MUST
  have unit tests covering all branches.
- MUST NOT use `any` in test files.
- Pure utility functions in `component/src/lib/` MUST have 100 % branch coverage.

---

**Version**: 3.3.0 | **Ratified**: 2026-03-23 | **Last Amended**: 2026-04-06
