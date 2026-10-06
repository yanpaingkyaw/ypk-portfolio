# Repository Instructions

## Project overview

This repository contains a single-page personal portfolio and résumé website for Yan Paing Kyaw. It is a client-only static site. There is no backend, API, database, authentication system, form handler, or server-side rendering.

Keep changes aligned with the existing HTML, Alpine.js, D3.js, Anime.js, Tailwind CSS, and custom CSS architecture. Do not migrate the project to React, Next.js, Vue, or another framework unless the user explicitly requests it.

## Technology and runtime

- HTML entry point: `index.html`
- Client-side state and UI behavior: Alpine.js loaded from a CDN
- Data visualization: D3.js loaded from a CDN
- Animation: Anime.js loaded from a CDN
- Styling: Tailwind CSS 3 generated into `css/tailwind.min.css`, plus `css/custom.css`
- Build tooling: Node.js/npm with Tailwind CSS as the only package dependency
- Static assets: `assets/resume.pdf` and `assets/ypk.jfif`

The runtime libraries are loaded in `index.html`. Preserve their script order and Subresource Integrity attributes when editing external script tags.

## Repository structure

| Path | Responsibility |
| --- | --- |
| `index.html` | Page structure, Alpine templates, metadata, CDN references, and content sections |
| `js/data.js` | The `PROFILE` data model used by the page |
| `js/app.js` | Alpine application state, theme switching, navigation, filtering, and observers |
| `js/charts.js` | D3 skills radar chart, experience timeline, and chart tooltips |
| `js/animations.js` | Hero animation, scroll reveals, and animated statistics |
| `css/tailwind.css` | Tailwind directives used as the build input |
| `css/tailwind.min.css` | Generated Tailwind output served by the site |
| `css/custom.css` | Theme variables, layout styles, custom components, accessibility, and motion rules |
| `tailwind.config.js` | Tailwind content scanning, dark-mode configuration, font, and accent color settings |
| `assets/` | Résumé and profile image |

## Content changes

- Update biography, contact details, experience, skills, projects, education, certifications, languages, and navigation labels in `js/data.js`.
- Keep the existing `PROFILE` property names unless all consumers in `index.html`, `js/app.js`, and `js/charts.js` are updated together.
- Contact information is Base64-obfuscated with `atob()`, but it is still public client-side data. Do not treat it as a secret.

## UI and behavior changes

- Update semantic structure and Alpine directives in `index.html`.
- Update application state and interactions in `js/app.js`.
- Update visualizations only in `js/charts.js`; use CSS variables from `css/custom.css` for theme-aware colors.
- Update animations only in `js/animations.js` and preserve `prefers-reduced-motion` support.
- Keep the skip link, ARIA labels, keyboard interactions, responsive layout, and reduced-motion behavior intact.
- Chart HTML currently uses trusted local data. If data ever becomes user-controlled or remotely supplied, avoid unsanitized `innerHTML`/D3 `.html()` rendering.

## Development commands

Install dependencies:

```bash
npm install
```

Build the Tailwind stylesheet after changing Tailwind classes or configuration:

```bash
npm run build:css
```

There is no `start` script. Serve the repository root with any static HTTP server, for example:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000/` in a browser. Opening `index.html` directly may limit browser behavior and is not the preferred verification method.

## Validation

At minimum, after JavaScript changes run syntax checks for every file:

```bash
for file in js/*.js; do node --check "$file"; done
```

After UI changes, manually verify:

- Desktop and mobile navigation
- Light/dark theme persistence
- Project filters
- Experience accordion and timeline links
- Skills chart tooltips
- Résumé download and contact links
- Keyboard navigation and reduced-motion behavior

The current `npm test` script is a placeholder that exits with an error. Do not report the project as having a passing automated test suite unless a real test suite is added.

## Deployment

Deploy the repository as a static site with `index.html` as the root document. No environment variables or server-side services are currently required. Ensure `assets/`, `css/`, and `js/` are deployed with the HTML file, and ensure the generated `css/tailwind.min.css` is up to date.

