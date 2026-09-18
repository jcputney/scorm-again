# Website

This site is built with [VitePress](https://vitepress.dev/).

## Install

```bash
npm ci
```

## Local development

```bash
npm run dev
```

Starts a dev server with hot reload at http://localhost:5173/scorm-again/.

## Build

```bash
npm run build
```

Writes the static site to `.vitepress/dist`. Preview it with `npm run preview`.

## Layout

- `docs/` — documentation pages, served under `/scorm-again/docs/`
- `index.md` — the landing page
- `demo.md` — the interactive demo index
- `public/` — static assets copied to the site root, including the `demo/`
  harness pages. CI drops the built library into `public/demo/dist/`.
- `.vitepress/config.ts` — nav, sidebar, search, and theme configuration
- `.vitepress/theme/` — default theme plus brand CSS and Umami click tracking

## Analytics

Umami pageview and session replay tracking is gated on the `UMAMI_HOST` and
`UMAMI_SITE_ID` environment variables and only enabled when
`NODE_ENV=production`. The two `<script>` tags (`script.js` for events,
`recorder.js` for session replay) are injected via `.vitepress/config.ts`.
Click events (hero CTAs, sidebar links, code copy, outbound links), anchor
views, and 404s are tracked in `.vitepress/theme/umamiTracking.ts`. CI passes
the two values in from repository secrets in `.github/workflows/pages.yml`.
