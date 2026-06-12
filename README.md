# CK Pharmacy Product Catalog

Customer-facing medical product catalog using a React frontend, Google Apps Script Web App API, and Google Sheets storage.

## Workspaces

- `apps/frontend`: Vite, React, React Router, and Tailwind CSS
- `apps-script`: Google Apps Script API
- `packages/shared`: browser-compatible API contracts

## Commands

```sh
pnpm install
pnpm dev
pnpm lint
pnpm test
pnpm build
```

## Configuration

Copy `apps/frontend/.env.example` to `apps/frontend/.env.local` and set the deployed Apps Script Web App URL and LINE contact URL.

The catalog uses `VITE_APPS_SCRIPT_URL` and `VITE_LINE_CONTACT_URL`.

Set these Apps Script properties before deploying:

- `SPREADSHEET_ID`

Create `products`, `product_images`, and `categories` sheets with the headers documented in `apps-script/README.md`, then deploy the script as a Web App executed by the owner and accessible to anyone.
