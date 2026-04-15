# Feature Specification: Web Monorepo Workspace Setup

**Feature Branch**: `001-web-workspace-setup`  
**Created**: 2026-04-15  
**Status**: Draft  
**Input**: User description: "ทำการ set up ให้ web/client และ web/component ทำงานเป็น workspace โดย control package ผ่านไฟล์ Package.json ตัวเดียวกันเท่านั้น"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Run Dev Servers from Single Entry Point (Priority: P1)

A developer wants to start either or both development servers (`web/client` and `web/component`) by running a single command from the `web/` directory root, without needing to navigate into individual sub-directories.

**Why this priority**: This is the primary productivity benefit of a workspace setup. All other stories depend on this unified entry point being established first.

**Independent Test**: From the `web/` directory, run `pnpm dev:client` and verify the Next.js development server starts. Run `pnpm dev:component` and verify the Vite development server starts. Run `pnpm dev` (if defined) and verify both start concurrently.

**Acceptance Scenarios**:

1. **Given** a developer is in the `web/` directory, **When** they run `pnpm dev:client`, **Then** the Next.js app in `web/client` starts successfully
2. **Given** a developer is in the `web/` directory, **When** they run `pnpm dev:component`, **Then** the Vite dev server for the component library in `web/component` starts successfully
3. **Given** a developer is in the `web/` directory, **When** they run `pnpm install`, **Then** dependencies for both `client` and `component` packages are installed

---

### User Story 2 - Build Both Packages from Root (Priority: P2)

A developer or CI pipeline needs to build one or both packages from the workspace root without navigating to sub-directories.

**Why this priority**: Build consistency is critical for CI/CD pipelines. Once the dev workflow is established, build commands follow the same pattern.

**Independent Test**: From `web/`, run `pnpm build:client` and `pnpm build:component` separately and verify each produces its expected build output.

**Acceptance Scenarios**:

1. **Given** the workspace root `web/` has all dependencies installed, **When** `pnpm build:client` is run, **Then** the Next.js app builds successfully
2. **Given** the workspace root `web/` has all dependencies installed, **When** `pnpm build:component` is run, **Then** the Vite component library builds successfully
3. **Given** a CI pipeline runs from the `web/` directory, **When** all build commands run, **Then** no manual directory navigation is required

---

### User Story 3 - Run Storybook and Tests from Root (Priority: P3)

A developer wants to run Storybook and test suites for the component library from the workspace root.

**Why this priority**: Secondary tooling that benefits from workspace integration once core scripts are in place.

**Independent Test**: From `web/`, run `pnpm storybook` and verify Storybook launches against `web/component`.

**Acceptance Scenarios**:

1. **Given** the workspace is set up, **When** `pnpm storybook` is run from `web/`, **Then** Storybook for `web/component` starts on its configured port
2. **Given** the workspace is set up, **When** `pnpm lint` is run from `web/`, **Then** linting runs across both packages

---

### Edge Cases

- What happens when only one package has a matching script (e.g., `storybook` only exists in `component`)? The root script should delegate only to the relevant package without failing.
- How does the system handle conflicting dependency versions between `client` and `component`? pnpm workspace hoisting resolves shared dependencies; conflicts should be visible at install time.
- What happens if a developer runs `pnpm install` in a sub-directory instead of the root? Installation still works per-package but shared hoisting benefits may not apply — documentation should clarify the intended root-only workflow.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: A `pnpm-workspace.yaml` file MUST exist at `web/` defining both `web/client` and `web/component` as workspace packages
- **FR-002**: A root `package.json` MUST exist at `web/` containing all scripts needed to operate both packages (dev, build, lint, test, storybook)
- **FR-003**: The root `package.json` MUST use pnpm workspace filter syntax (e.g., `pnpm --filter`) or script delegation to invoke commands in each sub-package
- **FR-004**: `web/client/package.json` and `web/component/package.json` MUST retain their own package definitions (name, dependencies, scripts) so each remains individually operable
- **FR-005**: All dependency installation MUST be manageable from the `web/` root via a single `pnpm install` command
- **FR-006**: The root `package.json` scripts MUST cover at minimum: `dev:client`, `dev:component`, `build:client`, `build:component`, `lint`, `storybook`
- **FR-007**: The existing `pnpm-workspace.yaml` in `web/client/` (which currently only holds `ignoredBuiltDependencies`) MUST be reviewed and its relevant config merged into the new root-level `pnpm-workspace.yaml` or removed if no longer needed

### Shared Dependencies & Workspace Standards

To prevent duplicate library instances and ensure efficient version management:

- **SD-001 — Peer Dependencies Management**: `web/component` MUST declare shared host-provided libraries (e.g., `react`, `react-dom`) as `peerDependencies` rather than `dependencies`. `web/client` MUST declare those same libraries in its `dependencies`, acting as the host that satisfies the component library's peer requirements.

- **SD-002 — Internal Workspace Linking**: `web/client` MUST reference `web/component` using the pnpm workspace protocol in its `dependencies`:
  ```json
  "@web/component": "workspace:*"
  ```
  This ensures pnpm links the package directly from the local folder without requiring a private registry publish during development. `web/component`'s `package.json` `name` field MUST be set to `@web/component` to match this reference.

- **SD-003 — Dependency Hoisting Policy**: Common development dependencies (e.g., `typescript`, `eslint`) SHOULD be hoisted to the workspace root to minimize duplication across `node_modules` in sub-packages. In the event of a version conflict between packages, the version declared in `web/client` takes precedence to ensure application stability.

### Key Entities

- **Workspace Root** (`web/`): The top-level package manager entry point with a `package.json` and `pnpm-workspace.yaml` defining the monorepo
- **client package** (`web/client`): The Next.js application; remains a self-contained package with its own `package.json`
- **component package** (`web/component`): The Vite + React + Storybook component library; remains a self-contained package with its own `package.json`

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A developer can install all workspace dependencies with a single command from `web/` in under 2 minutes on a standard machine
- **SC-002**: All development, build, lint, and Storybook workflows for both packages are accessible from `web/` without navigating to sub-directories
- **SC-003**: No existing functionality in `web/client` or `web/component` is broken — all scripts that worked before continue to work after setup
- **SC-004**: Running `pnpm install` at the `web/` root correctly installs dependencies for both packages with shared dependencies hoisted once
- **SC-005**: A new developer can onboard and start work on either package using only root-level commands, reducing setup steps by at least 50% compared to managing each package independently

## Assumptions

- pnpm is the package manager in use (evidenced by existing `pnpm-lock.yaml` and `pnpm-workspace.yaml` files)
- Each sub-package (`client`, `component`) will continue to have its own `package.json` — "single package.json" in the feature description refers to a single root-level entry point for running scripts/install, not merging all dependencies into one file
- The `web/client/pnpm-workspace.yaml` currently only contains `ignoredBuiltDependencies` (not package references) and will be migrated to the root-level `pnpm-workspace.yaml`
- No changes to the Docker Compose setup are required as part of this specification
