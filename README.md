# LabelCheck — Product Label Compliance Checker (Prototype)

Prototype built for **Smart India Hackathon 2026, problem statement SIH26034**.

This is a **demo prototype only**. It does not perform real OCR or apply real
Legal Metrology rules — analysis results are simulated so the full user
experience can be reviewed end-to-end before the real pipeline is built.
Nothing in this app should be treated as a legal compliance certification.

## Install and run locally

```bash
cd labelcheck
npm install
npm run dev
```

Then open the URL Vite prints (typically `http://localhost:5173`).

To build a production bundle:

```bash
npm run build
npm run preview
```

## Using the demo

1. On the login screen, click **Continue with demo account** (or fill in any
   email/password — auth is not connected to a real identity system).
2. From the dashboard, go to **New Inspection**, upload any product photo,
   and click **Analyze Product**. The app simulates a multi-stage analysis
   and generates a plausible (mock) compliance result.
3. **Inspection History** and **Reports** list both the seeded demo data and
   anything you analyze in the current session (state resets on page reload —
   there is no backend or database yet).

## Folder structure

```
src/
  components/
    layout/       Sidebar, top bar, protected app shell
    ui/            Generic pieces: stat cards, status badges, charts, tables
    inspection/    Upload dropzone, bounding-box overlay, progress stepper
  pages/           One file per route (Login, Dashboard, New Inspection, ...)
  data/            Mock seed data and mock-result templates
  lib/
    analysisEngine.js   The "pipeline" — currently simulated, see below
    utils.js            Small formatting/helper functions
  context/         React context for auth state and the in-memory inspection store
```

## Replacing the mock pipeline with a real one

All simulated logic lives behind `src/lib/analysisEngine.js`, which exposes a
single function, `runComplianceAnalysis(imageFile, onStageChange)`. Internally
it is already split into named stage functions that map onto the intended
real pipeline:

```
image → OCR → text extraction → declaration identification
      → product / category identification → Legal Metrology rules engine
      → compliance result → report generation
```

To connect a real backend:

1. Replace the stage functions in `analysisEngine.js` with real API calls
   (e.g. to an OCR service and a rules-engine service).
2. Keep the returned shape the same as `buildMockResult` in
   `src/data/mockAnalysisTemplates.js` (`productName`, `category`, `score`,
   `status`, `checks[]`, `boxes[]`, `issues[]`, `recommendations[]`,
   `manualVerification[]`) — the UI does not need to change if the shape is
   preserved.
3. Add a backend/API layer and swap `InspectionContext`'s in-memory array for
   real persistence (a database or API) once one exists.

## Notes on what's real vs. simulated

- **Real**: routing, layout, upload UI, drag-and-drop, history search/filter,
  report layout, PDF export via the browser's print dialog, JSON export,
  and (as of the OCR milestone) OCR text extraction and basic field
  pattern-matching.
- **Simulated / not yet implemented**: bounding-box coordinates, product
  category identification, and the full Legal Metrology rules engine —
  the compliance score and status are a simple placeholder calculation
  based on which fields were found in the OCR text, not a legal
  compliance determination.

## Responsive behavior

The layout now adapts across phone, tablet and desktop widths without any
change to the desktop visual design:

- **Below 768px** (`md` breakpoint): the permanent left sidebar is replaced
  by a hamburger button in the top bar. Tapping it opens the navigation as a
  slide-in drawer with a backdrop; tapping a link, tapping the backdrop, or
  tapping the drawer's close button all dismiss it. The drawer also closes
  automatically on route change.
- **At 768px and above**: the sidebar is permanent again and the top bar
  shows its full title/description/user-info/sign-out layout — pixel-for-
  pixel the same classes as before this change.
- **At 1024px and above**: page layouts that split into columns (dashboard
  charts, the analysis-result and report image/checklist panels) render
  exactly as before; below that they stack vertically.
- Dashboard stat cards already used a 1/2/4-column responsive grid; the
  status-breakdown donut chart's legend now wraps below the chart instead of
  overflowing when the card gets narrow.
- Tables (recent inspections, inspection history) scroll horizontally
  *within their own bordered container* on very narrow screens rather than
  forcing the whole page to scroll sideways — this is the "scroll only where
  absolutely necessary" case called out in the requirements; every other
  page reflows instead of scrolling.
- Verified by inspecting layout classes at 375px, 425px, 768px and 1024px
  viewport widths (iPhone SE/12–14, common Android widths, iPad portrait,
  and small-desktop breakpoints).

## Product Authentication / Anti-Counterfeit (new)

A second, independent feature alongside label compliance: manufacturers can
register a genuine product to get a **Digital Product Fingerprint**, serial
number and QR code; anyone can then verify that identity before trusting a
product. This does **not** replace or change the existing OCR/compliance
flow — it's a separate, complementary check (see the "Optional: run a label
compliance check" link on the verification result).

**New pages** (all public — no inspector login required, since consumers
and manufacturers use them):
- `/verify` — Verify Product: scan a QR code with the camera, or type in a
  fingerprint/serial. Shows **Likely Genuine**, **Suspicious**, or
  **High Counterfeit Risk**, never a claim of 100% authenticity.
- `/manufacturers` — For Manufacturers: register a product and get its
  fingerprint, serial and QR code.
- `/manufacturers/dashboard` — registration/scan statistics.
- `/scan-history` — every verification performed in this browser.

These are also linked from the existing inspector sidebar (new "Product
Authentication" group) so inspectors can jump straight to them.

**How it works:**
- `src/lib/idGenerators.js` — generates fingerprints/serials with
  `crypto.getRandomValues`/`crypto.randomUUID` (never `Math.random()`, never
  sequential/guessable values). No secrets are involved — these are public
  identifiers, like a serial number printed on a box.
- `src/lib/productRegistryService.js` — the only place that touches
  `localStorage`. A small function API (`registerProduct`, `findProduct`,
  `recordScanAndEvaluate`, `getRegistryStats`, ...) that the UI calls; swap
  its internals for real API calls later without touching any page.
- Repeated-scan detection is a **simple, transparent prototype rule**
  (3+ scans of the same identity within 2 minutes → "Suspicious"), clearly
  labelled as such in the code — not a real fraud-detection system.
- QR generation uses the `qrcode` package; QR scanning uses the browser's
  camera (`getUserMedia`) plus the `jsqr` package to decode frames — both
  small, dependency-light, well-established libraries, chosen specifically
  to avoid adding a heavy scanning framework.

**Prototype storage notice:** products and scans are stored in the
browser's `localStorage`, per-device/per-browser only — there is no server,
no database, and no data shared between devices. Clearing site data resets
the registry (a couple of demo products are re-seeded automatically).

