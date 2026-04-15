# Quickstart: Web Workspace

**Phase 1 Output** | Branch: `002-web-workspace-setup`

## Prerequisites

- Node.js 24+
- pnpm 9+ (`npm install -g pnpm`)

---

## Initial Setup

```bash
# From repository root
cd web/

# Install all dependencies for both packages
pnpm install
```

---

## Development

```bash
# Start Next.js app (client)
pnpm dev:client        # → http://localhost:3000

# Start Vite component dev server
pnpm dev:component     # → http://localhost:5173

# Start Storybook
pnpm storybook         # → http://localhost:6006
```

---

## Build

```bash
# Build the Next.js app
pnpm build:client

# Build the component library
pnpm build:component
```

---

## Quality

```bash
# Lint all packages
pnpm lint

# Run tests (component package)
pnpm test
```

---

## Important: Always run commands from `web/`

All package management MUST be done from the `web/` workspace root:

```bash
# ✅ Correct — installs for both packages, hoists shared deps
cd web/ && pnpm install

# ❌ Avoid — bypasses workspace hoisting and lockfile consolidation
cd web/client && pnpm install
cd web/component && pnpm install
```

---

## Adding a Dependency

```bash
# Add to client
pnpm --filter client add <package>

# Add to component (runtime dep)
pnpm --filter @web/component add <package>

# Add to component (dev dep)
pnpm --filter @web/component add -D <package>
```

---

## Docker (development)

Docker Compose mounts `./web` as `/app` in the container. Build images from the repo root:

```bash
docker compose -f docker-compose-web.yml up --build
```

The build context for both services is now `./web/` (workspace root), which is required for `pnpm install` to resolve workspace links during image build.
