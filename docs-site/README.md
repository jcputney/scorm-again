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
