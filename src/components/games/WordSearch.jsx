import { useState, useCallback, useMemo } from 'react';
import { playSound } from '../../utils/sounds';

const TOTAL_LEVELS = 20;

// Deterministic seeded PRNG
const createPRNG = (seed) => {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
};

// Extended word pool organised by rough difficulty (length + familiarity)
const WORD_POOL_BY_TIER = {
  easy:   ['CAT', 'DOG', 'SUN', 'BUS', 'COW', 'PIG', 'HEN', 'BAT', 'FOX', 'OWL', 'BEE', 'ANT', 'CUP', 'HAT', 'EGG'],
  medium: ['FISH', 'BIRD', 'TREE', 'LEAF', 'STAR', 'MOON', 'BOOK', 'CAKE', 'MILK', 'BALL', 'KITE', 'BEAR', 'LION', 'FROG', 'DUCK', 'GOAT', 'CRAB', 'SEAL'],
  hard:   ['PANDA', 'TIGER', 'HORSE', 'SNAIL', 'WORM', 'CAMEL', 'SHARK', 'WHALE', 'EAGLE', 'CRANE', 'GRAPE', 'APPLE', 'MANGO', 'LEMON', 'PLUMS'],
  expert: ['RABBIT', 'MONKEY', 'PARROT', 'TURTLE', 'LIZARD', 'BEETLE', 'SPIDER', 'GARDEN', 'ORANGE', 'BUTTER', 'ROCKET', 'CANDLE', 'BRIDGE', 'FOREST', 'PLANET'],
};

const WORD_COLORS = ['#FF6B6B', '#4D96FF', '#6BCB77', '#FF9F1C', '#C77DFF', '#4DD0E1', '#F06292', '#A8E063'];

// Level config: grid size, word count, directions, tiers used
// Levels 1–5:   6×6, 3 words, horizontal only, easy
// Levels 6–10:  7×7, 4 words, H+V, easy+medium
// Levels 11–15: 8×8, 5 words, H+V+diagonal, medium+hard
// Levels 16–20: 9×9, 6–7 words, all directions, hard+expert
const levelConfig = (lvl) => {
  if (lvl <= 5)  return { size: 6, count: 3, tiers: ['easy'],            dirs: ['H'] };
  if (lvl <= 10) return { size: 7, count: 4, tiers: ['easy','medium'],   dirs: ['H','V'] };
  if (lvl <= 15) return { size: 8, count: 5, tiers: ['medium','hard'],   dirs: ['H','V','D'] };
  return           { size: 9, count: Math.min(7, 5 + (lvl - 16)), tiers: ['hard','expert'], dirs: ['H','V','D','DR'] };
};

// Place one word in the grid returning cells or null if it doesn't fit
const tryPlace = (grid, word, size, dirs, prng) => {
  const shuffleDirs = [...dirs];
  for (let i = shuffleDirs.length - 1; i > 0; i--) {
    const j = Math.floor(prng() * (i + 1));
    [shuffleDirs[i], shuffleDirs[j]] = [shuffleDirs[j], shuffleDirs[i]];
  }
  const len = word.length;
  for (const dir of shuffleDirs) {
    for (let attempt = 0; attempt < 30; attempt++) {
      let dr = 0, dc = 0;
      if (dir === 'H')  { dr = 0; dc = 1; }
      if (dir === 'V')  { dr = 1; dc = 0; }
      if (dir === 'D')  { dr = 1; dc = 1; }
      if (dir === 'DR') { dr = 1; dc = -1; }

      const maxR = size - (dr === 0 ? 0 : len - 1) - 1;
      const minC = dc < 0 ? len - 1 : 0;
      const maxC = size - (dc <= 0 ? 0 : len - 1) - 1;

      if (maxR < 0 || maxC < minC) continue;

      const startR = Math.floor(prng() * (maxR + 1));
      const startC = minC + Math.floor(prng() * (maxC - minC + 1));

      const cells = [];
      let ok = true;
      for (let k = 0; k < len; k++) {
        const r = startR + dr * k;
        const c = startC + dc * k;
        if (r < 0 || r >= size || c < 0 || c >= size) { ok = false; break; }
        if (grid[r][c] !== null && grid[r][c] !== word[k]) { ok = false; break; }
        cells.push([r, c]);
      }
      if (ok) return cells;
    }
  }
  return null;
};

const buildLevel = (lvl) => {
  const prng = createPRNG(lvl * 503 + 11);
  const { size, count, tiers, dirs } = levelConfig(lvl);

  // Pick word pool from the appropriate tiers
  const pool = tiers.flatMap((t) => WORD_POOL_BY_TIER[t]);
  // Shuffle pool deterministically
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(prng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  const candidates = shuffled.slice(0, count);

  // Place words in the grid
  const grid = Array.from({ length: size }, () => Array(size).fill(null));
  const placed = [];

  for (const word of candidates) {
    const cells = tryPlace(grid, word, size, dirs, prng);
    if (cells) {
      cells.forEach(([r, c], k) => { grid[r][c] = word[k]; });
      placed.push({ word, cells });
    }
  }

  // Fill blanks with random uppercase letters (deterministic)
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c] === null) {
        grid[r][c] = alphabet[Math.floor(prng() * 26)];
      }
    }
  }

  const words = placed.map((p, i) => ({
    word: p.word,
    cells: p.cells,
    found: false,
    color: WORD_COLORS[i % WORD_COLORS.length],
  }));

  return { size, grid, words };
};

const sameCell = (a, b) => a[0] === b[0] && a[1] === b[1];
const pathMatchesWord = (path, w) => {
  if (path.length > w.cells.length) return false;
  for (let i = 0; i < path.length; i++) {
    if (!sameCell(path[i], w.cells[i])) return false;
  }
  return true;
};

const WordSearch = ({ onBack }) => {
  const [level, setLevel] = useState(1);
  const [gameWon, setGameWon] = useState(false);

  const levelData = useMemo(() => buildLevel(level), [level]);
  const { size, grid, words: initialWords } = levelData;

  const [words, setWords] = useState(initialWords);
  const [cellColor, setCellColor] = useState({});
  const [selected, setSelected] = useState([]);
  const [feedback, setFeedback] = useState('Tap each letter in order — first to last! 🔍');

  // Reset state when level changes (useMemo re-runs → words/grid change)
  const prevLevel = useState(level)[0];
  if (prevLevel !== level) {
    // This guard prevents stale closure issues — state is reset via key trick below
  }

  const resetLevel = useCallback((lvl) => {
    setLevel(lvl);
    setWords(buildLevel(lvl).words);
    setCellColor({});
    setSelected([]);
    setFeedback('Tap each letter in order — first to last! 🔍');
  }, []);

  const handleCellTap = useCallback((r, c) => {
    if (gameWon) return;
    const cell = [r, c];

    // Tapping last selected cell undoes it (allows backtrack)
    if (selected.length && sameCell(selected[selected.length - 1], cell)) {
      setSelected(selected.slice(0, -1));
      return;
    }

    const newPath = selected.length ? [...selected, cell] : [cell];

    // Check for exact full-word match
    const exact = words.find(
      (w) => !w.found && newPath.length === w.cells.length && pathMatchesWord(newPath, w),
    );
    if (exact) {
      playSound('match');
      const newWords = words.map((x) => (x === exact ? { ...x, found: true } : x));
      setWords(newWords);
      const newCellColor = { ...cellColor };
      exact.cells.forEach(([rr, cc]) => { newCellColor[`${rr},${cc}`] = exact.color; });
      setCellColor(newCellColor);
      setSelected([]);
      setFeedback(`Found ${exact.word}! 🎉`);

      if (newWords.every((w) => w.found)) {
        if (level >= TOTAL_LEVELS) {
          playSound('celebrate');
          setGameWon(true);
        } else {
          setFeedback('Puzzle solved! Next one coming… ➡️');
          setTimeout(() => resetLevel(level + 1), 900);
        }
      }
      return;
    }

    // Still a valid prefix of some unsolved word
    if (words.some((w) => !w.found && pathMatchesWord(newPath, w))) {
      setSelected(newPath);
      setFeedback('Keep going — tap the next letter! ➡️');
      return;
    }

    // Wrong — clear and notify
    playSound('wrong');
    setFeedback('Not the right letter — start the word again! 🔍');
    setSelected([]);
  }, [gameWon, selected, words, cellColor, level, resetLevel]);

  if (gameWon) {
    return (
      <div className="game-view pop-in">
        <div className="champion-screen">
          <div style={{ fontSize: '4rem' }}>📚</div>
          <h2>Word Search Wizard!</h2>
          <p>You found every word across all {TOTAL_LEVELS} puzzles!</p>
          <p style={{ fontSize: '1.1rem', color: '#666', marginTop: '1rem' }}>
            Spotting hidden words is a superpower — keep exploring! 🔍
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={() => resetLevel(1)}>Play Again</button>
            <button className="btn" onClick={() => { if (typeof onBack === 'function') onBack(); }}>Main Menu</button>
          </div>
        </div>
      </div>
    );
  }

  const foundCount = words.filter((w) => w.found).length;

  return (
    <div className="game-view pop-in">
      <div className="game-header">
        <div>Word Search 🔍</div>
        <div>Puzzle {level} / {TOTAL_LEVELS}</div>
        <div>Found: {foundCount}/{words.length}</div>
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${(level / TOTAL_LEVELS) * 100}%` }} />
        </div>
      </div>

      <div
        className="wsearch-board"
        style={{
          gridTemplateColumns: `repeat(${size}, 1fr)`,
          maxWidth: `min(100%, ${size * 52}px)`,
        }}
      >
        {grid.map((row, r) =>
          row.map((ch, c) => {
            const key = `${r},${c}`;
            const isSel = selected.some(([sr, sc]) => sr === r && sc === c);
            const color = cellColor[key];
            return (
              <button
                key={key}
                className={`wsearch-cell${isSel ? ' sel' : ''}${color ? ' found' : ''}`}
                style={color ? { background: color, color: '#fff', borderColor: color } : undefined}
                onClick={() => handleCellTap(r, c)}
                aria-label={`Letter ${ch}`}
              >
                {ch}
              </button>
            );
          })
        )}
      </div>

      <div className="wsearch-words">
        {words.map((w) => (
          <span key={w.word} className={`wsearch-word${w.found ? ' found' : ''}`}>
            {w.word}
          </span>
        ))}
      </div>

      <p
        className="wsearch-feedback"
        style={{ color: feedback.includes('Found') || feedback.includes('going') ? 'var(--candy-green)' : 'var(--text-muted)' }}
      >
        {feedback}
      </p>

      <div className="detail-back-container">
        <button className="btn" onClick={() => { if (typeof onBack === 'function') onBack(); }}>
          Main Menu
        </button>
      </div>
    </div>
  );
};

export default WordSearch;
