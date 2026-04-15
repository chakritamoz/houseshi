# Research: Web Monorepo Workspace Setup

**Phase 0 Output** | Branch: `002-web-workspace-setup`

---

## Research 1: Docker + pnpm Workspace Compatibility

**Question**: The current Dockerfile uses `COPY package.json pnpm-lock.yaml ./` with build context `./web/client` (or `./web/component`). After workspace setup, `package.json` and `pnpm-lock.yaml` live at `./web/`. How do we make `pnpm install --frozen-lockfile` work correctly in Docker?

**Decision**: Change the Docker build context for both services to `./web/` and update the `COPY` commands in the Dockerfile to copy workspace-level files alongside sub-package manifests before running install.

**Rationale**: pnpm workspace requires the root `pnpm-workspace.yaml` and root `pnpm-lock.yaml` to be present before `pnpm install` can resolve `workspace:*` links. If the build context remains a sub-directory, these files are not available during the image build's install step.

The runtime behavior is unaffected — Docker Compose mounts `./web:/app` as a volume, so the installed `node_modules` from the image are overlaid by the live source at runtime during development.

**Dockerfile COPY pattern (new)**:
```dockerfile
# Copy workspace manifest files first (for install caching)
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY client/package.json ./client/
COPY component/package.json ./component/

RUN pnpm install --frozen-lockfile

# Copy all source
COPY . .
```

**docker-compose-web.yml change**: Both service `build.context` values must change from `./web/client` / `./web/component` to `./web/`.

**Alternatives Considered**:
- *Use sub-package install only*: Rejected. Sub-packages cannot resolve `workspace:*` dependency references without the workspace root present.
- *Multi-stage build with workspace root copied in*: Rejected as over-engineering; changing build context is simpler and sufficient.

---

## Research 2: TypeScript Version Conflict Between Packages

**Question**: `client` declares `typescript: "^5"` and `component` declares `typescript: "~5.9.3"`. Will hoisting cause a conflict?

**Decision**: Do not declare TypeScript at the workspace root level. Leave each package to manage its own TypeScript version. pnpm will hoist the highest compatible version automatically.

**Rationale**: `"^5"` resolves to ≥5.0.0 <6.0.0 and `"~5.9.3"` resolves to ≥5.9.3 <5.10.0. Both constraints are satisfiable by TypeScript 5.9.x, so pnpm will deduplicate and hoist a single 5.9.x installation. No conflict occurs. Declaring a root-level version adds no value and introduces maintenance burden.

**Per SD-003**: If a future conflict arises, `client`'s version takes precedence.

---

## Research 3: React / react-dom Peer Dependency Migration

**Question**: How should `react` and `react-dom` be specified in `web/component` after SD-001 migration to `peerDependencies`?

**Decision**:
- `web/component` `peerDependencies`: `"react": ">=19.2.4"`, `"react-dom": ">=19.2.4"`
- `web/component` removes `react` and `react-dom` from `dependencies`
- `web/client` retains `"react": "19.2.4"`, `"react-dom": "19.2.4"` in `dependencies` (acts as host)

**Rationale**: Using `>=19.2.4` as the peer range allows the component library to be consumed by any future React 19.x consumer without unnecessary version pinning. The client's exact pin (`19.2.4`) satisfies this range.

**Note on devDependencies**: `web/component` MAY keep `react` and `react-dom` in `devDependencies` for Storybook and vitest rendering to work when running the component library in isolation (without a host). This is standard practice for component library packages.

---

## Research 4: `pnpm-workspace.yaml` Consolidation

**Question**: `web/client/pnpm-workspace.yaml` currently contains `ignoredBuiltDependencies`. Where should this go?

**Decision**: Move `ignoredBuiltDependencies` to the new root `web/pnpm-workspace.yaml`. Remove `web/client/pnpm-workspace.yaml`.

**Rationale**: `ignoredBuiltDependencies` is a workspace-level pnpm configuration, not a per-package setting. Placing it at the workspace root applies it to all packages in the workspace, which is the correct scope. `sharp` and `unrs-resolver` are consumed by `client` (Next.js), so their build suppression still applies when `pnpm install` runs at the workspace root.

**Final `web/pnpm-workspace.yaml`**:
```yaml
packages:
  - "client"
  - "component"

ignoredBuiltDependencies:
  - sharp
  - unrs-resolver
```

---

## Research 5: Root `package.json` Script Design

**Question**: What is the correct pnpm filter syntax for workspace script delegation?

**Decision**: Use `pnpm --filter <package-name> <script>` for named delegations and `pnpm -r run <script>` for recursive runs.

**Root `package.json` scripts**:
```json
{
  "name": "web",
  "private": true,
  "scripts": {
    "dev:client":        "pnpm --filter client dev",
    "dev:component":     "pnpm --filter @web/component dev",
    "build:client":      "pnpm --filter client build",
    "build:component":   "pnpm --filter @web/component build",
    "lint":              "pnpm -r run lint",
    "storybook":         "pnpm --filter @web/component storybook",
    "build-storybook":   "pnpm --filter @web/component build-storybook",
    "test":              "pnpm --filter @web/component test"
  }
}
```

**Rationale**: Filter by package name (not path) to be resilient to directory restructuring. `pnpm -r run lint` runs lint in all packages that define it, which correctly skips packages lacking a `lint` script.
