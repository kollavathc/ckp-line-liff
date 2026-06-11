# Project Handoff

Last updated: June 12, 2026

## Current Goal

Build a mobile-first LINE LIFF application for CK Pharmacy medical equipment workflows.

The repository currently contains two frontend flows:

- A medical equipment record-management flow backed by Google Apps Script and Google Sheets.
- A medical product catalog for sales representatives. This currently uses mock data only.

## Repository Architecture

```text
apps/frontend/     Vite, React, React Router, Tailwind CSS, LINE LIFF
apps-script/       Google Apps Script Web App API
packages/shared/   Browser-compatible DTOs, API contracts, and enums
```

There is no NestJS backend in phase 1. The frontend API boundary is designed so Apps Script can be replaced by a future backend adapter.

Backend layering:

```text
Apps Script handler/router > service > repository > Google Sheets
```

Frontend API calls must go through `apps/frontend/src/lib/api.ts`.

## Important Instructions

Read both instruction files before changing code:

- `AGENTS.md`
- `apps/frontend/AGENTS.md` for every change under `apps/frontend/**`

The frontend rules require Thai UI text, React function components, React Router, Tailwind utilities only, reusable UI components, Sarabun/Kanit fonts, and the premium warm light theme.

## Implemented Frontend Routes

### `/products`

Product catalog for medical equipment sales representatives.

Implemented features:

- Responsive mobile-first product grid
- One column on mobile, two to four columns on larger screens
- Search by product name, SKU, brand, or description
- Horizontally scrollable category chips
- Stock-status filter
- Sort controls
- Loading skeleton cards
- Empty state
- Thai currency and date formatting
- View, edit, and share action placeholders
- Web Share API with clipboard fallback
- Eight mock products with local SVG artwork

Important files:

- `apps/frontend/src/pages/ProductListPage.tsx`
- `apps/frontend/src/components/products/ProductCard.tsx`
- `apps/frontend/src/components/products/SearchBar.tsx`
- `apps/frontend/src/components/products/CategoryFilter.tsx`
- `apps/frontend/src/components/products/ProductSkeleton.tsx`
- `apps/frontend/src/data/mock-products.ts`
- `apps/frontend/src/types/product.ts`
- `apps/frontend/src/lib/product.ts`

This route does not use Apps Script yet.

### `/equipment`

Equipment recording and management flow.

Implemented features:

- List equipment owned by the authenticated LINE user
- Create equipment records
- Soft-delete equipment records
- Summary cards
- Mobile card list and desktop table
- Thai UI and confirmation modal

Important files:

- `apps/frontend/src/pages/EquipmentPage.tsx`
- `apps/frontend/src/api/apps-script-equipment-api.ts`
- `apps/frontend/src/api/equipment-api.ts`
- `apps/frontend/src/components/equipment/`

This route requires real LIFF and Apps Script configuration.

### `/`

Redirects to `/products`.

## Local Preview Behavior

There is currently no `apps/frontend/.env.local`.

In Vite development mode, missing LIFF configuration starts the app in preview mode:

- Display name is `โหมดตัวอย่าง`.
- `/products` works with mock data.
- `/equipment` shows a configuration warning.

Production builds still require valid LIFF and API configuration. Do not extend the development fallback to production.

## Required Frontend Environment

Create `apps/frontend/.env.local` from `.env.example` when connecting real services:

```env
VITE_LIFF_ID=<LINE_LIFF_ID>
VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/<DEPLOYMENT_ID>/exec
```

## Google Sheet

A native Google Sheet was created:

- Title: `CK Pharmacy Medical Equipment Database`
- Spreadsheet ID: `1aX4--kZIcmcxcGEljEzall69jZqIUKeCRPSk8zqQEbw`
- URL: https://docs.google.com/spreadsheets/d/1aX4--kZIcmcxcGEljEzall69jZqIUKeCRPSk8zqQEbw/edit

Tabs:

- `equipment`
- `request_log`

The exact headers are documented in `apps-script/README.md`. The sheet has frozen header rows, filters, input validation, date formatting, and Asia/Bangkok timezone.

## Apps Script Configuration And Deployment

The Apps Script source is implemented but has not been connected to a real Apps Script project or deployed in this repository session.

Required Script Properties:

```text
LINE_CHANNEL_ID
SPREADSHEET_ID=1aX4--kZIcmcxcGEljEzall69jZqIUKeCRPSk8zqQEbw
```

Deployment requirements:

1. Create or select an Apps Script project.
2. Add `apps-script/.clasp.json` with its script ID. Do not commit this file.
3. Set the required Script Properties.
4. Run `pnpm --filter apps-script deploy`.
5. Deploy as a Web App executed by the owner and accessible to anyone.
6. Put the deployment URL in `apps/frontend/.env.local`.
7. Configure the frontend URL as the LIFF endpoint and set `VITE_LIFF_ID`.

## API Shape

Apps Script accepts `POST` requests with a `text/plain` JSON body to avoid CORS preflight issues.

Actions:

```text
health.get
equipment.list
equipment.get
equipment.create
equipment.update
equipment.delete
```

Protected requests send a LINE ID token. The backend verifies it against the configured LINE channel ID. Sheet access remains inside the repository layer.

## Tests And Verification

Latest successful verification before this handoff:

```sh
pnpm lint
pnpm test
pnpm build
```

At that point:

- All workspace type checks passed.
- All 10 tests passed: 2 shared, 2 Apps Script, 6 frontend.
- Apps Script and frontend production builds passed.

The in-app browser service was unavailable during visual inspection. Component behavior was verified with Jest and Testing Library, but a real-device LIFF visual pass is still required.

## Git History From This Work Session

```text
a3681f4 fix(frontend): allow local product catalog preview
03e14c8 feat(frontend): add medical product catalog
0189940 refactor(frontend): apply Thai warm-light design system
90b16c5 docs(frontend): add frontend coding guidelines
7db600c feat: implement phase 1 LIFF equipment recorder
```

## Recommended Next Steps

1. Connect and deploy the Apps Script project.
2. Configure LINE LIFF and create `apps/frontend/.env.local`.
3. Run the app inside LINE on a real mobile device.
4. Replace product mock data with shared product contracts and an API abstraction.
5. Define a Google Sheet product schema or future backend schema before implementing product persistence.
6. Implement real product details, edit, and LIFF share flows.
7. Add frontend tests for category filtering, stock filtering, sorting, and share failure behavior.

Do not create a product sheet, migration, backend package, or new infrastructure without explicit approval.
