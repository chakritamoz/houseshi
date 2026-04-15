# Implementation Plan: Web Monorepo Workspace Setup

**Branch**: `001-web-workspace-setup` | **Date**: 2026-04-15 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-web-workspace-setup/spec.md`

## Summary

Introduce a pnpm workspace root at `web/` with a single `package.json` and `pnpm-workspace.yaml` that unifies `web/client` (Next.js) and `web/component` (Vite + Storybook). The component package is renamed to `@web/component`, linked from `web/client` via the workspace protocol. Shared React libs are migrated to `peerDependencies` in the component package. The Docker build context is updated from sub-package directories to the workspace root to support workspace-aware `pnpm install`.

## Technical Context

**Language/Version**: TypeScript 5.9.x / Node.js 24  
**Primary Dependencies**: pnpm workspace, Next.js 16.2.2, Vite 8.x, Storybook 10.x, React 19.2.4  
**Storage**: N/A  
**Testing**: vitest (web/component)  
**Target Platform**: macOS dev environment + Docker (node:24 image)  
**Project Type**: monorepo workspace configuration  
**Performance Goals**: N/A  
**Constraints**: Must not break existing Docker volume mounts (`./web:/app`); must preserve all existing per-package scripts  
**Scale/Scope**: 2 packages, 1 workspace root

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Status | Notes |
|------|--------|-------|
| Package manager MUST be pnpm | ✅ PASS | pnpm used throughout |
| Frontend MUST use pnpm workspace (monorepo) | ✅ PASS | This feature installs it |
| `client` → `component` dependency direction | ✅ PASS | `@web/component` linked into `client` only |
| `component` MUST NOT depend on `client` | ✅ PASS | No reverse dependency introduced |
| Technology outside constitution stack | ✅ PASS | No new technologies; workspace tooling is native to pnpm |
| Docker Dockerfile build context change | ⚠ JUSTIFIED | Dockerfile must change build context from `./web/client` to `./web/` for workspace install — this is an unavoidable infrastructure change to support the workspace root. Not a complexity violation; categorized as scope clarification. |

## Project Structure

### Documentation (this feature)

```text
specs/001-web-workspace-setup/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
web/                                  ← workspace root (NEW)
├── package.json                      ← NEW: root scripts + workspace metadata
├── pnpm-workspace.yaml               ← NEW: packages list + ignoredBuiltDependencies
├── pnpm-lock.yaml                    ← REGENERATED: consolidated lockfile
├── client/
│   ├── package.json                  ← MODIFIED: add @web/component dep, remove pnpm-workspace.yaml
│   └── pnpm-workspace.yaml           ← REMOVED (config migrated to web/pnpm-workspace.yaml)
└── component/
    └── package.json                  ← MODIFIED: name → @web/component, react/react-dom → peerDependencies

.config/dev/docker/
└── node.Dockerfile                   ← MODIFIED: workspace-aware COPY + install

docker-compose-web.yml                ← MODIFIED: build context → ./web/ for both services
```

**Structure Decision**: Workspace root at `web/` — matches existing Docker volume mount (`./web:/app`) so no container path changes are needed at runtime.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Docker build context change | Required for `pnpm install --frozen-lockfile` to resolve workspace packages during image build | Keeping sub-directory build contexts would mean `pnpm install` runs without workspace context, failing to resolve `workspace:*` links |
