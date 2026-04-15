# Data Model: Web Monorepo Workspace Setup

**Phase 1 Output** | Branch: `001-web-workspace-setup`

---

## Entities

This feature is a configuration change, not a data feature. The "entities" here are the package configuration objects and their relationships within the pnpm workspace system.

---

### Entity: Workspace Root (`web/`)

| Field | Value | Notes |
|-------|-------|-------|
| `name` | `"web"` | Workspace root identifier |
| `private` | `true` | Prevents accidental publish |
| `scripts` | See Research 5 | Delegates to sub-packages via `--filter` |
| `pnpm-workspace.yaml` | packages + ignoredBuiltDependencies | Defines workspace members |

**Relationships**:
- Contains → `client` package
- Contains → `@web/component` package
- Owns → root `pnpm-lock.yaml` (single consolidated lockfile)

---

### Entity: client package (`web/client/`)

| Field | Value | Notes |
|-------|-------|-------|
| `name` | `"client"` | Unchanged |
| `private` | `true` | Unchanged |
| `dependencies.@web/component` | `"workspace:*"` | NEW — workspace protocol link |
| `dependencies.react` | `"19.2.4"` | Unchanged; satisfies component's peer |
| `dependencies.react-dom` | `"19.2.4"` | Unchanged; satisfies component's peer |
| `pnpm-workspace.yaml` | REMOVED | Migrated to workspace root |

**State Transitions**:
- `pnpm-workspace.yaml` → deleted (config moved to `web/pnpm-workspace.yaml`)
- `dependencies` ← add `@web/component: "workspace:*"`

---

### Entity: component package (`web/component/`)

| Field | Value | Notes |
|-------|-------|-------|
| `name` | `"@web/component"` | CHANGED from `"component"` — required for workspace protocol |
| `private` | `true` | Unchanged |
| `peerDependencies.react` | `">=19.2.4"` | MOVED from `dependencies` (SD-001) |
| `peerDependencies.react-dom` | `">=19.2.4"` | MOVED from `dependencies` (SD-001) |
| `devDependencies.react` | `"^19.2.4"` | KEPT for Storybook/vitest isolation |
| `devDependencies.react-dom` | `"^19.2.4"` | KEPT for Storybook/vitest isolation |

**State Transitions**:
- `name`: `"component"` → `"@web/component"`
- `dependencies.react` → remove
- `dependencies.react-dom` → remove
- `peerDependencies` ← add `react`, `react-dom`
- `devDependencies` ← add `react`, `react-dom` (if not already present)

---

### Entity: Dockerfile (`.config/dev/docker/node.Dockerfile`)

| Field | Current | New |
|-------|---------|-----|
| Build context (external) | `./web/client` or `./web/component` | `./web/` |
| COPY pattern | `COPY package.json pnpm-lock.yaml ./` | Workspace-aware multi-COPY (see Research 1) |

---

### Entity: docker-compose-web.yml

| Service | `build.context` current | `build.context` new |
|---------|------------------------|---------------------|
| `houseshi-web` | `./web/client` | `./web/` |
| `houseshi-storybook` | `./web/component` | `./web/` |

**Note**: `volumes` and `command` fields are unchanged for both services.

---

## Dependency Graph

```
web/ (workspace root)
├── client (Next.js app)
│   └── @web/component [workspace:*] ──────→ component (@web/component)
│       peerDeps: react, react-dom          (isolated: Vite + Storybook)
│
│       satisfied by client's own deps:
│       react@19.2.4, react-dom@19.2.4
│
└── Hoisted to web/node_modules (shared):
    └── typescript@5.9.x, eslint@9.x (largest compatible version)
```

---

## Validation Rules

- `@web/component` package `name` MUST match the `workspace:*` reference key exactly
- `web/pnpm-workspace.yaml` packages list MUST include both `"client"` and `"component"` (directory names, not package names)
- `react` and `react-dom` MUST NOT remain in `component`'s `dependencies` after migration
- `web/client/pnpm-workspace.yaml` MUST be deleted before `pnpm install` at workspace root runs, to avoid workspace detection conflict
