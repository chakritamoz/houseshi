# Tasks: Web Monorepo Workspace Setup

**Input**: Design documents from `/specs/001-web-workspace-setup/`
**Branch**: `002-web-workspace-setup`
**Prerequisites**: plan.md ✅ spec.md ✅ research.md ✅ data-model.md ✅ contracts/ ✅

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to
- Exact file paths in every task description

---

## Phase 1: Setup (Workspace Scaffolding)

**Purpose**: Create the workspace root files that make `web/` a pnpm workspace. All subsequent work depends on this.

- [X] T001 Create `web/pnpm-workspace.yaml` with `packages: [client, component]` and `ignoredBuiltDependencies: [sharp, unrs-resolver]`
- [X] T002 Create `web/package.json` with `name: web`, `private: true`, and all root scripts (`dev:client`, `dev:component`, `build:client`, `build:component`, `lint`, `storybook`, `build-storybook`, `test`) delegating via `pnpm --filter`
- [X] T003 Delete `web/client/pnpm-workspace.yaml` (config migrated to workspace root in T001)

**Checkpoint**: `web/` is a valid pnpm workspace root. `pnpm install` can now be run from `web/`.

---

## Phase 2: Foundational (Package Modifications)

**Purpose**: Update sub-package `package.json` files to integrate with the workspace. MUST complete before any user story can be verified.

**⚠️ CRITICAL**: These changes are prerequisites for all user stories.

- [X] T004 Update `web/component/package.json`: rename `name` field from `"component"` to `"@web/component"` (required for `workspace:*` linking per SD-002)
- [X] T005 Update `web/component/package.json`: move `react` and `react-dom` from `dependencies` → `peerDependencies` with range `>=19.2.4` (per SD-001)
- [X] T006 Update `web/component/package.json`: add `react` and `react-dom` to `devDependencies` with range `^19.2.4` (required for Storybook and vitest to work in isolation)
- [X] T007 Update `web/client/package.json`: add `"@web/component": "workspace:*"` to `dependencies` (per SD-002)
- [X] T008 Run `pnpm install` from `web/` to generate consolidated `web/pnpm-lock.yaml` and validate workspace resolves correctly

**Checkpoint**: `web/pnpm-lock.yaml` exists. `@web/component` resolves to the local `web/component/` directory. Both packages install cleanly.

---

## Phase 3: User Story 1 — Dev Servers from Single Entry Point (Priority: P1) 🎯 MVP

**Goal**: Developer can run `pnpm dev:client` and `pnpm dev:component` from `web/` to start each development server.

**Independent Test**: From `web/`, run `pnpm dev:client` — Next.js starts on port 3000. Run `pnpm dev:component` — Vite starts on port 5173. Both commands succeed without cd'ing into sub-directories.

- [X] T009 [US1] Verify `pnpm dev:client` script in `web/package.json` resolves to `pnpm --filter client dev` and start Next.js app successfully from `web/`
- [X] T010 [US1] Verify `pnpm dev:component` script in `web/package.json` resolves to `pnpm --filter @web/component dev` and starts Vite dev server successfully from `web/`

**Checkpoint**: US1 complete. Developer can start either dev server from the workspace root.

---

## Phase 4: User Story 2 — Build Both Packages from Root (Priority: P2)

**Goal**: Developer and CI pipeline can build either or both packages from `web/` without navigating to sub-directories.

**Independent Test**: From `web/`, run `pnpm build:client` — Next.js build completes. Run `pnpm build:component` — Vite build completes. Both produce output without errors.

- [X] T011 [P] [US2] Verify `pnpm build:client` in `web/package.json` runs `pnpm --filter client build` and Next.js build completes from `web/` (produces `web/client/.next/`)
- [X] T012 [P] [US2] Verify `pnpm build:component` in `web/package.json` runs `pnpm --filter @web/component build` and Vite build completes from `web/` (produces `web/component/dist/`)
- [X] T013 [US2] Update `.config/dev/docker/node.Dockerfile`: change `COPY` pattern to workspace-aware multi-step copy (copy root manifests + sub-package manifests before `RUN pnpm install --frozen-lockfile`)
- [X] T014 [US2] Update `docker-compose-web.yml`: change `build.context` for `houseshi-web` service from `./web/client` to `./web/`
- [X] T015 [US2] Update `docker-compose-web.yml`: change `build.context` for `houseshi-storybook` service from `./web/component` to `./web/`
- [X] T016 [US2] Validate Docker build: run `docker compose -f docker-compose-web.yml build` from repo root and confirm both images build successfully with workspace `pnpm install`

**Checkpoint**: US2 complete. Build commands work from root. Docker images build with workspace context.

---

## Phase 5: User Story 3 — Storybook and Lint from Root (Priority: P3)

**Goal**: Developer can run Storybook and linting for all packages from the workspace root.

**Independent Test**: From `web/`, run `pnpm storybook` — Storybook starts on port 6006. Run `pnpm lint` — linting runs for both packages without errors.

- [X] T017 [US3] Verify `pnpm storybook` in `web/package.json` runs `pnpm --filter @web/component storybook` and Storybook starts on port 6006 from `web/`
- [X] T018 [P] [US3] Verify `pnpm lint` in `web/package.json` runs `pnpm -r run lint` and linting executes across both `client` and `component` packages
- [X] T019 [P] [US3] Verify `pnpm test` in `web/package.json` runs `pnpm --filter @web/component test` and vitest suite executes from `web/`

**Checkpoint**: US3 complete. All tooling (Storybook, lint, test) accessible from workspace root.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validate the complete workspace end-to-end and confirm no regressions.

- [X] T020 [P] Run `pnpm install` from `web/` on a clean `node_modules` (delete first) and confirm both packages install in under 2 minutes (SC-001)
- [X] T021 [P] Confirm `web/client/package.json` and `web/component/package.json` still function individually — run `pnpm dev` inside each sub-directory to verify no regressions (SC-003)
- [X] T022 Run quickstart.md validation: follow every command in `specs/001-web-workspace-setup/quickstart.md` from a fresh terminal and confirm all commands succeed

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 (workspace root must exist before packages reference it)
- **Phase 3 (US1)**: Depends on Phase 2 completion
- **Phase 4 (US2)**: Depends on Phase 2 completion — can run in parallel with Phase 3
- **Phase 5 (US3)**: Depends on Phase 2 completion — can run in parallel with Phase 3 and 4
- **Phase 6 (Polish)**: Depends on all prior phases

### User Story Dependencies

- **US1 (P1)**: No dependencies on other user stories
- **US2 (P2)**: No dependencies on US1 — independently testable; Docker tasks are self-contained
- **US3 (P3)**: No dependencies on US1/US2 — independently testable

### Within Each Phase

- Tasks T004–T007 (Phase 2): Must run sequentially in order before T008
- Tasks T011–T012 (Phase 4): Marked [P], can run in parallel
- Tasks T017–T019 (Phase 5): T017 blocked until Phase 2 complete; T018 and T019 marked [P]
- Tasks T020–T021 (Phase 6): Marked [P], can run in parallel

### Parallel Opportunities

```
Phase 1:  T001 → T002 → T003 (sequential, fast)
Phase 2:  T004 → T005 → T006 → T007 → T008 (sequential)
After Phase 2:
  Phase 3: T009 → T010
  Phase 4: T011 ‖ T012, then T013 → T014 → T015 → T016   (can run alongside Phase 3/5)
  Phase 5: T017, T018 ‖ T019                               (can run alongside Phase 3/4)
Phase 6:  T020 ‖ T021 → T022
```

---

## Implementation Strategy

**MVP Scope (Phase 1 + 2 + Phase 3)**:
- Create workspace root files, update sub-package manifests, verify dev servers work from root
- Deliverable: `pnpm install` + `pnpm dev:client` + `pnpm dev:component` all work from `web/`
- Estimated tasks: T001–T010 (10 tasks)

**Full Delivery**:
- Add build commands, Docker integration, Storybook/lint/test delegation
- All 22 tasks across all phases

**Suggested order for solo developer**:
1. Phase 1 (T001–T003): ~15 min
2. Phase 2 (T004–T008): ~15 min
3. Phase 3 (T009–T010): ~10 min — **MVP done**
4. Phase 4 (T011–T016): ~20 min
5. Phase 5 (T017–T019): ~10 min
6. Phase 6 (T020–T022): ~15 min
