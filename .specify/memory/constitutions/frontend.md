# Houseshi Constitution — Frontend

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

## 1.1 Workspace: app

- Framework: Next.js (App Router only)
- Responsibility:
  - Routing
  - API calls
  - Server actions
  - Authentication
  - Page composition

## 1.2 Workspace: ui

- Stack:
  - Vite
  - Storybook
- Responsibility:
  - UI components
  - Design system
  - Component testing

## 1.3 Dependency Rule (STRICT)

- `app` → `ui` ✅ ALLOWED
- `ui` → `app` ❌ FORBIDDEN

`ui` MUST be independent and reusable.

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

---

# 3. Workspace: app (Next.js)

## 3.1 Framework Rules

- MUST use Next.js App Router
- MUST follow nextjs-best-practices

## 3.2 Responsibilities

### ALLOWED

- API calls
- Server actions
- Routing
- Auth handling
- Page composition

### FORBIDDEN

- Creating reusable UI components
- Creating design system logic
- Writing duplicated UI

## 3.3 API Layer

All API calls MUST go through the service layer.

**Structure:**

```
/services
  user.service.ts
  auth.service.ts
```

**Rules:**

- MUST NOT call API directly inside components
- MUST handle errors inside service layer
- MUST return typed responses

## 3.4 UI Usage Rules

- MUST use components from `ui` workspace ONLY
- MUST NOT create custom base UI elements (e.g. button, input)
- MUST NOT inline complex UI logic

## 3.5 State Management

- SHOULD prefer server state (React Server Components)
- SHOULD minimize client state

---

# 4. Workspace: ui (Component System)

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

## 4.3 Component Structure

```
/components
  /button
    button.tsx
    button.stories.tsx
    button.test.ts
```

## 4.4 Component Requirements

Each component MUST have:

- Typed props
- Default variants
- Accessibility support (ARIA)

## 4.5 UI Page Composition (Pure UI)

UI workspace MAY define composed UI pages:

```
/pages-ui
  /dashboard
    dashboard.ui.tsx
```

Rules:

- MUST NOT fetch data
- MUST use mock data only
- MUST remain presentation-only

---

# 5. Storybook Rules (MANDATORY)

## 5.1 Coverage

EVERY component MUST have Storybook stories.

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

---

# 6. Integration Rules

## 6.1 Workflow

1. Create component in `ui` workspace
2. Add Storybook stories
3. Verify component works correctly
4. Export component
5. Import into `app` workspace

## 6.2 Restrictions

- MUST NOT use components without Storybook
- MUST NOT use unstable components

---

# 7. Definition of Done

## UI Layer

- Component exists in `ui` workspace
- Storybook stories exist
- Component passes rendering test
- Uses shadcn as base

## App Layer

- Uses `ui` components only
- No direct API calls in components
- Uses service layer for data fetching
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

- Prefer existing components from `ui` workspace
- Reject creating new base UI if shadcn alternative exists
- Enforce service layer usage for API calls
- Ensure every UI component includes Storybook

If violation detected:

- MUST refactor instead of bypassing rules

---

**Version**: 2.0.0 | **Ratified**: 2026-03-23 | **Last Amended**: 2026-03-25
