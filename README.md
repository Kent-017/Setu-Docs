# Setu Docs Site

Documentation site for Setu, built on the Stackbox documentation standard.

Built with React 19 + Vite. Single-file architecture — the entire app (components, content, theming, markdown renderer) lives in `src/App.jsx`.

## Tech Stack

- **React 19** (functional components, hooks)
- **Vite 8** (dev server + build)
- **Camber Trial** font (self-hosted) with Google Fonts fallbacks
- **Zero UI libraries** — no Tailwind, no component libraries. All styling is inline with CSS variables for theming.
- **Netlify** for hosting (SPA routing via `netlify.toml`)

## Prerequisites

- **Node.js** 18+ (recommended: 20 LTS)
- **npm** 9+ (ships with Node)

Check your versions:

```bash
node --version
npm --version
```

## Getting Started

Clone the repo and install dependencies:

```bash
git clone <your-repo-url>
cd setu-docs-site
npm install
```

Start the dev server:

```bash
npm run dev
```

The site will be available at **http://localhost:5173**. Vite hot-reloads on save.

## Available Scripts

| Command | What it does |
|---------|--------------|
| `npm run dev` | Start the dev server at `http://localhost:5173` with hot reload |
| `npm run build` | Production build → outputs to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across the codebase |

## Project Structure

```
setu-docs-site/
├── index.html              # Entry point, font preloads, favicon
├── package.json
├── vite.config.js
├── eslint.config.js
├── netlify.toml            # SPA redirect rule for client-side routing
├── public/
│   ├── fonts/              # Camber Trial font files (.otf)
│   └── screenshots/        # Hero images referenced in docs
└── src/
    ├── main.jsx            # React entry point
    ├── index.css           # @font-face declarations + CSS reset
    └── App.jsx             # The entire app — docs, components, theming
```

## Editing Content

All documentation content lives in `src/App.jsx`. Two arrays control what's shown:

- **`docs`** — every documentation page (id, title, category, optional image, content as markdown)
- **`RELEASE_NOTES`** — version history, newest first

To add a new doc page, append an object to the `docs` array:

```javascript
{
  id: "your-slug",
  title: "Your Page Title",
  category: "Category Name",
  image: "screenshot.png",        // optional, drop file in public/screenshots/
  imageCaption: "Caption text",   // optional
  content: `
# Your Page Title

Markdown content here. Supports headings, lists, tables, code blocks, blockquotes, links, and inline code.
  `
}
```

Categories are auto-generated from the `category` field — no separate config needed.

## Adding Screenshots

Drop PNG files into `public/screenshots/`. Reference them by filename in a doc's `image` field. If a referenced image is missing, the renderer shows a graceful fallback rather than breaking.

## Building for Production

```bash
npm run build
```

This outputs an optimized static bundle to `dist/`. Preview it locally with:

```bash
npm run preview
```

## Deploying to Netlify

The repo includes a `netlify.toml` with the SPA redirect rule already configured.

**Option A — Drag and drop:** Run `npm run build`, then drag the `dist/` folder onto Netlify.

**Option B — Git integration:** Connect your repo to Netlify. Use these settings:

- **Build command:** `npm run build`
- **Publish directory:** `dist`

Netlify will pick up `netlify.toml` automatically.

## Adding a New Version Release

Release notes appear in the slide-in drawer triggered by the bell icon in the header. The latest version automatically gets the green **LATEST** badge.

All release notes live in the `RELEASE_NOTES` array near the top of `src/App.jsx` (around line 53). The array is **ordered newest-first** — index 0 is the latest release.

### Steps

1. **Open `src/App.jsx`** and find the `RELEASE_NOTES` constant.

2. **Add your new release as the first entry in the array** (top of the list). Each release has a `version` and a `sections` array — each section has a `title` and `body`:

   ```javascript
   const RELEASE_NOTES = [
     // 👇 Add your new release here, at the top
     { version: "0.61.0", sections: [
       { title: "New Feature Name", body: "Description of what changed and why it matters to users..." },
       { title: "Bug Fixes", body: "What was fixed in this release..." },
       { title: "Performance", body: "Any performance improvements..." },
     ]},
     // ── existing releases below ──
     { version: "0.60.2", sections: [
       { title: "More Reliable File Handling", body: "..." },
     ]},
     // ...
   ];
   ```

3. **Update the version badge in the header** (if this is a major/minor bump you want reflected in the top bar). Search `App.jsx` for the current version string in the header section and update it.

4. **Test locally:**

   ```bash
   npm run dev
   ```

   Click the bell icon in the header — your new release should appear at the top with the green **LATEST** badge. The card should expand on click to show all sections.

5. **Commit and deploy:**

   ```bash
   git add src/App.jsx
   git commit -m "Release notes: v0.61.0"
   git push
   ```

   If connected to Netlify, the deploy happens automatically.

### Writing Good Release Notes

- **Group related changes** into a single section with a descriptive title (e.g., "Performance & Reliability") rather than listing each individual change as its own section.
- **Lead with user impact** — what changed for the person using Setu, not the internal implementation.
- **Keep section bodies to 1–3 sentences.** Longer than that and the collapsed-card preview gets unwieldy.
- **Common section titles** used in past releases: `Summary`, `Bug Fixes`, `Bug Fixes & Stability`, `Performance & Reliability`, `Stability Fixes`, `Better Debugging Tools`, plus feature-specific titles.

### Schema Reference

```javascript
{
  version: "0.61.0",          // semver string, displayed as the card header
  sections: [                  // array of changes — at least one required
    {
      title: "Section Title",  // short, ~2–4 words, shown collapsed and expanded
      body: "Full description" // 1–3 sentences explaining the change
    },
    // ... more sections
  ]
}
```

## Theming

The site supports light (default) and dark modes. Toggle via the sun/moon button in the header. All colors are CSS custom properties defined inline in `App.jsx` — modify the `lightTheme` and `darkTheme` objects to customize.

## License

Internal — Stackbox.
