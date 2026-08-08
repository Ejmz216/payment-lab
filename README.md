# Payment Lab

Payment Lab is an interactive learning environment for ISO 20022, payment
systems and fast payments.

Instead of teaching financial messaging as a collection of XML schemas,
Payment Lab teaches the business process behind each message through flows,
simulations, scenarios and debugging exercises.

## Modes

- **Fast Payments** — the recommended guided learning path.
- **ISO 20022 Atlas** — explore the message catalog like a map.
- **Lab** — Payment Simulator, Payment Debugger, Identifier Lab, Reject vs. Return Trainer.

Also available: Practice Center (scenarios & quiz), Glossary, Common
Confusions, and local-only Progress tracking.

## Status

This is the MVP build. Tier 1 of the Fast Payments curriculum is complete
(Payment Fundamentals through Reject vs. Return), along with deep dives for
pain.001, pacs.008, pacs.002 and pacs.004. Broader ISO 20022 Atlas coverage
and later curriculum tiers are planned — see `CONTENT_GUIDE.md`.

The V3 direction is tracked in `docs/PAYMENT_LAB_V3_PLAN.md`, with local
Codex working rules in `AGENTS.md`.

## Stack

Vite + React + TypeScript + Tailwind CSS, client-side only, no backend. Uses
`HashRouter` so it deploys cleanly to GitHub Pages.

## Development

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the
site and publishes `dist/` to GitHub Pages. The Vite `base` in
`vite.config.ts` is set to `/payment-lab/` — update it if the repository name
changes.

## Privacy

No backend, no accounts, no analytics, no tracking, no external runtime
network calls. Learning progress is stored only in `localStorage` in your
browser. A "Private Session" toggle disables all progress writes for the
current session.

Never paste confidential, proprietary or production data into any lab
(XML Lab, Simulator, Debugger, etc.) — use only synthetic, public or
authorized examples.

## Content principles

- Every example uses fictional data (`BANK_A`, `Alice Example`, `XXX`, etc.).
- Content is tagged as **REFERENCE**, **SIMPLIFIED MODEL**, **SIMULATION**, or
  **DEPENDS ON SCHEME** so it's always clear what kind of claim is being made.
- No content asserts a rule as universal ISO 20022 behavior unless it can be
  backed by a citable source (see `Sources & references` on lesson/message
  pages).
