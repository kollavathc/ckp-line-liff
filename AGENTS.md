# Repository Guidelines

## Project Structure

This repository is a pnpm workspace monorepo:

- `apps/frontend/`: Vite, React, and Tailwind CSS LIFF application.
- `apps/backend/`: NestJS API. All routes use the `/api` prefix.
- `packages/database/`: Prisma schema, migrations, client, and PostgreSQL access.
- `packages/shared/`: code shared across the frontend and backend.

Keep Jest tests beside their source files using `*.spec.ts` or `*.test.ts`.

## Architecture

Backend features follow `Module > Controller > Service > Repo`. Controllers handle transport, services contain business logic, and repositories own persistence. Repositories wrap Prisma; services must never import or call Prisma directly.

Use Tailwind utility classes in the frontend; inline styles are prohibited. Keep UI components focused and place reusable domain contracts in `packages/shared`.

`packages/shared` may contain `class-validator` DTO classes, API response interfaces, and wire enums. DTOs must remain browser-compatible for frontend form validation. Never add imports from `@nestjs/*`, server-only classes, frontend view models, or UI state.

## Development Commands

Use pnpm from the repository root:

- `pnpm install`: install all workspace dependencies.
- `pnpm dev`: run workspace development applications.
- `pnpm build`: build all applications and packages.
- `pnpm test`: run Jest tests across the workspace.
- `pnpm lint`: run configured lint checks.
- `pnpm --filter <workspace> <script>`: run one workspace command, such as `pnpm --filter frontend dev`.

Update this section if root scripts use different names after scaffolding.

## Coding Conventions

Enable TypeScript strict mode everywhere. Do not use `any`; use explicit types, generics, or narrowed `unknown`. Use `camelCase` for variables and functions, `PascalCase` for classes and types, and `kebab-case` for files.

Do not add comments unless explicitly requested. Prefer clear names, small functions, and focused modules. Avoid unrelated refactors.

## Testing Guidelines

Use Jest and colocate tests with implementation files. Test public behavior, validation failures, repository interactions, and errors. Mock Prisma at the repository boundary. Frontend tests should cover visible behavior, not implementation details.

## Commits and Pull Requests

One prompt or task produces one commit. Before committing, run relevant tests and ensure `pnpm build` succeeds. Use Conventional Commits, such as `feat(frontend): add equipment catalog`.

Pull requests must summarize changes, list verification commands, link issues, and include screenshots for UI changes. Call out migrations and configuration changes.

## Change Safety

Do not create project scaffolding, applications, packages, migrations, or new infrastructure without asking first. Never commit secrets; document required variables in sanitized `.env.example` files.
