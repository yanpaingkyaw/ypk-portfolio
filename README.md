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
- Node.js/npm for the Tailwind build command

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
├── package.json
├── package-lock.json
└── tailwind.config.js
```

## Local development

### Prerequisites

- Node.js and npm
- A modern browser
- A local static HTTP server for browser testing

### Install dependencies

```bash
npm install
```

### Build CSS

```bash
npm run build:css
```

This scans `index.html` and writes the minified output to `css/tailwind.min.css`.

### Run locally

There is no application server or `npm start` script. Serve the repository root with a static server:

```bash
python3 -m http.server 8000
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
- Run `npm run build:css` after changing Tailwind classes or `tailwind.config.js`.

Preserve accessibility features, responsive behavior, external script integrity attributes, and reduced-motion support.

## Validation

Run JavaScript syntax checks:

```bash
for file in js/*.js; do node --check "$file"; done
```

Manually verify theme switching, mobile navigation, project filtering, experience expansion, chart interactions, résumé download, contact links, keyboard navigation, and reduced-motion behavior.

The current test script is not implemented:

```bash
npm test
```

It currently exits with `Error: no test specified`. This is a known project limitation, not an application test result.

## Deployment

Deploy the repository root to a static hosting provider such as Vercel, Netlify, GitHub Pages, or a static web server. No environment variables are currently needed.

The deployment must include:

- `index.html`
- `css/`
- `js/`
- `assets/`

The page loads Inter, Alpine.js, D3.js, and Anime.js from external CDNs at runtime. If offline or self-contained deployment is required, those dependencies and the font must be downloaded and served locally.

## Security and privacy notes

- Contact details are public page content. Base64 encoding in `js/data.js` is obfuscation, not encryption.
- External CDN scripts use Subresource Integrity attributes in `index.html`.
- D3 chart labels currently use trusted local data. Sanitize or avoid HTML-string rendering if the data source becomes editable or remote.

