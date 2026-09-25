# Production image for apps/api — no build stage: it expects `dist/apps/api`
# to already exist in the build context. Build it first with
# `pnpm nx build api --configuration=production` (locally, or as the
# pipeline's build step once one exists).
FROM node:22-alpine

# Pinned to match package.json's `packageManager` field (the SSOT for the
# exact pnpm version). Node comes from `node:22-alpine`, verified explicitly
# rather than assumed — a third-party base image tag does not pin its own
# Node version by itself.
RUN corepack enable && corepack prepare pnpm@10.18.3 --activate

WORKDIR /app

# The COPY below preserves the `dist/apps/api` path inside the image
# (destination `dist/apps/api`, not `./`) instead of flattening it at the
# image root, and the WORKDIR that follows moves into that same nested path.
# This is load-bearing, not cosmetic (T-C10-69): the compiled
# `apps/api/src/data-source.ts` resolves its `entities` glob as
# `join(__dirname, '..', '**', '*.entity.{ts,js}')`, which must stay bounded
# to this application's own tree, exactly as it is locally (from the
# repository root, `dist/apps/api/data-source.js`'s `__dirname` is one level
# under `dist/apps`, so `..` never leaves `dist/`). Flattening the COPY at the
# image root makes `__dirname` equal the root WORKDIR itself, so that same
# `..` resolves to the filesystem root and `initialize()` recursively globs
# the *entire container filesystem* (`/proc` included) — confirmed
# empirically: it hangs at 100% CPU and never returns. Keeping the
# `dist/apps/api` prefix reproduces the exact local path shape inside the
# image, and also means the path Docker's own filesystem shows for the
# compiled data source (`/app/dist/apps/api/data-source.js`) matches, suffix
# for suffix, the path the root `migration:run:deploy` script targets
# (`dist/apps/api/data-source.js`).
#
# apps/api/webpack.config.js sets `generatePackageJson: true`, so the build
# writes a minimal, exact-pinned package.json next to the bundle — only the
# packages `main.js` actually imports, none of this workspace's
# devDependencies or the `web` app's dependencies. That generated file is what
# the install below resolves against.
#
# (`api:prune-lockfile` / `api:copy-workspace-modules` — the @nx/js executors
# apps/api/project.json declares for exactly this purpose — currently fail in
# this workspace: "apps/api/package.json does not exist". They expect a
# per-project package.json, and this workspace declares every dependency in
# the single root package.json instead. Worth fixing so those executors work
# as intended — reported, not fixed here; see the CI/CD report. The
# generated-package.json install below is the working alternative until then.)
COPY dist/apps/api dist/apps/api

# `apps/api:build-migrations` (dependsOn `build`, `apps/api/project.json`,
# T-C10-69) compiles `apps/api/src/data-source.ts` and its migrations to
# plain CommonJS `.js` directly into `dist/apps/api` — the same directory
# `main.js` lands in — so the wholesale COPY above already brings in
# `data-source.js`, `migrations/*.js` and the `config/*.js` files it needs.
# No second COPY line: a duplicate would just re-copy files already inside
# `dist/apps/api`. `main.js` itself is still a single webpack bundle and not
# a valid `typeorm migration:run -d …` target — `data-source.js` is the
# separate, non-bundled entry point that command uses.
#
# `build-migrations` also patches this directory's generated `package.json`
# to add `pg` (TypeORM's Postgres driver): Nx's `generatePackageJson` infers
# runtime dependencies from this project's static import graph, and `pg` is
# never a static import anywhere in this codebase — TypeORM requires it
# lazily, only once a connection actually opens — so Nx omits it even though
# it is pinned in the root `package.json`. Without that patch `pnpm install
# --prod` below would not install it, and any `typeorm migration:run` against
# this image's compiled data source would fail at connection time with
# `Cannot find module 'pg'`.
WORKDIR /app/dist/apps/api
RUN pnpm install --prod

ENV NODE_ENV=production
EXPOSE 3300

# TCP-only check — see docker/backend/Dockerfile.dev for why an HTTP probe
# against a health path is not honest today.
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD node -e "require('net').createConnection({port:process.env.PORT||3300},()=>process.exit(0)).on('error',()=>process.exit(1))"

COPY docker/backend/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["node", "main.js"]
