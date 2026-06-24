# Gaming Land Kids 🎮

A React + Vite interactive gaming platform for kids aged 3–10, featuring 10 carefully designed mini-games split into two age categories.

---

## 📁 Project Structure

```
src/
├── App.jsx                     # Root component — age-category tabs + game routing
├── main.jsx                    # Entry point
├── index.css                   # Global design system (colors, animations, layouts)
├── App.css
├── components/
│   ├── ErrorBoundary.jsx       # React class Error Boundary (catches game crashes)
│   └── games/
│       ├── MemoryGame.jsx      # Ocean Match (Ages 3-5)
│       ├── SortingGame.jsx     # Fruit Sort (Ages 3-5)
│       ├── PatternGame.jsx     # Pattern Train (Ages 3-5)
│       ├── CountingGame.jsx    # Star Count (Ages 3-5)
│       ├── ColorMatch.jsx      # Color Match (Ages 3-5)
│       ├── MathQuest.jsx       # Math Quest (Ages 6-10)
│       ├── WordBuilder.jsx     # Word Builder (Ages 6-10)
│       ├── ShapeSudoku.jsx     # Shape Sudoku (Ages 6-10)
│       ├── SumPairs.jsx        # Sum Pairs (Ages 6-10)
│       └── SparkSequence.jsx   # Spark Sequence (Ages 6-10)
└── utils/
    └── sounds.js               # Web Audio API synthesizer (try/catch hardened)
```

---

## 🎮 Games

### Ages 3–5 (Little Explorers)

| Game | File | Description |
|------|------|-------------|
| 🐳 Ocean Match | `MemoryGame.jsx` | Flip cards and find matching sea animal pairs |
| 🍎 Fruit Sort | `SortingGame.jsx` | Drag fruits into the matching color bin |
| 🚂 Pattern Train | `PatternGame.jsx` | Choose the shape that completes an ABAB pattern |
| ⭐ Star Count | `CountingGame.jsx` | Click and pop all the stars on screen |
| 🎨 Color Match | `ColorMatch.jsx` | Tap the button that matches the shown target color |

### Ages 6–10 (Junior Genius)

| Game | File | Description |
|------|------|-------------|
| 🎈 Math Quest | `MathQuest.jsx` | Solve equations, pop the correct floating balloon |
| ✏️ Word Builder | `WordBuilder.jsx` | Rearrange scrambled tiles to spell the emoji word |
| 🧩 Shape Sudoku | `ShapeSudoku.jsx` | Fill a 4×4 grid with animals — no repeats per row/col/quad |
| 🔢 Sum Pairs | `SumPairs.jsx` | Pick two tiles whose values sum to the target number |
| ⚡ Spark Sequence | `SparkSequence.jsx` | Memorize and repeat the growing light-and-sound pattern |

---

## 🛡️ Error Handling — Implementation Context

This section documents every error-handling fix applied across the codebase (June 2026 audit).

### 1. `ErrorBoundary.jsx` (NEW)
- **What**: A React class component implementing `getDerivedStateFromError` + `componentDidCatch`.
- **Why**: Without a boundary, a runtime error in any game silently white-screens the whole app. Now the ErrorBoundary catches the error, logs it, and renders a friendly "Oops!" screen with a "Back to Main Menu" button.
- **Where**: Wraps every `<GameComponent>` inside `renderGame()` in `App.jsx`.

### 2. `sounds.js` — Full try/catch hardening
- **Problem**: `AudioContext` constructor can throw in browsers with strict autoplay policies, incognito mode, or missing API support. Any unhandled exception would propagate and crash the calling game.
- **Fix**:
  - Guard `AudioCtx` definition with `typeof window !== 'undefined'` + fallback to `null`.
  - Wrap `initAudio()` and all of `playSound()` in `try/catch`.
  - `audioCtx.resume()` is now `.catch(() => {})` to suppress promise rejections.
  - All sound errors are swallowed silently so gameplay is never interrupted.

### 3. `CountingGame.jsx` — Null guard on star lookup
- **Problem**: `data.stars.find()` returns `undefined` if the star ID doesn't match (e.g. rapid double-click after state update). Accessing `.popped` on `undefined` throws a TypeError.
- **Fix**: Changed `if (star.popped) return;` → `if (!star || star.popped) return;`

### 4. `SortingGame.jsx` — Drop handler type-safety
- **Problem**: `e.dataTransfer.getData('itemIndex')` returns a string; using it as an array index relies on implicit coercion. If the transfer data is empty or malformed, `draggables[itemIndex]` is `undefined` and `item.color` throws.
- **Fix**:
  - Parse index with `parseInt(..., 10)`.
  - Validate with `isNaN(itemIndex) || itemIndex < 0 || itemIndex >= draggables.length` before use.
  - Added a `if (!item) return;` safety guard.

### 5. `PatternGame.jsx` — ABAB pattern validity
- **Problem**: `s1` and `s2` were independently random — if they resolved to the same shape, all three option buttons were distractors (none was correct), making the round unsolvable.
- **Fix**: Added `do { s2 = ... } while (s2 === s1)` to guarantee `s1 !== s2`.

### 6. `ColorMatch.jsx` — Target/options sync
- **Problem**: `options` was recomputed on every render while `target` lived in separate `useState`. After `setTarget(...)` fired asynchronously, the next render's options could briefly not include the new target.
- **Fix**: Merged `target` and `options` into a single `buildRound()` function that produces them atomically and stores the result in one state object (`round`). No stale mismatch is possible.

### 7. `SparkSequence.jsx` — Async unmount guard
- **Problem**: `runSequence` is an `async` function that `await`s multiple timeouts. If the user clicked "Main Menu" mid-sequence, the component unmounted while the async function kept calling `setActivePad`, `setIsPlayingSeq`, etc., causing React "can't perform state update on unmounted component" warnings (and potential crashes in strict environments).
- **Fix**: Added `isMountedRef = useRef(true)`. The cleanup in `useEffect` sets it `false`. Every `await` in `runSequence` checks `if (!isMountedRef.current) return;` before continuing.

### 8. `SparkSequence.jsx` — localStorage try/catch
- **Problem**: `localStorage.getItem` and `.setItem` can throw `SecurityError` in private/incognito browsers with storage disabled, crashing on component initialization.
- **Fix**: Wrapped both `getItem` (in lazy state initializer) and `setItem` (on high-score write) in `try/catch` with silent fallbacks.

### 9. `WordBuilder.jsx` — Infinite loop cap
- **Problem**: `while (scrambled === word)` had no iteration limit. For very short words or all-identical-letter strings, shuffling could theoretically loop forever.
- **Fix**: Added `retries` counter; loop exits after 20 attempts regardless.

### 10. `MathQuest.jsx` — Infinite loop cap + fallback
- **Problem**: `generateBalloonsData` used an unbounded `while (wrongAnswers.size < 3)` loop. For edge-case answers near 0, the random ±5 offset window might never produce 3 valid distinct positive integers.
- **Fix**: Added `attempts < 50` cap. A secondary deterministic `while` loop fills any remaining slots with sequential integers as a guaranteed fallback.

### 11. `onBack` prop guard — all 10 games
- **Problem**: All game components called `onClick={onBack}` directly. If `onBack` is `undefined` (misconfigured parent, unit tests), clicking "Main Menu" throws `TypeError: onBack is not a function`.
- **Fix**: All "Main Menu" buttons now use `onClick={() => { if (typeof onBack === 'function') onBack(); }}`.

---

## 🚀 Getting Started

```bash
npm install
npm run dev      # Development server
npm run build    # Production build
```

---

## 🔊 Audio

The app uses the **Web Audio API** to synthesize all sounds in-browser — no audio files needed.

| Sound type | Waveform | Usage |
|------------|----------|-------|
| `pop` | Sine + frequency ramp | Card/tile clicks |
| `match` | Triangle | Correct answer |
| `celebrate` | Multi-tone chord | Level complete |
| `wrong` | Sawtooth | Incorrect answer |

---

## 📝 Tech Stack

- **React 18** (functional components + hooks)
- **Vite 8** (dev server + build)
- **Vanilla CSS** (custom design system in `index.css`)
- **Web Audio API** (synthesized sounds, no assets)
- **localStorage** (SparkSequence high-score persistence)