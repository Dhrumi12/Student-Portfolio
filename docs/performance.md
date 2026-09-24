# Practical 8: Performance Optimization and Lazy Loading

## Implementation

The route components that are not needed on the first page are loaded with
`React.lazy()` in `src/App.jsx`:

- `Projects` loads when `/projects` is visited.
- `Contact` loads when `/contact` is visited.
- The route block is wrapped in `Suspense` with an accessible `Loading page...`
  status fallback.

`NavBar`, `Home`, authentication pages, and the fallback remain in the initial
bundle so the application can render its shell immediately.

## Build comparison

The baseline was measured by temporarily changing the two lazy imports to
static imports, running `npm run build`, and then restoring the lazy imports.

| Build | Initial JavaScript | Gzip | Route chunks |
| --- | ---: | ---: | --- |
| Before code splitting | 244.08 kB | 77.27 kB | None |
| After code splitting | 237.22 kB | 75.61 kB | `Projects` 4.84 kB, `Contact` 2.41 kB |

The initial JavaScript payload decreased by 6.86 kB raw and 1.66 kB gzip,
approximately 2.8% and 2.1%. The complete-session payload is similar because
the route code is still downloaded when its route is visited. The benefit is
that the first view can begin sooner and users who never open a route do not
download its code.

The optimized build output was:

```text
dist/assets/index-BE-bU9H1.js     237.22 kB | gzip: 75.61 kB
dist/assets/Contact-cJNCOfba.js     2.41 kB | gzip: 1.01 kB
dist/assets/Projects-ByPsDUmR.js    4.84 kB | gzip: 1.66 kB
```

## DevTools evidence procedure

1. Run `npm run build` and record the Vite output above.
2. Start the app with `npm run dev` and open the Network tab.
3. Enable Disable cache, reload `/`, and record transferred JavaScript and load
   time for the initial view.
4. Set throttling to Slow 3G, visit `/projects` or `/contact`, and verify that
   the `Loading page...` fallback appears before the matching chunk finishes.
5. Return to the Network tab and record the route chunk request. Repeat once
   with the route to show that the browser cache avoids downloading it again.

## Analysis

The entry bundle is downloaded during the initial page load. A lazy chunk is
requested only when React renders the matching route. Lazy loading improves
perceived performance by prioritizing the code required for the first view,
even though the total code downloaded over a complete visit can be similar.
For a very small application, the extra requests and loading state may cost
more complexity than they save.

## Reflection

The main implementation mistake to avoid is using a named-only export with
`React.lazy()`: each lazy-loaded component must have a default export. This
project's `Projects` and `Contact` components use default exports, so their
chunks build and load successfully.

The React DevTools Profiler should be used during the browser portion of the
lab to record one unnecessary re-render. The CLI build verifies bundle
splitting, but it cannot provide a genuine render-profile measurement.# Practical 8 - Performance Optimization

## Objective

Projects and Contact now use route-based code splitting with `React.lazy()` and `Suspense`. Their JavaScript is requested when the route is visited instead of being included in the initial application bundle.

## Before Optimization

Captured with `npm run build` before the lazy-loading change:

| Metric | Before |
| --- | --- |
| Main JavaScript | `dist/assets/index-BbtS8ZoA.js` - 243.95 kB, 77.23 kB gzip |
| JavaScript chunks | 1 application JavaScript file |
| CSS | `dist/assets/index-DoEsvrpl.css` - 7.68 kB, 2.48 kB gzip |
| HTML | `dist/index.html` - 0.46 kB, 0.29 kB gzip |
| Browser Network transferred JS | Not measured before the edit |
| Browser load timing | Not measured before the edit |

## After Optimization

Captured with `npm run build` after the lazy-loading change:

| Metric | After |
| --- | --- |
| Main JavaScript | `dist/assets/index-BE-bU9H1.js` - 237.22 kB, 75.61 kB gzip |
| Projects route chunk | `dist/assets/Projects-ByPsDUmR.js` - 4.84 kB, 1.66 kB gzip |
| Contact route chunk | `dist/assets/Contact-cJNCOfba.js` - 2.41 kB, 1.01 kB gzip |
| CSS | `dist/assets/index-eiuI3kxk.css` - 7.89 kB, 2.52 kB gzip |
| HTML | `dist/index.html` - 0.46 kB, 0.29 kB gzip |
| Browser Network transferred JS | Not measured in this session |
| Browser load timing | Not measured in this session |

The build confirms separate route chunks were emitted. The main JavaScript bundle decreased from 243.95 kB to 237.22 kB, a reduction of 6.73 kB before gzip.

## Lazy-loaded Routes

- `/projects` loads `src/components/Projects.jsx` on navigation.
- `/contact` loads `src/components/Contact.jsx` on navigation.
- The existing protected route and all other routes remain unchanged.

## Fallback UI

The existing Routes block is wrapped in React Suspense. While a lazy route module is loading, the page displays `Loading page...` in a styled status panel.

## Network Testing

To capture browser evidence:

1. Run `npm run dev`.
2. Open `http://localhost:5173`.
3. Open DevTools with `F12` or `Cmd+Option+I` on macOS.
4. Select **Network**, enable **Disable cache**, and filter by **JS**.
5. Reload Home and record the initial JavaScript file count, transferred size, and load timing.
6. Navigate to `/projects` and record the additional `Projects-*.js` request.
7. Navigate to `/contact` and record the additional `Contact-*.js` request.
8. Select **Slow 3G**, reload, and navigate to each route to make the Suspense fallback easier to observe.

Do not compare browser transfer values with the build values above without recording them from the same browser session.

## React Profiler

A profiler recording was not captured in this session. To collect it, install or open React DevTools, select **Profiler**, press **Start profiling**, navigate between Home, Projects, and Contact, interact with the task form, stop recording, and inspect the commit flamegraph and ranked render list. Record only renders shown by the profiler; do not infer an unnecessary render without evidence.

## Additional Lazy-loaded Component

The existing project does not contain a genuinely heavy chart, visualization, or third-party data component. No large dependency or artificial heavy component was added solely to satisfy this practical. Projects and Contact are the two meaningful route-level splits supported by the current application.

## Screenshot Evidence

Capture these screenshots for the lab file:

1. Baseline `npm run build` output.
2. Baseline browser Network tab filtered to JS.
3. `React.lazy()` declarations in `src/App.jsx`.
4. `Suspense` and the fallback in `src/App.jsx`.
5. After `npm run build` output showing `Projects-*.js` and `Contact-*.js`.
6. Network tab showing the Projects lazy chunk request.
7. Network tab showing the Contact lazy chunk request.
8. Slow 3G with `Loading page...` visible, if the fallback remains visible long enough.
9. React DevTools Profiler recording, if captured.

## Verification

- `npm run build` passed after the change.
- `npm run lint` passed after the change.
- Existing backend, MongoDB, authentication, task CRUD, and route paths were not modified.
