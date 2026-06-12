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

The catalog uses `VITE_APPS_SCRIPT_URL`, `VITE_LINE_CONTACT_URL`, and `VITE_LIFF_ID`. `VITE_LIFF_ID` is optional; when set, the app initializes LIFF so it runs inside LINE without forcing login.

Set these Apps Script properties before deploying:

- `SPREADSHEET_ID`

Create `products`, `product_images`, and `categories` sheets with the headers documented in `apps-script/README.md`, then deploy the script as a Web App executed by the owner and accessible to anyone.

## Deploy the frontend

The frontend is a static site. Host it for free on Cloudflare Pages or Netlify; both read the SPA fallback in `apps/frontend/public/_redirects`, which rewrites every path to `index.html` so shared `/products/:slug` links open directly.

Build settings:

- Build command: `pnpm install && pnpm --filter frontend build`
- Output directory: `apps/frontend/dist`
- Environment variables: `VITE_APPS_SCRIPT_URL`, `VITE_LINE_CONTACT_URL`, and `VITE_LIFF_ID`

After the first deploy, set the LIFF app Endpoint URL in the LINE Developers Console to the deployed site URL.
