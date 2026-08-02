# CLAUDE.md — Gaming Land Kids

A kid-friendly, mobile-first educational web app for children ages 3–10, featuring
**34+ mini-games**, bedtime **stories**, nursery **rhymes**, hands-on **fun activities**,
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

Note: `postbuild` (in `scripts/postbuild.mjs`) generates `sitemap.xml` (109 URLs),
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
| Quiz | `src/components/quiz/QuizTab.jsx` | `QUIZ_CATEGORIES` + `QUIZ_DATA` (16 quiz categories with 20 questions each) |
| Puzzle | `src/components/puzzle/PuzzleTab.jsx` | `PUZZLE_CATEGORIES` + `PUZZLE_DATA` (8 puzzle components) |

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
    games/          GamesTab + 34+ game components (incl. BalloonPop, FeedAnimals, MathArcher, WordSearch)
    stories/        StoriesTab, StoryReader, data/ (EN), data-hindi/ (HI)
    rhymes/         RhymesTab, VideoPlayer
    fun/            FunTab
    educational/    EducationalTab, ScienceTab, MoralTab,
                    science/*.jsx (6), moral/*.jsx (6)
    quiz/           QuizTab, QuizActivity, quiz-data.js
    puzzle/         PuzzleTab, puzzle-data.js, puzzle-utils.js,
                    JigsawPuzzle, SlidePuzzle, ConnectDotsPuzzle,
                    MazePuzzle, SpotDifferencePuzzle, ShapeFitPuzzle,
                    ColorSortPuzzle, MemoryMatchPuzzle, ShadowMatchPuzzle,
                    PatternSequencePuzzle, WordSearchPuzzle, PipeConnectorPuzzle,
                    CodingQuestPuzzle, ScaleBalancePuzzle
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
  - **Quiz contract:** each of the 12 `QUIZ_DATA` categories has **exactly 20 questions**
    (`{ id, emoji, question, answer, options[4] }`). The `answer` string must be one of the 4
    `options`, ids must be unique within the category, and questions are static (already
    deterministic — no PRNG needed). `QuizActivity.jsx` walks them in order (the "20 levels").
    **Wrong answer = stop + notify + retry:** a wrong pick plays `wrong`, shows a "try again"
    message, and does NOT advance or reveal the answer; the option buttons stay enabled so the
    child keeps trying. Only a correct answer scores a point and advances (champion screen after Q20).

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
  New interactive game styles: `.bp-*` (BalloonPop — play area, float-up animation, balloon, prompt)
  and `.fa-*` (FeedAnimals — stage, animal card, food buttons, speech bubble).
- `src/styles/games-hero.css` — superhero family: `heropowermatch, savethecity, herospellquest, herotrivia`.
- `src/styles/games-junior.css` — junior word/math/choice tokens: `wordscramble, rhymetime, mathninja,
  coincounter, timeteller`.
  New interactive game styles: `.ma-*` (MathArcher — play area, slide-lr animation, targets, question pill)
  and `.wsearch-*` (WordSearch — letter grid, cell states sel/found, word list badges).
  - **Coin Counter** (`CoinCounter.jsx`) & **Time Teller** (`TimeTeller.jsx`) share a 20-level
    deterministic-puzzle structure driven by a seeded `createPRNG`. Coin Counter sums Indian rupees;
    Time Teller draws an SVG clock face.
  - **Balloon Pop** (`BalloonPop.jsx`) — preschool (ages 3–5). Tap the floating balloon of the named
    colour. 20 deterministic levels; balloon speed increases and correct-colour ratio decreases.
    Styles: `.bp-area`, `.bp-balloon` (`@keyframes float-up`), `.bp-prompt`, `.bp-feedback`.
  - **Feed the Animals** (`FeedAnimals.jsx`) — preschool (ages 3–5). Match the correct food to each
    hungry animal. 20 levels; levels 1–5: 4 foods/1 animal; 6–12: 5 foods/1 animal; 13–20: 6 foods/2
    animals simultaneously. Deterministic via `createPRNG(level*131+7)`. Styles: `.fa-stage`, `.fa-animal`,
    `.fa-bubble`, `.fa-speech`, `.fa-foods`, `.fa-food`.
  - **Math Archer** (`MathArcher.jsx`) — junior (ages 6–10). Solve math equations; tap the moving apple
    target carrying the correct answer. 20 deterministic levels: add-only (1–5) → add/sub (6–10) →
    ×2–5 (11–15) → all ops/large numbers (16–20). 3–5 moving targets. Styles: `.ma-question`,
    `.ma-area` (`@keyframes slide-lr`), `.ma-target`, `.ma-target.hit`, `.ma-feedback`.
  - **Word Search** (`WordSearch.jsx`) — junior (ages 6–10). Tap letters in order to find hidden words.
    20 deterministic levels (6×6 H-only → 9×9 all directions). `createPRNG(level*503+11)` seeds grid
    placement. 4 word-tier pools (easy/medium/hard/expert). Styles: `.wsearch-board`, `.wsearch-cell`,
    `.wsearch-cell.sel`, `.wsearch-cell.found`, `.wsearch-words`, `.wsearch-word.found`, `.wsearch-feedback`.
  - **Emotion Express** (`EmotionExpress.jsx`) — preschool (ages 3–5). Match animal scenarios to feelings and face emojis. 20 levels (2 choices L1-5 → 3 choices L6-12 → 4 choices L13-20). Deterministic via `createPRNG(level*107+19)`.
  - **Color Magic** (`ColorMagic.jsx`) — preschool (ages 3–5). Mix primary colors in a potion cauldron to paint the pictures. 20 levels (2 choices L1-5 → 3 choices L6-12 → 4 choices L13-20). Deterministic via `createPRNG(level*233+7)`.
  - **Fraction Bakery** (`FractionBakery.jsx`) — junior (ages 6–10). Serve pizza and pie slices by solving fraction order tickets. 20 levels (unit fractions L1-5 → proper fractions L6-12 → equivalent & sum fractions L13-20). Deterministic via `createPRNG(level*419+13)`.
  - **Globe Trotter** (`GlobeTrotter.jsx`) — junior (ages 6–10). Explore world geography landmarks, animal habitats, national flags, and capital cities. 20 levels (animals L1-5 → landmarks L6-12 → capitals L13-20). Deterministic via `createPRNG(level*607+29)`.
- `src/styles/games-shared.css` — game-wide chrome (`.game-view`, `.game-header`, `.btn`,
  `.champion-screen`, progress/level banners) plus the interactive styles for the classic games whose
  `.game-card.<token>` gradient lives in `layout.css` (Memory, Sorting, Patterns, Counting, Word, MathQuest).
- `src/styles/puzzle.css` — all fourteen puzzle games (Jigsaw, Slide, Connect-the-Dots, Maze,
  Spot-the-Difference, Shape Fit, Color Sort, Memory Match, Shadow Match, Pattern Sequence,
  Word Search, Pipe Connector, Coding Quest, Scale Balance). Kept separate from `games-shared.css` so each file is
  single-purpose. Puzzle level data is generated by `get*Level` helpers in `puzzle-utils.js`,
  each seeded by `createPRNG(level * <prime>)` so every level is deterministic and unique.
  - **Color Sort** (`ColorSortPuzzle.jsx`) — ball-sort: tap a tube then another to pour its top
    balls until each tube holds one colour. Level data from `getColorSortLevel` (`puzzle-utils.js`),
    scrambled from a solved board via *reverse* pours so it's always solvable.
  - **Memory Match** (`MemoryMatchPuzzle.jsx`) — flip-and-match card game; level data from
    `getMemoryMatchLevel` (3→12 pairs across the 10 levels). Styles live in `.mm-board` / `.mm-card`
    (`.mm-down` face-down, `.shown` flipped, `.matched`). **The face-down state uses `mm-down`,
    NOT `hidden`** — do not rename it, or it collides with the global `.hidden { display:none }`
    utility in `utilities.css` and the cards vanish (this bug was fixed on 2026-07-13).
  - **Shadow Match** (`ShadowMatchPuzzle.jsx`) — match colourful toys to their dark shadows; level
    data from `getShadowMatchLevel` (3→12 toys across the 10 levels).
  - **Pattern Sequence** (`PatternSequencePuzzle.jsx`) — find what comes next in a repeating emoji
    rhythm; level data from `getPatternSequenceLevel` (longer sequence + longer rhythm cycle as
    levels rise).
  - **Word Search** (`WordSearchPuzzle.jsx`) — tap letters to find hidden words; level data from
    `getWordSearchLevel` (grid grows 8→12).
  - **Pipe Connector** (`PipeConnectorPuzzle.jsx`) — rotate pipes so water flows to the flower;
    level data from `getPipeConnectorLevel` (grid grows 4→8).
  - **Coding Quest** (`CodingQuestPuzzle.jsx`) — guide a robot through a grid of obstacles to a star;
    level data from `getCodingQuestLevel` (grid grows 3x3→5x5).
  - **Scale Balance** (`ScaleBalancePuzzle.jsx`) — find the right item or weight to balance a scale;
    level data from `getScaleBalanceLevel` (emoji counting/fruit matching → mathematical weights).
  - **Constellation Finder** (`ConstellationFinderPuzzle.jsx`) — connect glowing stars in sequence (3→10 stars across 10 levels) to reveal starry constellations; level data from `getConstellationLevel` in `puzzle-utils.js`.
  - **Gear Gears** (`GearGearsPuzzle.jsx`) — master mechanical logic by tracing meshed gear rotations and gear speeds across 10 levels; level data from `getGearGearsLevel` in `puzzle-utils.js`.

> **Puzzle Rules (distinct from the Game Rules Contract):** every puzzle has **exactly 10 levels**
> (`TOTAL_LEVELS = 10` in `puzzle-utils.js`), not 20. Each level's data must be **unique and
> deterministic** (seeded `createPRNG`, never `Math.random`), difficulty must **graduate** across
> the 10 levels, and a **wrong answer must stop + notify** (play `wrong`, show feedback, let the
> child retry) without advancing the level. Jigsaw/Slide grids grow 3×3 → 4×4 at level 6.

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
  optional `.activity-subtitle` (e.g. "Ages 3–10 · 20 Questions"), a `.game-desc`
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
  is generated from the content data (`scripts/generate-sitemap.mjs`) — **109 URLs**.
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

## Game Rules Contract (enforced for ALL games)

Every **game** component **must** satisfy these 6 rules. Violations are bugs.
(Puzzles follow the parallel **Puzzle Rules** — see the puzzle section above — which use
**10 levels** instead of 20.)

1. **Exactly 20 levels.** `TOTAL_LEVELS = 20` — not 5, 8, or 15. (Puzzles use `TOTAL_LEVELS = 10`.)
2. **Unique, deterministic data per level.** Use `createPRNG(level * <prime> + <offset>)` — never call
   `Math.random()` inside level-data generators. The same seed must always produce the same level.
3. **Wrong answer: stop and notify; allow retry.** A wrong selection must: play `wrong` sound, show
   a descriptive feedback message, and **not** advance the level. The child must keep trying.
4. **Champion screen after level 20.** After completing level 20, render `<div className="champion-screen">`
   with the game emoji, a celebration heading, score/level summary, and Play Again / Main Menu buttons.
   (Puzzles show it after level 10.)
5. **Graduated difficulty.** Each level should be meaningfully harder than the last — more distractors,
   faster speeds, larger numbers, bigger grids, etc. Document the tiers in a comment at the top.
6. **Consistent mobile UI.** Use `.game-view`, `.game-header`, `.progress-container/.progress-bar`,
   `.champion-screen`, `.btn`/`.btn-primary`/`.detail-back-container` from `games-shared.css`.
   All interactive elements must have `min-width/height: 44px`, `touch-action: manipulation`,
   and `-webkit-tap-highlight-color: transparent`.

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
