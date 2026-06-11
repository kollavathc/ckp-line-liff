# Frontend Guidelines

These instructions apply to every file under `apps/frontend/**`. Codex must follow them whenever creating, modifying, reviewing, or refactoring frontend code in this subtree.

## Core Architecture

- Use Tailwind CSS utility classes only. Do not use CSS Modules or inline styles.
- Use React function components and hooks. Class components are prohibited.
- Use React Router for all application routing.
- Use React hooks such as `useState` and `useReducer` for application state.
- All API calls must use the fetch wrapper exported from `src/lib/api.ts`. Components and pages must not call `fetch` directly.
- Put route-level page components in `src/pages/`.
- Put reusable components in `src/components/`.
- Extract repeated UI patterns such as cards, buttons, inputs, and modals into reusable components in `src/components/ui/`.
- Name reusable UI component files and exported components with PascalCase.
- Do not copy and paste the same component structure across pages. Reuse or extend a shared UI component instead.

## Design System

Use a premium warm light theme throughout the application.

- The application is light-only. Do not use a dark theme as the base.
- Use `bg-[#f8f5ef]` or `bg-stone-50` for the root background.
- Use `bg-white` for cards.
- Use `bg-[#f1ede5]` or `bg-stone-100` for nested surfaces.
- Use `text-zinc-900` for default text.
- Use `text-zinc-950` for headings.
- Use `text-zinc-700` for body text.
- Use `text-zinc-500` for muted text.
- Use `border border-stone-200` for borders.
- Use `rounded-2xl` with a light `shadow-sm` or `shadow-md` for cards.
- Favor generous whitespace and a clean, soft, premium, trust-first presentation.
- Do not use `bg-zinc-950`, `bg-zinc-900`, or `text-zinc-100` as base theme colors.

## Color Palette

- Use warm neutrals such as stone, zinc, and amber-tinted neutrals as the primary palette.
- Choose exactly one accent family for the application, such as emerald or cyan. Do not mix multiple accent families.
- Use the accent only for calls to action, active states, highlights, and selected items.
- Use `emerald-500` for success states.
- Use `amber-500` for warning states.
- Use `rose-500` for danger and error states.
- Use `cyan-500` for informational states.

## Typography

- Use the Google Font `Sarabun` for body text.
- Use the Google Font `Kanit` for headings.
- Do not use fonts other than Google Fonts.
- Headings must be bold, crisp, and provide a clear visual hierarchy.
- Keep copy concise, direct, and easy to scan on mobile devices.
- Do not place long paragraphs inside cards or product-detail surfaces.
- Ensure all UI text is easy to read for Thai mobile users.

## Layout

- Use generous whitespace and clear spacing between sections.
- Keep pages premium, calm, modern, and clean.
- Avoid dense layouts and excessive information in a single view.

## Localization

- The application targets Thai users. All visible UI text must be in Thai, including labels, buttons, validation messages, errors, modal copy, and empty states.
- Format currency with a `฿` prefix and comma-separated thousands, for example `฿12,500`.
- Format dates with `Intl.DateTimeFormat('th-TH')`, for example `20 เม.ย. 2026`.

## Responsive Design

- Build mobile-first for screens from 375px wide, including iPhone SE-class devices, then scale to desktop with Tailwind `sm:`, `md:`, and `lg:` breakpoints.
- Use a hamburger menu or bottom navigation on mobile.
- Use a sidebar or top navigation on desktop.
- Use a hamburger-style navigation control when a collapsible mobile menu is required.
- Display summary cards in one column on mobile and three columns on desktop.
- Display dashboard charts in one column on mobile and two or three columns on desktop.
- Render tabular data as a card list on mobile and as a table on desktop.
- Render modals fullscreen on mobile and as centered dialogs on desktop.
- Interactive touch targets must be at least 44px by 44px in accordance with iOS HIG.

## Prohibited Visual Patterns

- Do not use strong gradients.
- Do not use emoji as decorative icons.
- Do not use heavy drop shadows.
- Do not use loud or overly saturated colors.
