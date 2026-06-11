# CK Pharmacy LINE LIFF

Phase 1 records medical equipment through a LINE LIFF frontend, a Google Apps Script Web App API, and Google Sheets storage.

## Workspaces

- `apps/frontend`: Vite, React, Tailwind CSS, and LINE LIFF
- `apps-script`: Google Apps Script API
- `packages/shared`: browser-compatible API contracts and DTOs

## Commands

```sh
pnpm install
pnpm dev
pnpm lint
pnpm test
pnpm build
```

## Configuration

Copy `apps/frontend/.env.example` to `apps/frontend/.env.local` and set the LIFF ID and deployed Apps Script Web App URL.

Set these Apps Script properties before deploying:

- `LINE_CHANNEL_ID`
- `SPREADSHEET_ID`

Create `equipment` and `request_log` sheets with the headers documented in `apps-script/README.md`, then deploy the script as a Web App executed by the owner and accessible to anyone.

