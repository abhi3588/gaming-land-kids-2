# CLAUDE.md — Gaming Land Kids

A kid-friendly, mobile-first educational web app for children ages 3–10, featuring
**30+ mini-games**, bedtime **stories**, nursery **rhymes**, hands-on **fun activities**,
**science** & **moral** learning modules, **quizzes**, and **puzzles** — all built as a
single-page React app with heavy SEO (per-page meta + JSON-LD) for discoverability.

---

## Tech Stack

| Concern        | Choice |
|----------------|--------|
| Framework      | React 19 + Vite 8 |
| Routing        | `react-router-dom` v7 (BrowserRouter, code-split via `lazy`) |
| SEO            | `react-helmet-async` (per-tab + per-item meta & JSON-LD) |
| Styling        | Plain CSS, split into token/layout/component files (no CSS framework) |
| Sound          | Web Audio API (synthesized tones — no audio asset files) |
| Deploy         | GitHub Pages (subpath `/gaming-land-kids-2/`), via `deploy.yml` / `static.yml` |

---

## Commands

```bash
npm run dev        # Vite dev server (port 5000, host 0.0.0.0)
npm run build      # vite build  ->  runs postbuild automatically
npm run preview    # serve the production build
npm run lint       # eslint
```

Note: `postbuild` (in `scripts/postbuild.mjs`) generates `sitemap.xml` (107 URLs),
`robots.txt`, and copies `dist/index.html` -> `dist/404.html` (SPA deep-link fallback).
The base URL is `/gaming-land-kids-2/` in production (see `vite.config.js`).

---

## Architecture

### Entry & Shell
- `src/main.jsx` mounts `<App/>` (StrictMode) and imports `src/styles/index.css`.
- `src/App.jsx` is the **Shell**: animated background, floating emoji shapes, header,
  the **tab nav** (`TabBar`), the routed `<main id="tab-content">`, and footer.
- Tab list is driven by `TAB_ORDER` + `TAB_LABELS` (`src/router-config.js`). Each tab
  button shows a live `TAB_COUNTS[n]` badge.
- Active tab accent color is per-tab (`.tab-btn.<tab>.active` in `layout.css`).

### Routing (all client-side)
`/`, `/games`, `/games/:id`, `/stories` (+ `/stories/hi`, `/stories/hi/:id`),
`/rhymes`, `/rhymes/:id`, `/fun`, `/fun/:id`, `/educational`,
`/educational/science/:id`, `/educational/moral/:id`, `/quiz`, `/quiz/:id`,
`/puzzle`, `/puzzle/:id`. Unknown paths redirect to `/`.
Tab views are **lazy-loaded** in `App.jsx` for smaller initial bundle.

### Tab ownership (one component file per tab)
| Tab | Component | Content source |
|-----|-----------|----------------|
| Games | `src/components/games/GamesTab.jsx` | `gamesMeta` (kids-data) + `COMPONENT_MAP` of 30+ game components |
| Stories | `src/components/stories/StoriesTab.jsx` | `stories` / `storiesHindi` + `StoryReader` modal |
| Rhymes | `src/components/rhymes/RhymesTab.jsx` | `rhymes` (video URLs) + `VideoPlayer` |
| Fun | `src/components/fun/FunTab.jsx` | `funActivities` (materials/steps) |
| Educational | `src/components/educational/EducationalTab.jsx` | `scienceActivities` + `moralActivities` (interactive components) |
| Quiz | `src/components/quiz/QuizTab.jsx` | `QUIZ_CATEGORIES` + `QUIZ_DATA` |
| Puzzle | `src/components/puzzle/PuzzleTab.jsx` | `PUZZLE_CATEGORIES` + `PUZZLE_DATA` (6 puzzle components) |

---

## Directory Structure

```
src/
  App.jsx, main.jsx, router-config.js, kids-data.js, ScrollToTop.jsx
  ErrorBoundary.jsx
  styles/            tokens, layout, components, games-{shared,classic,preschool,hero,junior}, puzzle, animations,
                     reset, utilities, responsive  (imported last = wins)
  utils/            sounds.js, seoConfig.js, seo.js, useSEO.jsx
  assets/           hero.png, activityImages.js, *.svg
  components/
    games/          GamesTab + 30+ game components + MemoryGame etc.
    stories/        StoriesTab, StoryReader, data/ (EN), data-hindi/ (HI)
    rhymes/         RhymesTab, VideoPlayer
    fun/            FunTab
    educational/    EducationalTab, ScienceTab, MoralTab,
                    science/*.jsx (6), moral/*.jsx (6)
    quiz/           QuizTab, QuizActivity, quiz-data.js
    puzzle/         PuzzleTab, puzzle-data.js, puzzle-utils.js,
                    JigsawPuzzle, SlidePuzzle, ConnectDotsPuzzle,
                    MazePuzzle, SpotDifferencePuzzle, ShapeFitPuzzle
scripts/            postbuild.mjs, generate-sitemap.mjs
public/             video/*.mp4 (rhymes), manifest.json, icons/, og-image.png
```

---

## Content / Data Model (everything is data-driven)

Central data lives in `src/kids-data.js` and the `*/data*.js` files under each tab:

- **`gamesMeta`** — array of `{ id, title, icon, color, ageGroup, desc }`.
  `ageGroup` is `'preschool'` (3–5) or `'junior'` (6–10) and drives the Games age filter.
  `id` maps to a lazily-imported component in `GamesTab`'s `COMPONENT_MAP`.
- **`rhymes`** — `{ id, title, icon, color, desc, videoUrl }`; `videoUrl` resolves to
  `public/video/*.mp4` via `getPublicAssetUrl` (uses `import.meta.env.BASE_URL`).
- **`funActivities`** — `{ id, title, icon, color, ageRange, time, desc, materials[], steps[] }`.
- **`scienceActivities` / `moralActivities`** — `{ id, title, icon, color, ageRange, desc, component }`
  where `component` is a directly imported React component.
- **`stories` / `storiesHindi`** — arrays of story objects (each with `scenes[]`, `moral`,
  `ageRange`, `coverImage`/`gradient`, emoji). EN and HI are parallel lists.
- **`QUIZ_CATEGORIES` / `QUIZ_DATA`** (`quiz-data.js`) and **`PUZZLE_CATEGORIES` / `PUZZLE_DATA`**
  (`puzzle-data.js`) follow the same pattern (category meta + per-id content).

### Color-token system (IMPORTANT for visual consistency)
Every card carries a `color` field (e.g. `'memory'`, `'patterns'`, `'shapfit'`). That string
becomes a CSS class `game-card.<token>`, and a rule defines a matching **border color + soft
gradient background**. Rules live in two places:
- `src/styles/layout.css` — `memory, sorting, patterns, counting, math, word, sudoku, sequence`.
- `src/styles/games-classic.css` — interactive styles for the four foundational games whose card
  tokens live in `layout.css`: `sudoku` (ShapeSudoku), `sequence` (SparkSequence), `patterns`
  (ColorMatch), `math` (SumPairs).
- `src/styles/games-preschool.css` — preschool recognition/matching tokens: `animalsounds, bigorsmall,
  oddoneout, oppositematch, shadowmatch, shapefinder, whatcomesnext`.
- `src/styles/games-hero.css` — superhero family: `heropowermatch, savethecity, herospellquest, herotrivia`.
- `src/styles/games-junior.css` — junior word/math/choice tokens: `wordscramble, rhymetime, mathninja,
  coincounter, timeteller`.
  - **Coin Counter** (`CoinCounter.jsx`) & **Time Teller** (`TimeTeller.jsx`) are the two newest games.
    They share the same "choice" answer UI (`.choice-options` / `.choice-btn` / `.choice-correct` /
    `.choice-wrong`) and a 20-level deterministic-puzzle structure driven by a seeded `createPRNG`
    (each level always yields the same puzzle/clock). Coin Counter sums **Indian rupees**: ₹1–₹10 render
    as `.coin-pill` coins and ₹20+ as `.money-note` banknotes; answers/values use `₹` formatting
    (`formatMoney`). Time Teller draws an inline SVG `.clock-face` and asks the child to pick the matching
    `H:MM`; minute granularity widens with level (o'clock/half-hour → quarter hours → 5-minute steps).
- `src/styles/games-shared.css` — game-wide chrome (`.game-view`, `.game-header`, `.btn`,
  `.champion-screen`, progress/level banners) plus the interactive styles for the classic games whose
  `.game-card.<token>` gradient lives in `layout.css` (Memory, Sorting, Patterns, Counting, Word, MathQuest).
- `src/styles/puzzle.css` — the six puzzle games only (Jigsaw, Slide, Connect-the-Dots, Maze,
  Spot-the-Difference, Shape Fit). Kept separate from `games-shared.css` so each file is single-purpose.

> **Rule:** any `color` value used in data MUST have a corresponding `.game-card.<token>` rule,
> or that card renders with a plain white border (visually inconsistent). When adding a new
> activity with a new `color`, add the matching CSS rule.

---

## Design System & Styling

- **Tokens** (`src/styles/tokens.css`): candy palette (`--candy-*`), soft palette (`--soft-*`),
  radii, shadows, breakpoints, font (`'Fredoka'` primary, `'Outfit'` fallback).
- **Unified card grid:** `.game-grid`, `.rhymes-grid`, `.educational-grid`, `.stories-grid`
  are all aliased to the **same** grid — **2 columns on desktop**, 1 centered column (`max-width:460px`)
  at `≤768px` (see the `min-width:769px` / `max-width:768px` blocks at the end of `responsive.css`,
  enforced with `!important` so leftover per-grid overrides can't break it). Keep all tab grids
  consistent — do not reintroduce different column counts per tab.
- **Card markup pattern** (used by every list tab):
  `<div className="game-card <color>">` containing `.game-icon`, an `<h3>` title,
  optional `.activity-subtitle` (e.g. "Ages 3–10 · 10 Questions"), a `.game-desc`
  (2-line clamp), and a `.play-btn` (or `.read-btn` for stories).
  > **Gotcha:** card titles are `<h3>` (not `<h2>`). The CSS selectors are written as
  > `.game-card h2, .game-card h3` / `.rhyme-card h2, .rhyme-card h3`. If you change a card
  > title to `<h2>` it will still style, but keep `<h3>` for document-outline correctness
  > (section headings are the `<h2>`s).
- **Stories cards** are the exception: image-cover cards (`.story-card` with `.story-cover`,
  `.story-body`, `.story-moral`), using `.read-btn`.
- **Animations** (`animations.css`): `pop-in`, `fade-in`, `slide-up`, `bobble`, `float-wiggle`,
  `shake`. Games/puzzles use lots of `pop-in` + bouncy `cubic-bezier` transitions.

### Mobile / responsiveness
- `responsive.css` is imported **last** (cascade wins). Breakpoints: 576 / 768 / 992 / 1200 / 1400px.
- Touch-friendly: cards/buttons use `touch-action: manipulation`, `-webkit-tap-highlight-color: transparent`,
  and `min-height: 44px` on key controls.
- Tab nav scrolls horizontally on narrow screens.

---

## SEO

- `src/App.jsx` `TabSEO` calls `getTabSEO(activeTab, …)` for per-tab title/description/OG/Twitter/JSON-LD.
- Per-item pages (game/story/rhyme/fun/educational/quiz detail) use `useItemSEO(type, item, opts)`
  from `src/utils/useSEO.jsx`, backed by `getItemSEO` / schema factories in `src/utils/seo.js`.
- **GitHub Pages subpath:** never hardcode a domain. All URLs derive from `BASE_URL` /
  `SITE_ORIGIN` in `src/seoConfig.js` (built from `import.meta.env.BASE_URL`). `sitemap.xml`
  is generated from the content data (`scripts/generate-sitemap.mjs`) — **107 URLs**.
- Stories support `hreflang` (EN + HI) alternates.

---

## Utilities

- `src/utils/sounds.js` — `playSound('pop' | 'match' | 'celebrate' | 'wrong')` synthesizes
  tones via Web Audio (guarded for SSR / autoplay-blocked browsers; never throws).
- `src/ScrollToTop.jsx` — scrolls to top on route change.
- `src/ErrorBoundary.jsx` — wraps individual game/puzzle routes so one failure doesn't crash the app.

---

## How to add content

- **New game:** add an entry to `gamesMeta` (unique `id`, `color` from the token set or add a
  CSS rule) and a component; register it in `GamesTab`'s `COMPONENT_MAP`.
- **New story:** add a module under `src/components/stories/data/` (mirror an existing one) and
  export it from `data/index.js`; optionally add a Hindi version under `data-hindi/`.
- **New rhyme:** add to `rhymes` with a `public/video/<id>.mp4`.
- **New fun / science / moral / quiz / puzzle:** follow the existing data shape in the relevant
  `data*.js`; for science/moral/puzzle also supply the React `component`.
- After adding items, `npm run build` regenerates the sitemap automatically.

---

## Known UI-consistency model (enforced in recent work)

These were standardized across all tabs — preserve them:
1. All 7 tab card grids share one 2-column desktop / 1-column mobile layout.
2. Card titles use `<h3>` and the CSS targets both `h2` and `h3`.
3. `.game-desc` is bold + 1rem globally (not grid-scoped) so descriptions match across tabs.
4. Every `color` token in data has a CSS rule (no plain-white cards).
5. Each puzzle's interactive pieces are sized/positioned to fit their card (e.g. Shape Fit =
   1 column per side; Connect the Dots reveal emoji scales to fill the board; Spot the Difference
   icons are inset from edges and aligned between both pictures via reset button padding).

---

## Gotchas

- Dev server port is **5000** (`vite.config.js`), not the Vite default 5173.
- Production base path is `/gaming-land-kids-2/` — asset URLs that must work under the subpath
  should use `import.meta.env.BASE_URL` (see `getPublicAssetUrl` in `kids-data.js`).
- `postbuild` must run after every `build` (it's wired as an npm `postbuild` script; running
  `vite build` directly still triggers it).
- Lint currently shows pre-existing `react-hooks/set-state-in-effect` warnings in
  `StoryReader.jsx` (unrelated to styling); they are not blocking.
