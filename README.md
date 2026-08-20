# Password Strength Checker

A simple, responsive web app that assesses password strength against common password-security rules. All analysis runs locally in the browser — your password never leaves your device.

**Live demo:** https://dev-rudran.github.io/Password-Strength-Test/

## Features

- **Live analysis** — strength updates as you type
- **Requirement checklist** — length, uppercase, lowercase, number, special character
- **Strength classification** — Weak / Medium / Strong with a segmented meter
- **Actionable suggestions** — tells you exactly what to add to improve your password
- **Show/hide toggle** — with an accessible eye icon
- **Clear button** — resets the checker instantly
- **Privacy-first** — no storage, no logging, no network calls
- **Dark navy UI** — modern, high-contrast, mobile-friendly

## Tech Stack

- [React](https://react.dev/) 18
- [Vite](https://vite.dev/) 6
- Plain CSS (no UI framework)

## Getting Started

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`).

## Scripts

| Command            | Description                |
| ------------------ | -------------------------- |
| `npm run dev`      | Start the dev server       |
| `npm run build`    | Build for production       |
| `npm run preview`  | Preview the production build |

## How It Works

Each password is scored 1 point per satisfied criterion:

| Criterion            | Score |
| -------------------- | ----- |
| 8+ characters        | +1    |
| Uppercase letter     | +1    |
| Lowercase letter     | +1    |
| Number               | +1    |
| Special character    | +1    |

**Strength:**
- 0–2 points → **Weak**
- 3–4 points → **Medium**
- 5 points → **Strong** (requires at least 12 characters)

A password shorter than 8 characters is never classified as Strong.

## Deployment

This repo auto-deploys to GitHub Pages via [GitHub Actions](.github/workflows/deploy.yml) on every push to `main`.

## Privacy

- Passwords are never sent to any API
- Never stored in `localStorage` or cookies
- Never logged to the console
- All checks run in-memory in your browser only