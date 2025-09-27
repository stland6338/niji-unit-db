# Repository Guidelines

## Project Structure & Module Organization
- Root layout:
```
NijiUnitDB/
├─ src/
│  ├─ api/   # ASP.NET Core (C#)
│  └─ web/   # React (TypeScript)
├─ tests/
│  ├─ api/   # .NET tests
│  └─ web/   # Frontend tests
├─ docs/     # Documentation
└─ scripts/  # Dev/DB utilities
```
- Backend: `src/api` (Controllers, Data, Models, Services).
- Frontend: `src/web` (`src/`, `public/`).
- Tests live in `tests/api`, `tests/web`.

## Build, Test, and Development Commands
- Backend build: `cd src/api && dotnet restore && dotnet build` — restore and compile.
- Backend run: `cd src/api && dotnet run` — start local API.
- Frontend deps: `cd src/web && npm ci` — install exact lockfile deps.
- Frontend dev: `cd src/web && npm run dev` — start Vite dev server.
- API tests: `cd tests/api && dotnet test` — run .NET tests.
- Web tests: `cd tests/web && npm test` — run frontend tests.

## Coding Style & Naming Conventions
- C# (.NET 8): 4-space indent. Types/Methods/Props PascalCase; locals/args camelCase; private fields `_camelCase`. One public type per file; filename = type name. Use `dotnet format` (respects `.editorconfig`).
- TypeScript/React: 2-space indent. Variables/functions camelCase; components/types PascalCase. Files: utilities `kebab-case.ts`; components `PascalCase.tsx`. Use `npm run lint` and `npm run format`.

## Testing Guidelines
- Frameworks: xUnit/NUnit via `dotnet test`; Vitest/Jest via `npm test`.
- C# naming: Project `*.Tests.csproj`; class `*Tests`; methods `MethodName_Should...`.
- Web naming: `*.test.ts(x)` or under `__tests__/`.
- Aim for meaningful unit tests for controllers/services and UI/state logic.

## Commit & Pull Request Guidelines
- Commit style: Conventional Commits (`feat:`, `fix:`, `docs:`, `test:`, `chore:`, `refactor:`).
- PRs: small, focused. Include purpose/scope, linked issues (e.g., `Closes #123`), screenshots/GIFs for UI, test steps, and any migration notes.
- Pre-push: build passes, tests green, lint/format applied.

## Security & Configuration Tips
- Do not commit secrets. Use env vars/User Secrets/KeyVault (e.g., `ConnectionStrings__Default`).
- Frontend config via `.env.local` (untracked) for API endpoints.
- CORS: allow only dev origins; never use `*` in production.

