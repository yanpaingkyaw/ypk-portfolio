# Ticket #2: initialization, motion, accessibility, and biography fixes

Implemented on 16 November 2026 for [GitHub issue #2](https://github.com/yanpaingkyaw/ypk-portfolio/issues/2). This report records implementation and local verification; review, deployment, and issue closure are tracked through the pull request.

## Changes

| File | Fix |
| --- | --- |
| `index.html` | Removed the explicit `x-init="init()"` call. Alpine's automatic `init()` lifecycle is the single startup path. Updated timeline instructions to describe keyboard use. |
| `js/app.js` | Section navigation checks the current reduced-motion preference and chooses instant or smooth scrolling. |
| `js/charts.js` | Radar and timeline transitions run only when reduced motion is disabled. Changing the preference redraws charts in the appropriate state. Timeline navigation also respects the preference. |
| `js/charts.js` | Skill points are keyboard focusable, with accessible names containing the skill and proficiency. Focus shows a positioned tooltip; blur, Escape, or an outside click dismisses it. Pointer and touch interactions remain available. |
| `js/charts.js` | The shared tooltip has a tooltip role and an active `aria-describedby` relationship. Hidden tooltips do not intercept pointer input. Pointer users can move onto the tooltip without losing it. Tooltip text is rendered with `.text()`. |
| `js/charts.js` | Timeline entries have button semantics, descriptive names, and Enter/Space activation. Activation focuses the destination accordion button without an extra automatic scroll, then scrolls to the role and retains its temporary highlight. |
| `js/charts.js` | Chart redraws preserve the focused chart entry and clear stale tooltip references. |
| `css/custom.css` | Added theme-aware visible focus outlines for chart controls, hidden/visible tooltip states, a viewport width limit, and a reduced-motion rule for tooltip fading. |
| `js/data.js` | Changed the biography to “19+ years,” matching the statistics and page metadata. |
| `index.html` | Removed the redundant root `scroll-smooth` class, which overrode the less-specific reduced-motion CSS rule. Existing custom CSS still provides smooth scrolling when allowed. |
| `index.html`, `css/tailwind.min.css` | Added `min-w-0` to the skills grid children and regenerated Tailwind. This prevents the previous SVG width from keeping the grid too wide after a desktop-to-mobile resize. |

The existing static HTML, Alpine.js, D3.js, Anime.js, and Tailwind architecture remains in place. External script versions, order, and integrity attributes were preserved. Dependency upgrades belong to separate tickets.

## Validation results

Validated with Node.js **24.22.3** and a temporary Playwright/Chromium harness against `dist/`, served over local HTTP.

| Check | Result |
| --- | --- |
| `npm ci` | Passed with the existing lockfile. |
| `node --check` for every file in `js/` and `scripts/` | Passed. |
| `npm run build` | Passed; all nine required output files and local references passed the build checks. |
| Startup | Instrumented the Alpine `init()` method and observed one invocation per load; chart node counts match profile data, with one shared tooltip. |
| Reduced motion | Both charts render their final geometry without transition attributes; navigation requests instant scrolling; computed root scroll behavior is `auto`. Switching the preference redraws charts correctly. |
| Keyboard skills access | Tab reaches skill points; labels include proficiency; focus shows the tooltip; Escape and blur dismiss it; visible focus styling is present. |
| Keyboard timeline access | Enter and Space move focus to the matching role button; that button can open the experience details. |
| Chart redraw | Focus survives a chart redraw. |
| Pointer and simulated touch | Hover displays the tooltip; moving onto it keeps it visible; leaving dismisses it. A dispatched `touchend` displays the tooltip. |
| Themes | Dark and light choices persist through reloads. |
| Existing controls | Desktop navigation, mobile menu selection and Escape dismissal, every project filter, and experience expansion passed browser checks. |
| Assets and contacts | The résumé PDF returns HTTP 200; rendered email and telephone links are present. |
| Responsive layout | At 390 px after a desktop resize, document width equals viewport width, with no horizontal overflow. The tooltip stays within the viewport. |
| Browser errors | No uncaught page errors were observed in the successful run. |
| `git diff --check` | Passed. |

The browser harness and browser tooling were installed outside the repository for this verification. They are not a committed test suite. `npm test` remains the existing placeholder and was not reported as passing.

The build still reports outdated Browserslist data. Installation also reports 22 dependency audit findings (3 low, 17 moderate, 2 high); dependency remediation was not included in this UI fix.

## Manual verification before release

1. With normal motion enabled, load the site and confirm hero, reveal, counter, and chart animations look correct. Navigate using desktop and mobile controls.
2. Enable reduced motion, reload, and navigate using section controls, the skip link, and timeline entries. Confirm scrolling is immediate and charts appear in their final state.
3. Tab through every skill point. Confirm the visible tooltip matches the accessible label, Escape dismisses it, and moving focus dismisses the old tooltip.
4. Tab through timeline entries and activate them with Enter and Space. Confirm focus reaches the correct role button and the details can be opened and closed.
5. Repeat chart interactions in light and dark themes. Resize while a chart entry has focus and confirm focus remains usable.
6. On a real touch device, check skill tooltips, timeline navigation, mobile navigation, and layout. Confirm résumé download and email/telephone actions with the intended applications.

Chromium automation does not replace screen-reader testing, real-device touch testing, or Firefox/Safari checks. Those checks and a deployed preview remain outstanding.
