# Contract: Workspace Package Interface

**Phase 1 Output** | Branch: `001-web-workspace-setup`

This document defines the contracts between packages in the `web/` pnpm workspace — specifically the interface the `@web/component` package exposes to consumers (namely `web/client`).

---

## Package Identity Contract

```
Package name:   @web/component
Location:       web/component/
Reference:      workspace:*
```

Any consumer wishing to use the component library MUST reference it as `@web/component` in their `dependencies`. The workspace protocol (`workspace:*`) MUST be used during development to link directly to the local source.

---

## Peer Dependency Contract

Consumers of `@web/component` MUST provide the following peer dependencies in their own `dependencies`:

| Peer | Required Version |
|------|-----------------|
| `react` | `>=19.2.4` |
| `react-dom` | `>=19.2.4` |

Failure to satisfy these peers will result in duplicate React instances and runtime context errors (e.g., hooks breaking across module boundaries).

---

## Root Script Contract

The workspace root `web/package.json` exposes the following stable script interface for all development and CI workflows:

| Script | Effect | Target Package |
|--------|--------|----------------|
| `pnpm dev:client` | Start Next.js dev server | `client` |
| `pnpm dev:component` | Start Vite dev server | `@web/component` |
| `pnpm build:client` | Build Next.js app | `client` |
| `pnpm build:component` | Build component library | `@web/component` |
| `pnpm storybook` | Start Storybook | `@web/component` |
| `pnpm build-storybook` | Build Storybook static | `@web/component` |
| `pnpm lint` | Lint all packages | all (recursive) |
| `pnpm test` | Run vitest suite | `@web/component` |

All scripts MUST remain functional after implementation. Adding scripts is allowed; removing or renaming existing scripts requires a spec amendment.

---

## Workspace Configuration Contract

`web/pnpm-workspace.yaml` MUST contain:

```yaml
packages:
  - "client"
  - "component"

ignoredBuiltDependencies:
  - sharp
  - unrs-resolver
```

The `packages` list references directory names (not package names). Adding new workspace members requires updating this file.
