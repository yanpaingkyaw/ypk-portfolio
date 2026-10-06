# Yan Paing Kyaw Portfolio

A responsive, single-page personal portfolio and résumé website for Yan Paing Kyaw, a technology leader and Chief Technology Officer.

The site presents professional experience, skills, selected projects, education, certifications, languages, contact information, and a downloadable résumé.

## Features

- Responsive single-page layout
- Light and dark themes with local preference persistence
- Mobile navigation menu
- Scroll-aware active navigation state
- Expandable experience details
- Interactive D3.js career timeline
- D3.js skills radar chart with tooltips
- Project filtering by domain
- Animated hero content, section reveals, and statistics
- Reduced-motion support
- Keyboard skip link and semantic interactive controls
- Résumé download and `mailto:`/`tel:` contact links

## Technology stack

- HTML5
- Alpine.js for lightweight client-side state and templating
- D3.js for charts and the experience timeline
- Anime.js for animations
- Tailwind CSS 3 for utility classes
- Custom CSS variables and components in `css/custom.css`
- Node.js 24/npm for the build
- Netlify CLI for GitHub Actions deployments

The application has no backend, API, database, authentication, or server-side rendering. It can be hosted on any static web host.

## Architecture

```text
index.html
  ├── Alpine.js: state, templates, navigation, theme, filtering
  ├── js/data.js: PROFILE content model
  ├── js/charts.js: D3 radar chart and career timeline
  ├── js/animations.js: Anime.js animations and scroll reveals
  ├── css/tailwind.min.css: generated utility CSS
  ├── css/custom.css: themes, layout, accessibility, and custom components
  └── assets/: résumé PDF and profile image
```

`js/data.js` is the content source of truth. The HTML renders that data through Alpine.js templates. Charts and animations read the same data and are refreshed when the theme or viewport changes.

`npm run build` compiles Tailwind and assembles the deployable static files into `dist/`; the source assets remain in their existing directories.

## Project structure

```text
.
├── assets/
│   ├── resume.pdf
│   └── ypk.jfif
├── css/
│   ├── custom.css
│   ├── tailwind.css
│   └── tailwind.min.css
├── js/
│   ├── animations.js
│   ├── app.js
│   ├── charts.js
│   └── data.js
├── index.html
├── scripts/
│   ├── build-site.js
│   └── check-build.js
├── .github/workflows/deploy.yml
├── netlify.toml
├── .nvmrc
├── package.json
├── package-lock.json
└── tailwind.config.js
```

## Local development

### Prerequisites

- Node.js 24 and npm
- A modern browser
- A local static HTTP server for browser testing

### Install dependencies

```bash
npm ci
```

### Build the site

```bash
npm run build
```

This compiles Tailwind to `css/tailwind.min.css`, assembles a clean `dist/` deployment directory, and checks required files and local asset references. The `dist/` directory is generated and ignored by Git. To regenerate only the Tailwind stylesheet, run `npm run build:css`.

### Run locally

There is no application server or `npm start` script. After building, serve the deployable output with a static server:

```bash
python3 -m http.server 8000 --directory dist
```

Open [http://localhost:8000/](http://localhost:8000/) in a browser.

## Updating portfolio content

Edit [`js/data.js`](js/data.js) to update:

- Name, title, company, location, and contact information
- Summary and profile statistics
- Employment history and role highlights
- Skills and chart categories
- Featured projects and filter categories
- Education, certifications, languages, and navigation labels

Keep the existing data property names unless the corresponding templates and JavaScript consumers are updated as well.

## Styling and behavior changes

- Use [`index.html`](index.html) for page structure and Alpine.js bindings.
- Use [`js/app.js`](js/app.js) for application state and general interactions.
- Use [`js/charts.js`](js/charts.js) for D3 visualizations.
- Use [`js/animations.js`](js/animations.js) for motion and scroll effects.
- Use [`css/custom.css`](css/custom.css) for theme variables and custom styles.
- Run `npm run build` after changing Tailwind classes or `tailwind.config.js`.

Preserve accessibility features, responsive behavior, external script integrity attributes, and reduced-motion support.

## Validation

Run the production build and output checks:

```bash
npm run build
```

The project does not yet have a separate automated application test suite. You can also run JavaScript syntax checks:

```bash
for file in js/*.js; do node --check "$file"; done
```

Manually verify theme switching, mobile navigation, project filtering, experience expansion, chart interactions, résumé download, contact links, keyboard navigation, and reduced-motion behavior.

The current test script is not implemented:

```bash
npm test
```

It currently exits with `Error: no test specified`. This is a known project limitation, not an application test result.

## CI/CD and Netlify deployment

GitHub Actions runs the build and output checks on pull requests targeting `main` and on pushes to `main`. Successful pushes to `main` deploy the built `dist/` directory to Netlify production. Same-repository pull requests receive a non-production Netlify preview URL in the Actions summary. Fork pull requests still run build checks, but skip deployment because GitHub does not expose Actions secrets to fork workflows.

Add the repository secrets in [GitHub Actions secrets](https://github.com/yanpaingkyaw/ypk-portfolio/settings/secrets/actions):

- `NETLIFY_AUTH_TOKEN`: create a personal access token in Netlify under **User settings → Applications → Personal access tokens → New access token**. Give it a recognizable name such as `GitHub Actions ypk-portfolio`, choose an expiration, generate it, and copy it immediately; Netlify only shows the value once. Paste it into a new GitHub repository secret named `NETLIFY_AUTH_TOKEN`. Never commit or send the token in chat. See [Netlify's token instructions](https://docs.netlify.com/api-and-cli-guides/cli-guides/get-started-with-cli/#obtain-a-token-in-the-ui).
- `NETLIFY_SITE_ID`: the existing site's **Project ID**, available in Netlify under **Project configuration → General**. This repository's `NETLIFY_SITE_ID` secret is already configured.

The build uses Node.js 24, specified in `.nvmrc`. [`netlify.toml`](netlify.toml) declares `npm run build` and `dist` as the build command and publish directory. GitHub Actions builds the site and sends the result to Netlify through the CLI.

Netlify's Git-based automatic builds are stopped for this site so the GitHub Actions workflow is the deploy trigger. Do not commit `dist/`; the workflow creates it for each run. The application itself has no runtime environment variables or backend services.

The page loads Inter, Alpine.js, D3.js, and Anime.js from external CDNs at runtime. If offline or self-contained deployment is required, those dependencies and the font must be downloaded and served locally.

## Security and privacy notes

- Contact details are public page content. Base64 encoding in `js/data.js` is obfuscation, not encryption.
- External CDN scripts use Subresource Integrity attributes in `index.html`.
- D3 chart labels currently use trusted local data. Sanitize or avoid HTML-string rendering if the data source becomes editable or remote.
