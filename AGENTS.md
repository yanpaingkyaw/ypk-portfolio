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
- Build tooling: Node.js 24/npm, Tailwind CSS, and the Netlify CLI for deploys
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
| `scripts/` | Static build assembly and build-output checks |
| `.github/workflows/deploy.yml` | GitHub Actions build, PR preview, and production deployment workflow |
| `netlify.toml` | Netlify build command and publish directory |
| `.nvmrc` | Node.js major version shared by local development and CI |

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

Install the locked dependencies with Node.js 24:

```bash
npm ci
```

Build the site after changing content, scripts, styles, or Tailwind configuration:

```bash
npm run build
```

This compiles Tailwind, assembles the deployable site in `dist/`, and checks required output files and local asset references. The generated `dist/` directory is ignored by Git. Use `npm run build:css` when only the Tailwind stylesheet needs to be regenerated.

There is no `start` script. Serve the repository root with any static HTTP server, for example:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000/` in a browser. Opening `index.html` directly may limit browser behavior and is not the preferred verification method. To preview the deployable output, first run `npm run build`, then serve `dist/`:

```bash
python3 -m http.server 8000 --directory dist
```

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

## CI/CD and deployment

`.github/workflows/deploy.yml` builds and checks the site for pull requests targeting `main` and for pushes to `main`. A same-repository pull request creates a non-production Netlify preview and writes its URL to the Actions summary. Fork pull requests run the build checks but skip deployment because GitHub does not provide Actions secrets to fork workflows. A successful push to `main` deploys `dist/` to production.

Configure these repository secrets in GitHub Actions:

- `NETLIFY_AUTH_TOKEN`: a Netlify personal access token used by the deploy CLI.
- `NETLIFY_SITE_ID`: the ID of the existing Netlify site.

The workflow uses Node.js 24, as recorded in `.nvmrc`. Netlify configuration sets `npm run build` as the build command and `dist` as the publish directory. The workflow builds in GitHub Actions and uploads the already-built `dist/` directory with the Netlify CLI.

If the Netlify site is already connected to this GitHub repository for automatic builds, disable that Git-based build trigger to avoid duplicate deployments. Keep `dist/` out of commits; CI creates it for each build.
