// ===== Puzzle global rules =====
// Every puzzle has EXACTLY 10 levels. Each level's data is generated from a
// level-seeded PRNG (never Math.random) so it is deterministic and unique per
// level. Difficulty graduates across the 10 levels (more dots / larger grids /
// more pieces / longer sequences, etc.). A wrong answer never advances the
// level — the component plays the `wrong` sound, shows feedback, and lets the
// child retry.
export const TOTAL_LEVELS = 10;

// Jigsaw & Slide picture grids grow at level 6 (3x3 -> 4x4) for a clear
// difficulty step; the per-level shuffle still keeps every level unique.
export const getJigsawSize = (level) => (level <= 5 ? 3 : 4);
export const getSlideSize = (level) => (level <= 5 ? 3 : 4);

export const PUZZLE_THEMES = [
  { id: 'lion', emoji: '🦁', gradient: 'linear-gradient(135deg, #ff9f43, #ff6b9d)' },
  { id: 'panda', emoji: '🐼', gradient: 'linear-gradient(135deg, #54a0ff, #a55eea)' },
  { id: 'frog', emoji: '🐸', gradient: 'linear-gradient(135deg, #1dd1a1, #00d2d3)' },
  { id: 'octopus', emoji: '🐙', gradient: 'linear-gradient(135deg, #a55eea, #ff6b9d)' },
  { id: 'butterfly', emoji: '🦋', gradient: 'linear-gradient(135deg, #feca57, #54a0ff)' },
];

export const createPRNG = (seed) => {
  let currentSeed = seed;
  return () => {
    const x = Math.sin(currentSeed++) * 10000;
    return x - Math.floor(x);
  };
};

export const getThemeForLevel = (level) => PUZZLE_THEMES[(level - 1) % PUZZLE_THEMES.length];

// Builds a single "solution" image (gradient + the animal emoji) as an
// inline SVG data URI. Every puzzle piece uses THIS same image, sliced
// via background-position, so the pieces reassemble into the picture.
const buildSolutionImage = (theme) => {
  const colors = theme.gradient.match(/#[0-9a-fA-F]{3,6}/g) || ['#ff9f43', '#ff6b9d'];
  const c0 = colors[0];
  const c1 = colors[1] || c0;
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>`
    + `<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>`
    + `<stop offset='0' stop-color='${c0}'/><stop offset='1' stop-color='${c1}'/></linearGradient></defs>`
    + `<rect width='100' height='100' fill='url(#g)'/>`
    + `<text x='50' y='56' font-size='74' text-anchor='middle' dominant-baseline='central'>${theme.emoji}</text>`
    + `</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
};

// Returns the styles to render ONE piece of the jigsaw: the full solution
// image, scaled to `size`x the piece and offset so this (row,col) cell
// reveals exactly its slice. `size` is the grid dimension (3 or 4).
export const getPieceBackgroundStyle = (theme, row, col, size) => ({
  backgroundImage: buildSolutionImage(theme),
  backgroundSize: `${size * 100}% ${size * 100}%`,
  backgroundPosition: `${(col / (size - 1)) * 100}% ${(row / (size - 1)) * 100}%`,
  backgroundRepeat: 'no-repeat',
});

export const shuffleArray = (array, prng = Math.random) => {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(prng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

export const createSolvableSlideBoard = (level) => {
  const size = getSlideSize(level);
  const total = size * size;
  const emptyIndex = total - 1;
  let board = Array.from({ length: total }, (_, i) => i);
  let emptyPos = emptyIndex;
  const prng = createPRNG(level * 137);
  const moves = 20 + level * 8;

  for (let i = 0; i < moves; i += 1) {
    const row = Math.floor(emptyPos / size);
    const col = emptyPos % size;
    const neighbors = [];
    if (row > 0) neighbors.push(emptyPos - size);
    if (row < size - 1) neighbors.push(emptyPos + size);
    if (col > 0) neighbors.push(emptyPos - 1);
    if (col < size - 1) neighbors.push(emptyPos + 1);
    const nextEmpty = neighbors[Math.floor(prng() * neighbors.length)];
    board[emptyPos] = board[nextEmpty];
    board[nextEmpty] = emptyIndex;
    emptyPos = nextEmpty;
  }

  return board;
};

export const isSlideSolved = (board) => {
  const emptyIndex = board.length - 1;
  for (let i = 0; i < emptyIndex; i += 1) {
    if (board[i] !== i) return false;
  }
  return board[emptyIndex] === emptyIndex;
};

export const generateMaze = (level) => {
  // Odd grid that grows every 3 levels: L1-3:5, L4-6:7, L7-9:9, L10:11.
  const size = 5 + 2 * Math.floor((level - 1) / 3);
  const prng = createPRNG(level * 911);
  const grid = Array.from({ length: size }, () => Array(size).fill(1));

  const carve = (row, col) => {
    grid[row][col] = 0;
    const directions = shuffleArray(
      [
        [0, 2], [2, 0], [0, -2], [-2, 0],
      ],
      prng,
    );

    directions.forEach(([dr, dc]) => {
      const nr = row + dr;
      const nc = col + dc;
      if (nr > 0 && nr < size - 1 && nc > 0 && nc < size - 1 && grid[nr][nc] === 1) {
        grid[row + dr / 2][col + dc / 2] = 0;
        carve(nr, nc);
      }
    });
  };

  carve(1, 1);
  grid[1][1] = 0;
  grid[size - 2][size - 2] = 0;

  // Place start/goal on distinct odd cells, chosen per-level so that even when
  // the maze size repeats across the 10 levels every puzzle is unique.
  const odd = [];
  for (let r = 1; r <= size - 2; r += 2) {
    for (let c = 1; c <= size - 2; c += 2) odd.push([r, c]);
  }
  const start = odd[(level - 1) % odd.length];
  const goal = odd[(level - 1 + Math.ceil(odd.length / 2)) % odd.length];
  return { grid, start, goal };
};

export const getConnectDotLayout = (level) => {
  // Monotonic, graduated dot count: L1:5 ... L10:14.
  const count = 4 + level;
  const prng = createPRNG(level * 503);
  const cols = Math.ceil(Math.sqrt(count));
  const rows = Math.ceil(count / cols);
  const xStep = 70 / (cols + 1);
  const yStep = 70 / (rows + 1);
  const dots = [];
  for (let i = 0; i < count; i += 1) {
    const r = Math.floor(i / cols);
    const c = i % cols;
    const x = 15 + (c + 1) * xStep + (prng() - 0.5) * 4;
    const y = 15 + (r + 1) * yStep + (prng() - 0.5) * 4;
    dots.push({ id: i + 1, x, y });
  }
  return dots;
};

export const getSpotDifferenceScene = (level) => {
  const baseEmojis = ['🌳', '☀️', '🏠', '🌸', '🐦', '🦋', '🌈', '⭐'];
  const prng = createPRNG(level * 311);
  const left = baseEmojis.map((emoji, index) => ({
    id: index,
    emoji,
    x: 15 + (index % 4) * 23.33,
    y: 30 + Math.floor(index / 4) * 40,
  }));

  // Number of differences grows with level: L1-2:2, L3-4:3, L5-6:4, L7-8:5, L9-10:6.
  const diffCount = Math.min(2 + Math.floor((level - 1) / 2), 8);
  const diffIndices = shuffleArray([0, 1, 2, 3, 4, 5, 6, 7], prng).slice(0, diffCount);
  const altEmojis = ['🌲', '🌙', '🏡', '🌺', '🐤', '🐝', '☁️', '💫'];
  const right = left.map((item, index) => ({
    ...item,
    emoji: diffIndices.includes(index) ? altEmojis[index] : item.emoji,
    isDiff: diffIndices.includes(index),
  }));

  return { left, right, diffIndices };
};

const SHAPE_POOL = [
  { id: 'circle', emoji: '🔴', label: 'Circle' },
  { id: 'square', emoji: '🟦', label: 'Square' },
  { id: 'triangle', emoji: '🔺', label: 'Triangle' },
  { id: 'star', emoji: '⭐', label: 'Star' },
  { id: 'heart', emoji: '💜', label: 'Heart' },
  { id: 'diamond', emoji: '🔷', label: 'Diamond' },
];

export const getShapeFitLevel = (level) => {
  // More shapes in play as levels rise: L1-3:3, L4-6:4, L7-9:5, L10:6.
  // The active subset is rotated by level so every level uses a distinct set
  // of shapes (guaranteeing unique, non-repeating levels).
  const n = Math.min(3 + Math.floor((level - 1) / 3), SHAPE_POOL.length);
  const rotation = (level - 1) % SHAPE_POOL.length;
  const pool = Array.from(
    { length: n },
    (_, i) => SHAPE_POOL[(rotation + i) % SHAPE_POOL.length],
  );
  const prng = createPRNG(level * 719);
  let order = shuffleArray(pool, prng);
  // Keep any shape from sitting directly above its matching slot.
  let guard = 0;
  while (order.some((shape, index) => shape.id === pool[index].id) && guard < 30) {
    order = shuffleArray(pool, prng);
    guard += 1;
  }
  return { pool, order };
};

// ===== Color Sort (ball sort) =====
// Tubes hold colored balls; goal is to pour until each tube holds one color.
// The level starts from a solved board and is scrambled by a sequence of
// *reverse* pours, so the result is always solvable by replaying those pours.
const SORT_COLORS = ['#ff6b6b', '#4dabf7', '#51cf66', '#ffd43b', '#cc5de8', '#ff922b'];
const SORT_CAPACITY = 4;

export const getColorSortLevel = (level) => {
  // L1-2:2, L3-4:3, L5-6:4, L7-8:5, L9-10:6 colours.
  const colorCount = Math.min(2 + Math.floor((level - 1) / 2), SORT_COLORS.length);
  const prng = createPRNG(level * 827);
  const tubes = Array.from({ length: colorCount }, () => Array(SORT_CAPACITY).fill(0));
  // Start solved: tube i is filled with color i.
  tubes.forEach((tube, i) => { for (let k = 0; k < SORT_CAPACITY; k += 1) tube[k] = i; });
  tubes.push([]); // one empty tube to pour into

  const moves = 12 + level * 4;
  for (let m = 0; m < moves; m += 1) {
    const dst = Math.floor(prng() * tubes.length);
    if (tubes[dst].length === 0) continue;
    const ball = tubes[dst][tubes[dst].length - 1];
    const candidates = [];
    for (let s = 0; s < tubes.length; s += 1) {
      if (s === dst) continue;
      const t = tubes[s];
      if (t.length >= SORT_CAPACITY) continue;
      if (t.length === 0 || t[t.length - 1] === ball) candidates.push(s);
    }
    if (candidates.length === 0) continue;
    const src = candidates[Math.floor(prng() * candidates.length)];
    tubes[src].push(tubes[dst].pop());
  }

  return { tubes, colors: SORT_COLORS.slice(0, colorCount), capacity: SORT_CAPACITY };
};

// ===== Memory Match =====
// Returns a shuffled deck of `pairs` emoji pairs for the given level.
const MEMORY_EMOJIS = ['🍎', '🐶', '⭐', '🌈', '🚀', '🍉', '🐱', '🌸', '⚽', '🎈', '🐠', '🍔'];

export const getMemoryMatchLevel = (level) => {
  // L1:3 ... L10:12 pairs (strictly increasing, all 12 emojis used by L10).
  const pairs = Math.min(2 + level, 12);
  const chosen = MEMORY_EMOJIS.slice(0, pairs);
  const deck = shuffleArray([...chosen, ...chosen], createPRNG(level * 677));
  return { deck, pairs };
};

// ===== Emoji Word Search =====
// Child-friendly word lists grouped by theme. Each level picks one category
// and hides a handful of its words (3 letters or more) inside a letter grid.
const WORD_SEARCH_CATEGORIES = [
  {
    category: 'Animals',
    icon: '🐾',
    words: [
      { word: 'CAT', emoji: '🐱' },
      { word: 'DOG', emoji: '🐶' },
      { word: 'COW', emoji: '🐮' },
      { word: 'PIG', emoji: '🐷' },
      { word: 'HEN', emoji: '🐔' },
      { word: 'FOX', emoji: '🦊' },
    ],
  },
  {
    category: 'Colors',
    icon: '🎨',
    words: [
      { word: 'RED', emoji: '🔴' },
      { word: 'BLUE', emoji: '🔵' },
      { word: 'GREEN', emoji: '🟢' },
      { word: 'PINK', emoji: '🩷' },
      { word: 'GOLD', emoji: '🟡' },
      { word: 'CYAN', emoji: '🩵' },
    ],
  },
  {
    category: 'Nature',
    icon: '🌿',
    words: [
      { word: 'SUN', emoji: '🌞' },
      { word: 'SKY', emoji: '🌤️' },
      { word: 'SEA', emoji: '🌊' },
      { word: 'TREE', emoji: '🌳' },
      { word: 'STAR', emoji: '⭐' },
      { word: 'RAIN', emoji: '🌧️' },
    ],
  },
  {
    category: 'Shapes',
    icon: '🔷',
    words: [
      { word: 'CIRCLE', emoji: '⭕' },
      { word: 'SQUARE', emoji: '🟦' },
      { word: 'HEART', emoji: '❤️' },
      { word: 'MOON', emoji: '🌙' },
      { word: 'STAR', emoji: '⭐' },
      { word: 'CONE', emoji: '🔺' },
    ],
  },
  {
    category: 'Food',
    icon: '🍎',
    words: [
      { word: 'CAKE', emoji: '🍰' },
      { word: 'MILK', emoji: '🥛' },
      { word: 'EGG', emoji: '🥚' },
      { word: 'RICE', emoji: '🍚' },
      { word: 'FISH', emoji: '🐟' },
      { word: 'NUT', emoji: '🥜' },
    ],
  },
];

const WORD_SEARCH_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const getWordSearchLevel = (level) => {
  // Grid grows every 2 levels: 8 -> 12. Word count 3 -> 5.
  const size = 8 + Math.floor((level - 1) / 2);
  const wordCount = Math.min(2 + level, 5);
  const catIndex = (level - 1) % WORD_SEARCH_CATEGORIES.length;
  const category = WORD_SEARCH_CATEGORIES[catIndex];
  const prng = createPRNG(level * 241);
  const chosen = shuffleArray(category.words, prng).slice(0, wordCount);

  const grid = Array.from({ length: size }, () => Array(size).fill(null));
  const placements = [];

  const placeWord = (entry) => {
    const word = entry.word;
    const orientations = shuffleArray(
      [
        [0, 1],   // →
        [1, 0],   // ↓
        [0, -1],  // ←
        [-1, 0],  // ↑
      ],
      prng,
    );
    for (let attempt = 0; attempt < 100; attempt += 1) {
      const [dr, dc] = orientations[attempt % orientations.length];
      const r0 = Math.floor(prng() * size);
      const c0 = Math.floor(prng() * size);
      const rEnd = r0 + dr * (word.length - 1);
      const cEnd = c0 + dc * (word.length - 1);
      if (rEnd < 0 || rEnd >= size || cEnd < 0 || cEnd >= size) continue;
      const cells = [];
      let ok = true;
      for (let k = 0; k < word.length; k += 1) {
        const r = r0 + dr * k;
        const c = c0 + dc * k;
        if (grid[r][c] !== null && grid[r][c] !== word[k]) { ok = false; break; }
        cells.push([r, c]);
      }
      if (!ok) continue;
      cells.forEach(([r, c], k) => { grid[r][c] = word[k]; });
      placements.push({ word, emoji: entry.emoji, cells });
      return true;
    }
    return false;
  };

  chosen.forEach((entry) => placeWord(entry));

  for (let r = 0; r < size; r += 1) {
    for (let c = 0; c < size; c += 1) {
      if (grid[r][c] === null) {
        grid[r][c] = WORD_SEARCH_ALPHABET[Math.floor(prng() * WORD_SEARCH_ALPHABET.length)];
      }
    }
  }

  return {
    size,
    category: category.category,
    icon: category.icon,
    grid,
    words: placements,
  };
};

// ===== Pipe Connector =====
// A grid of rotatable pipe segments. The player taps a pipe to rotate it 90°
// clockwise; the level is solved when water can flow from the inlet (start)
// to the flower bucket (end) along connected openings.
//
// Directions: 0=N (up), 1=E (right), 2=S (down), 3=W (left).
const PIPE_DIRS = [[-1, 0], [0, 1], [1, 0], [0, -1]]; // N, E, S, W
const PIPE_OPP = (d) => (d + 2) % 4;

// Open directions (toward edges) for each pipe type at rotation 0.
const PIPE_OPEN = {
  straight: [0, 2], // │
  curve: [0, 1],    // └
  tee: [0, 1, 2],   // ├
  cross: [0, 1, 2, 3], // ┼
  end: [0],         // ╨ (single outlet — used for inlet/outlet caps)
};
const PIPE_TYPES = ['straight', 'curve', 'tee', 'cross'];

const rotateDirs = (dirs, rot) => dirs.map((d) => (d + rot) % 4);
const openDirs = (cell) => rotateDirs(PIPE_OPEN[cell.type], cell.rot);

export const getPipeOpenDirs = (cell) => openDirs(cell);

const directionBetween = (from, to) => {
  if (to[0] === from[0] - 1) return 0; // N
  if (to[1] === from[1] + 1) return 1; // E
  if (to[0] === from[0] + 1) return 2; // S
  return 3; // W
};

const pipeTypeForDirs = (dirs) => {
  const set = new Set(dirs);
  if (set.size === 1) return 'end';
  if (set.size === 2) {
    const has = (a) => set.has(a);
    if ((has(0) && has(2)) || (has(1) && has(3))) return 'straight';
    return 'curve';
  }
  if (set.size === 3) return 'tee';
  return 'cross';
};

// Find a rotation of `type` whose open edges exactly match `target` (as a set).
const rotationFor = (type, target) => {
  const tset = new Set(target);
  for (let rot = 0; rot < 4; rot += 1) {
    const open = rotateDirs(PIPE_OPEN[type], rot);
    if (open.length === tset.size && open.every((d) => tset.has(d))) return rot;
  }
  return 0;
};

// Depth-first search for any simple path from `start` to `end` (randomized).
const findPipePath = (size, start, end, prng) => {
  const visited = Array.from({ length: size }, () => Array(size).fill(false));
  const path = [];
  const dfs = (r, c) => {
    visited[r][c] = true;
    path.push([r, c]);
    if (r === end[0] && c === end[1]) return true;
    const order = shuffleArray([0, 1, 2, 3], prng);
    for (const d of order) {
      const nr = r + PIPE_DIRS[d][0];
      const nc = c + PIPE_DIRS[d][1];
      if (nr < 0 || nr >= size || nc < 0 || nc >= size) continue;
      if (visited[nr][nc]) continue;
      if (dfs(nr, nc)) return true;
    }
    path.pop();
    visited[r][c] = false;
    return false;
  };
  dfs(start[0], start[1]);
  return path.length ? path : null;
};

// Guaranteed staircase path (start → across → down/up to end) used only if the
// randomized search somehow fails (extremely unlikely on an open grid).
const buildFallbackPath = (size, start, end) => {
  const cells = [];
  const [sr, sc] = start;
  const [er, ec] = end;
  let r = sr;
  let c = sc;
  cells.push([r, c]);
  while (c < ec) { c += 1; cells.push([r, c]); }
  while (r < er) { r += 1; cells.push([r, c]); }
  while (r > er) { r -= 1; cells.push([r, c]); }
  return cells;
};

// Cells reachable from `start` by following mutually-open pipe edges.
export const getPipeFilled = (board, start) => {
  const size = board.length;
  const visited = Array.from({ length: size }, () => Array(size).fill(false));
  const filled = new Set();
  const queue = [start];
  visited[start[0]][start[1]] = true;
  while (queue.length) {
    const [r, c] = queue.shift();
    filled.add(`${r},${c}`);
    const open = new Set(openDirs(board[r][c]));
    for (const d of open) {
      const nr = r + PIPE_DIRS[d][0];
      const nc = c + PIPE_DIRS[d][1];
      if (nr < 0 || nr >= size || nc < 0 || nc >= size) continue;
      if (visited[nr][nc]) continue;
      if (openDirs(board[nr][nc]).includes(PIPE_OPP(d))) {
        visited[nr][nc] = true;
        queue.push([nr, nc]);
      }
    }
  }
  return filled;
};

export const getPipeConnectorLevel = (level) => {
  // Grid grows every 2 levels: L1-2:4 ... L9-10:8.
  const size = 4 + Math.floor((level - 1) / 2);
  const prng = createPRNG(level * 613);
  const start = [Math.floor(prng() * size), 0];
  const end = [Math.floor(prng() * size), size - 1];

  let path = null;
  for (let attempt = 0; attempt < 60 && !path; attempt += 1) {
    path = findPipePath(size, start, end, prng);
  }
  if (!path) path = buildFallbackPath(size, start, end);

  // Required open edges for each cell on the solution path.
  const req = Array.from({ length: size }, () => Array(size).fill(null));
  path.forEach((cell, i) => {
    const dirs = [];
    if (i > 0) dirs.push(directionBetween(cell, path[i - 1]));
    if (i < path.length - 1) dirs.push(directionBetween(cell, path[i + 1]));
    req[cell[0]][cell[1]] = dirs;
  });

  const board = Array.from({ length: size }, (_, r) =>
    Array.from({ length: size }, (_, c) => {
      const dirs = req[r][c];
      if (dirs) {
        const type = pipeTypeForDirs(dirs);
        const solRot = rotationFor(type, dirs);
        return { type, rot: solRot, solution: solRot };
      }
      const type = PIPE_TYPES[Math.floor(prng() * PIPE_TYPES.length)];
      return { type, rot: Math.floor(prng() * 4), solution: null };
    }),
  );

  // Scramble rotations so the puzzle starts unsolved, but avoid an instant win.
  let tries = 0;
  do {
    for (let r = 0; r < size; r += 1) {
      for (let c = 0; c < size; c += 1) {
        board[r][c].rot = Math.floor(prng() * 4);
      }
    }
    tries += 1;
  } while (getPipeFilled(board, start).has(`${end[0]},${end[1]}`) && tries < 16);

  return { size, board, start, end };
};

// ===== Shadow Match =====
// Match each colourful toy to its dark shadow. Difficulty grows with the
// number of toys (L1:3 ... L10:12). Fully deterministic per level.
const SHADOW_POOL = [
  { id: 'cat', emoji: '🐱', name: 'Cat' },
  { id: 'dog', emoji: '🐶', name: 'Dog' },
  { id: 'fish', emoji: '🐟', name: 'Fish' },
  { id: 'star', emoji: '⭐', name: 'Star' },
  { id: 'flower', emoji: '🌸', name: 'Flower' },
  { id: 'sun', emoji: '☀️', name: 'Sun' },
  { id: 'apple', emoji: '🍎', name: 'Apple' },
  { id: 'ball', emoji: '⚽', name: 'Ball' },
  { id: 'heart', emoji: '❤️', name: 'Heart' },
  { id: 'tree', emoji: '🌳', name: 'Tree' },
  { id: 'car', emoji: '🚗', name: 'Car' },
  { id: 'bird', emoji: '🐦', name: 'Bird' },
];

export const getShadowMatchLevel = (level) => {
  const count = Math.min(2 + level, SHADOW_POOL.length); // L1:3 ... L10:12
  const items = shuffleArray(SHADOW_POOL, createPRNG(level * 193)).slice(0, count);
  const shadows = shuffleArray(items, createPRNG(level * 397));
  return { items, shadows };
};

// ===== Pattern Sequence =====
// Find what comes next in a repeating emoji rhythm. Difficulty grows via a
// longer sequence AND a longer rhythm cycle. Fully deterministic per level.
const SEQ_SYMBOLS = ['🍎', '🍌', '🍇', '🍊', '⭐', '🟩', '🔴', '🟦', '🐶', '🐱', '🌸', '🌟'];

export const getPatternSequenceLevel = (level) => {
  const len = Math.min(3 + level, 10);                       // L1:4 ... L7-10:10
  const cycle = Math.min(2 + Math.floor((level - 1) / 3), 5); // L1-3:2, L4-6:3, L7-9:4, L10:5
  const prng = createPRNG(level * 211);
  const pool = shuffleArray(SEQ_SYMBOLS, prng).slice(0, cycle);
  const seq = [];
  for (let i = 0; i < len; i += 1) seq.push(pool[i % cycle]);
  const correct = pool[len % cycle];

  const opts = new Set([correct]);
  const distractors = shuffleArray(SEQ_SYMBOLS.filter((s) => !pool.includes(s)), prng);
  let k = 0;
  while (opts.size < 4 && k < distractors.length) opts.add(distractors[k++]);
  const options = shuffleArray([...opts], prng);

  return { seq, correct, options };
};

// ===== Coding Quest =====
// Help the robot navigate a grid to reach the star.
// N increases: L1-3:3, L4-7:4, L8-10:5.
export const getCodingQuestLevel = (level) => {
  const size = level <= 3 ? 3 : level <= 7 ? 4 : 5;
  const prng = createPRNG(level * 359);
  
  const start = [size - 1, 0];
  const goal = [0, size - 1];
  
  // Find a path from start to goal going Up or Right (to keep it solvable and simple)
  // At level 8+ we can allow some Down/Left for more complexity.
  let path = [];
  let current = [...start];
  path.push([...current]);
  
  while (current[0] !== goal[0] || current[1] !== goal[1]) {
    const nextCandidates = [];
    const [r, c] = current;
    
    // Primary candidates that get closer to goal
    if (r > goal[0]) nextCandidates.push([r - 1, c, '⬆️']);
    if (c < goal[1]) nextCandidates.push([r, c + 1, '➡️']);
    
    // Choose one randomly
    if (nextCandidates.length > 0) {
      const choice = nextCandidates[Math.floor(prng() * nextCandidates.length)];
      current = [choice[0], choice[1]];
      path.push([...current]);
    } else {
      break;
    }
  }
  
  // Map path to arrow directions
  const directions = [];
  for (let i = 0; i < path.length - 1; i += 1) {
    const from = path[i];
    const to = path[i + 1];
    if (to[0] === from[0] - 1) directions.push('⬆️');
    else if (to[0] === from[0] + 1) directions.push('⬇️');
    else if (to[1] === from[1] + 1) directions.push('➡️');
    else if (to[1] === from[1] - 1) directions.push('⬅️');
  }
  
  // Place obstacles in cells NOT in the path
  const obstacles = [];
  const maxObstacles = level <= 3 ? 1 : level <= 7 ? 2 : 3;
  const pathSet = new Set(path.map(([r, c]) => `${r},${c}`));
  
  const allCells = [];
  for (let r = 0; r < size; r += 1) {
    for (let c = 0; c < size; c += 1) {
      const key = `${r},${c}`;
      if (!pathSet.has(key) && !(r === start[0] && c === start[1]) && !(r === goal[0] && c === goal[1])) {
        allCells.push([r, c]);
      }
    }
  }
  
  const shuffledCells = shuffleArray(allCells, prng);
  const obstacleCount = Math.min(maxObstacles, shuffledCells.length);
  for (let i = 0; i < obstacleCount; i += 1) {
    obstacles.push(shuffledCells[i]);
  }
  
  // Generate options (correct + 3 distractors)
  const correctOption = directions;
  const options = [correctOption];
  
  const arrowPool = ['⬆️', '➡️', '⬇️', '⬅️'];
  while (options.length < 4) {
    const distractor = [];
    for (let i = 0; i < correctOption.length; i += 1) {
      distractor.push(arrowPool[Math.floor(prng() * arrowPool.length)]);
    }
    // Ensure it's unique
    if (!options.some(opt => opt.join(',') === distractor.join(','))) {
      options.push(distractor);
    }
  }
  
  // Shuffle options
  const shuffledOptions = shuffleArray(options, prng);
  const correctIndex = shuffledOptions.findIndex(opt => opt.join(',') === correctOption.join(','));
  
  return {
    size,
    start,
    goal,
    obstacles,
    path,
    options: shuffledOptions,
    correctIndex,
  };
};

// ===== Scale Balance =====
// Select the correct item/weight to balance the scale.
const WEIGHT_ITEMS = [
  { id: 'apple', emoji: '🍎', weight: 1, name: 'Apple' },
  { id: 'banana', emoji: '🍌', weight: 2, name: 'Banana' },
  { id: 'melon', emoji: '🍉', weight: 5, name: 'Melon' },
  { id: 'teddy', emoji: '🧸', weight: 8, name: 'Teddy Bear' },
];

export const getScaleBalanceLevel = (level) => {
  const prng = createPRNG(level * 487);
  
  let leftSide;
  let rightSide;
  let correctOption;
  let options;
  let mode = 'emoji'; // 'emoji' or 'weight'
  
  if (level <= 2) {
    // Level 1-2: Simple counting balance (apples, weight 1)
    const total = 2 + level; // L1: 3, L2: 4
    leftSide = Array(total).fill(WEIGHT_ITEMS[0]);
    const rightCount = total - 2;
    rightSide = Array(rightCount).fill(WEIGHT_ITEMS[0]);
    correctOption = { emoji: '🍎 🍎', weight: 2, label: '2 Apples' };
    
    options = [
      correctOption,
      { emoji: '🍎', weight: 1, label: '1 Apple' },
      { emoji: '🍎 🍎 🍎', weight: 3, label: '3 Apples' },
      { emoji: '🍎 🍎 🍎 🍎', weight: 4, label: '4 Apples' },
    ];
  } else if (level <= 4) {
    // Level 3-4: Fruit mixed balance
    if (level === 3) {
      // Left: Melon (5). Right: 2 Bananas (4) + ? (Apple: 1)
      leftSide = [WEIGHT_ITEMS[2]];
      rightSide = [WEIGHT_ITEMS[1], WEIGHT_ITEMS[1]];
      correctOption = { emoji: '🍎', weight: 1, label: 'Apple (1)' };
      options = [
        correctOption,
        { emoji: '🍌', weight: 2, label: 'Banana (2)' },
        { emoji: '🍎 🍎', weight: 2, label: '2 Apples (2)' },
        { emoji: '🍉', weight: 5, label: 'Melon (5)' },
      ];
    } else {
      // Left: Teddy (8). Right: Melon (5) + ? (3x Apple: 3)
      leftSide = [WEIGHT_ITEMS[3]];
      rightSide = [WEIGHT_ITEMS[2]];
      correctOption = { emoji: '🍎 🍎 🍎', weight: 3, label: '3 Apples' };
      options = [
        correctOption,
        { emoji: '🍎 🍎', weight: 2, label: '2 Apples' },
        { emoji: '🍌', weight: 2, label: 'Banana' },
        { emoji: '🍌 🍌', weight: 4, label: '2 Bananas' },
      ];
    }
  } else if (level <= 6) {
    // Level 5-6: Fruit & animal mixed
    if (level === 5) {
      // Left: 3 Bananas (6). Right: Melon (5) + ? (Apple: 1)
      leftSide = [WEIGHT_ITEMS[1], WEIGHT_ITEMS[1], WEIGHT_ITEMS[1]];
      rightSide = [WEIGHT_ITEMS[2]];
      correctOption = { emoji: '🍎', weight: 1, label: 'Apple' };
      options = [
        correctOption,
        { emoji: '🍌', weight: 2, label: 'Banana' },
        { emoji: '🍎 🍎', weight: 2, label: '2 Apples' },
        { emoji: '🍉', weight: 5, label: 'Melon' },
      ];
    } else {
      // Left: Teddy + Apple (9). Right: Melon (5) + ? (2 Bananas: 4)
      leftSide = [WEIGHT_ITEMS[3], WEIGHT_ITEMS[0]];
      rightSide = [WEIGHT_ITEMS[2]];
      correctOption = { emoji: '🍌 🍌', weight: 4, label: '2 Bananas' };
      options = [
        correctOption,
        { emoji: '🍌', weight: 2, label: '1 Banana' },
        { emoji: '🍎 🍎 🍎', weight: 3, label: '3 Apples' },
        { emoji: '🍉', weight: 5, label: 'Melon' },
      ];
    }
  } else {
    // Level 7-10: Mathematical weights (g)
    mode = 'weight';
    let target;
    let rightBase;
    
    if (level === 7) {
      target = 10;
      rightBase = 4;
      leftSide = [{ weight: 10, label: '10g' }];
      rightSide = [{ weight: 4, label: '4g' }];
    } else if (level === 8) {
      target = 15;
      rightBase = 6;
      leftSide = [{ weight: 10, label: '10g' }, { weight: 5, label: '5g' }];
      rightSide = [{ weight: 6, label: '6g' }];
    } else if (level === 9) {
      target = 20;
      rightBase = 12;
      leftSide = [{ weight: 10, label: '10g' }, { weight: 10, label: '10g' }];
      rightSide = [{ weight: 10, label: '10g' }, { weight: 2, label: '2g' }];
    } else {
      target = 30;
      rightBase = 15;
      leftSide = [{ weight: 20, label: '20g' }, { weight: 10, label: '10g' }];
      rightSide = [{ weight: 10, label: '10g' }, { weight: 5, label: '5g' }];
    }
    
    const correctVal = target - rightBase;
    correctOption = { emoji: '⚖️', weight: correctVal, label: `${correctVal}g` };
    
    options = [
      correctOption,
      { emoji: '⚖️', weight: correctVal - 2, label: `${correctVal - 2}g` },
      { emoji: '⚖️', weight: correctVal + 2, label: `${correctVal + 2}g` },
      { emoji: '⚖️', weight: correctVal - 4, label: `${correctVal - 4}g` },
    ];
  }
  
  const shuffledOptions = shuffleArray(options, prng);
  const correctIndex = shuffledOptions.findIndex(opt => opt.weight === correctOption.weight && opt.label === correctOption.label);
  
  return {
    mode,
    leftSide,
    rightSide,
    leftWeight: leftSide.reduce((sum, item) => sum + item.weight, 0),
    rightWeight: rightSide.reduce((sum, item) => sum + item.weight, 0),
    options: shuffledOptions,
    correctIndex,
  };
};

// ===== Weather Wizard =====
// Pick the correct clothing / gear for the given weather scene.
// Levels 1-3: single item, obvious distractors.
// Levels 4-6: best outfit combo out of 4 options.
// Levels 7-9: weather + activity context, 4 choices.
// Level 10:   hardest compound scene, 3 clues in prompt, 4 tricky choices.
const WEATHER_LEVELS = [
  // L1
  {
    skyGradient: 'linear-gradient(160deg,#6ec6ff 0%,#b3e5fc 100%)',
    weatherEmoji: '☀️',
    question: 'It is a bright sunny day! What should you wear outside?',
    options: [
      { emoji: '🕶️', label: 'Sunglasses' },
      { emoji: '🧥', label: 'Heavy Coat' },
      { emoji: '☂️', label: 'Umbrella' },
      { emoji: '🧤', label: 'Gloves' },
    ],
    correctIndex: 0,
    successMsg: 'Great choice! Sunglasses protect your eyes on sunny days! 🕶️☀️',
    wrongMsg: 'Hmm, think about what you need on a hot sunny day and try again!',
  },
  // L2
  {
    skyGradient: 'linear-gradient(160deg,#b0bec5 0%,#cfd8dc 100%)',
    weatherEmoji: '🌧️',
    question: 'It is raining outside! What will keep you dry?',
    options: [
      { emoji: '🏖️', label: 'Swimsuit' },
      { emoji: '☂️', label: 'Umbrella' },
      { emoji: '🕶️', label: 'Sunglasses' },
      { emoji: '🧢', label: 'Sun Hat' },
    ],
    correctIndex: 1,
    successMsg: 'Correct! An umbrella keeps you dry in the rain! ☂️',
    wrongMsg: 'Think about what stops the rain from reaching you and try again!',
  },
  // L3
  {
    skyGradient: 'linear-gradient(160deg,#e3f2fd 0%,#b3d4f0 100%)',
    weatherEmoji: '❄️',
    question: 'It is snowing and very cold! What should you put on?',
    options: [
      { emoji: '🩱', label: 'Swimsuit' },
      { emoji: '🩴', label: 'Flip Flops' },
      { emoji: '🧥', label: 'Winter Coat' },
      { emoji: '🕶️', label: 'Sunglasses' },
    ],
    correctIndex: 2,
    successMsg: 'Warm choice! A winter coat keeps you cozy in snow! 🧥❄️',
    wrongMsg: 'Brrr! Think about what keeps you warm and try again!',
  },
  // L4
  {
    skyGradient: 'linear-gradient(160deg,#fffde7 0%,#fff9c4 100%)',
    weatherEmoji: '🌤️',
    question: 'It is a warm spring day with a light breeze. Pick the BEST outfit!',
    options: [
      { emoji: '👕🩳', label: 'T-shirt + Shorts' },
      { emoji: '🧥🧤', label: 'Coat + Gloves' },
      { emoji: '🏖️⛱️', label: 'Swimsuit + Parasol' },
      { emoji: '🥾🧣', label: 'Boots + Scarf' },
    ],
    correctIndex: 0,
    successMsg: 'Perfect! Light clothes are ideal on a warm, breezy spring day! 👕🩳',
    wrongMsg: 'Not quite — it\'s warm with a light breeze. Think light layers and try again!',
  },
  // L5
  {
    skyGradient: 'linear-gradient(160deg,#90caf9 0%,#64b5f6 100%)',
    weatherEmoji: '⛈️',
    question: 'There is a thunderstorm with heavy rain and wind! What is the BEST plan?',
    options: [
      { emoji: '☂️🧥', label: 'Umbrella + Raincoat' },
      { emoji: '🩴🩱', label: 'Flip Flops + Swimsuit' },
      { emoji: '🕶️👒', label: 'Sunglasses + Sun Hat' },
      { emoji: '🛷⛸️', label: 'Sled + Ice Skates' },
    ],
    correctIndex: 0,
    successMsg: 'Smart! A raincoat and umbrella are your best friends in a storm! ⛈️',
    wrongMsg: 'A thunderstorm means heavy rain and wind — think waterproof gear and try again!',
  },
  // L6
  {
    skyGradient: 'linear-gradient(160deg,#f3e5f5 0%,#e1bee7 100%)',
    weatherEmoji: '🌫️',
    question: 'It is a foggy morning with cold temperatures. Best outfit?',
    options: [
      { emoji: '👗🌂', label: 'Summer dress + Parasol' },
      { emoji: '🧥🧣', label: 'Warm jacket + Scarf' },
      { emoji: '🏊🥽', label: 'Swimsuit + Goggles' },
      { emoji: '🩱🌂', label: 'Swimsuit + Umbrella' },
    ],
    correctIndex: 1,
    successMsg: 'Excellent! On a foggy cold morning a warm jacket and scarf are perfect! 🧥🧣',
    wrongMsg: 'Foggy and cold means warm layers! Pick the cosy option and try again!',
  },
  // L7
  {
    skyGradient: 'linear-gradient(160deg,#fff8e1 0%,#ffecb3 100%)',
    weatherEmoji: '☀️🏃',
    question: 'You are going for a jog on a scorching hot day (38°C / 100°F). What do you pick?',
    options: [
      { emoji: '🧥🧣', label: 'Thick coat + Scarf' },
      { emoji: '👟🧢', label: 'Trainers + Cap' },
      { emoji: '🥾⛑️', label: 'Heavy boots + Helmet' },
      { emoji: '🩱🧤', label: 'Swimsuit + Gloves' },
    ],
    correctIndex: 1,
    successMsg: 'Awesome! Lightweight trainers and a cap keep you cool while jogging in the heat! 🏃☀️',
    wrongMsg: 'Scorching heat + jogging = light & breathable! Think again and try!',
  },
  // L8
  {
    skyGradient: 'linear-gradient(160deg,#e8f5e9 0%,#c8e6c9 100%)',
    weatherEmoji: '🌨️🏔️',
    question: 'You are hiking up a snowy mountain in a blizzard. What is the safest gear?',
    options: [
      { emoji: '🩴🕶️', label: 'Flip Flops + Sunglasses' },
      { emoji: '🧥🥾🧤', label: 'Insulated Jacket + Boots + Gloves' },
      { emoji: '👗🎀', label: 'Summer Dress + Ribbon' },
      { emoji: '🩱☂️', label: 'Swimsuit + Parasol' },
    ],
    correctIndex: 1,
    successMsg: 'Perfect mountaineer! Insulated jacket, boots, and gloves are essential in a blizzard! 🏔️',
    wrongMsg: 'A blizzard on a mountain is very dangerous — you need serious warm layers! Try again!',
  },
  // L9
  {
    skyGradient: 'linear-gradient(160deg,#fce4ec 0%,#f8bbd0 100%)',
    weatherEmoji: '🌦️🚲',
    question: 'You are cycling to school — it is drizzling now but sun is forecast later. Best combo?',
    options: [
      { emoji: '🧥🕶️', label: 'Raincoat + Sunglasses' },
      { emoji: '🩱🛟', label: 'Swimsuit + Floatie' },
      { emoji: '🧤⛸️', label: 'Gloves + Ice Skates' },
      { emoji: '🏖️🎑', label: 'Beach towel + Lantern' },
    ],
    correctIndex: 0,
    successMsg: 'Clever! A raincoat handles the drizzle, and sunglasses are ready for the sun! 🚲🌦️',
    wrongMsg: 'Drizzle now, sun later — pack something for rain AND sun! Try again!',
  },
  // L10
  {
    skyGradient: 'linear-gradient(160deg,#263238 0%,#455a64 100%)',
    weatherEmoji: '🌩️🌊💨',
    question: 'Hurricane warning! Gale-force winds, torrential rain, and storm surges. You must go out briefly — what do you wear?',
    options: [
      { emoji: '🩴🩱', label: 'Flip Flops + Swimsuit' },
      { emoji: '🧥🧤🥾', label: 'Heavy waterproof jacket + Gloves + Rubber boots' },
      { emoji: '👗👒', label: 'Light Dress + Sun Hat' },
      { emoji: '🕶️🏖️', label: 'Sunglasses + Beach Bag' },
    ],
    correctIndex: 1,
    successMsg: 'Expert choice! Heavy waterproof gear and rubber boots protect you in a hurricane! 🌩️',
    wrongMsg: 'This is a hurricane — you need maximum waterproof protection! Think carefully and try again!',
  },
];

export const getWeatherWizardLevel = (level) => {
  const prng = createPRNG(level * 557 + 3);
  const levelData = WEATHER_LEVELS[level - 1];
  // Shuffle options but keep correctIndex tracking
  const indexed = levelData.options.map((opt, i) => ({ opt, isCorrect: i === levelData.correctIndex }));
  const shuffled = shuffleArray(indexed, prng);
  const correctIndex = shuffled.findIndex(item => item.isCorrect);
  return {
    ...levelData,
    options: shuffled.map(item => item.opt),
    correctIndex,
  };
};

// ===== Emoji Cipher =====
// Decode an emoji sequence to find the hidden word or phrase.
// L1-3:  1 emoji = 1 word (shown in legend), 4 choices
// L4-6:  2-emoji phrase, legend shown for ONE emoji only
// L7-9:  3-emoji phrase, no legend
// L10:   3-4 emoji idiomatic phrase, no legend, tricky distractors
const EMOJI_CIPHER_LEVELS = [
  // L1 — single emoji, full legend
  {
    emojiSequence: ['🐱'],
    legend: [{ emoji: '🐱', word: 'CAT' }],
    options: ['CAT', 'DOG', 'SUN', 'BEE'],
    correctIndex: 0,
    successMsg: '🐱 = CAT! Great decoding! 🌟',
    wrongMsg: 'Look at the legend and try again!',
  },
  // L2 — single emoji, full legend
  {
    emojiSequence: ['⭐'],
    legend: [{ emoji: '⭐', word: 'STAR' }],
    options: ['MOON', 'STAR', 'FIRE', 'RAIN'],
    correctIndex: 1,
    successMsg: '⭐ = STAR! You are a star decoder! 🌟',
    wrongMsg: 'Check the legend — what does ⭐ mean? Try again!',
  },
  // L3 — single emoji, full legend
  {
    emojiSequence: ['🌊'],
    legend: [{ emoji: '🌊', word: 'WAVE' }],
    options: ['LAKE', 'SNOW', 'WAVE', 'WIND'],
    correctIndex: 2,
    successMsg: '🌊 = WAVE! Fantastic! 🌟',
    wrongMsg: 'Use the legend to decode the emoji and try again!',
  },
  // L4 — two emojis, one legend hint
  {
    emojiSequence: ['🐶', '🏃'],
    legend: [{ emoji: '🏃', word: 'RUNS' }],
    options: ['CAT WALKS', 'DOG RUNS', 'BIRD FLIES', 'FISH SWIMS'],
    correctIndex: 1,
    successMsg: '🐶🏃 = DOG RUNS! Brilliant! 🐕',
    wrongMsg: '🐶 is a well-known pet and 🏃 means RUNS. Decode together and try again!',
  },
  // L5 — two emojis, one legend hint
  {
    emojiSequence: ['☀️', '😊'],
    legend: [{ emoji: '😊', word: 'HAPPY' }],
    options: ['MOON SAD', 'RAIN COLD', 'SUN HAPPY', 'STAR BRIGHT'],
    correctIndex: 2,
    successMsg: '☀️😊 = SUN HAPPY! The sun makes us happy! 🌟',
    wrongMsg: '☀️ shines in the sky — what is that bright object? Try again!',
  },
  // L6 — two emojis, one legend hint
  {
    emojiSequence: ['🍎', '🌳'],
    legend: [{ emoji: '🌳', word: 'TREE' }],
    options: ['ORANGE BUSH', 'APPLE TREE', 'BANANA VINE', 'CHERRY BUSH'],
    correctIndex: 1,
    successMsg: '🍎🌳 = APPLE TREE! You found it! 🌳',
    wrongMsg: '🍎 is a red fruit — what is it called? Try again!',
  },
  // L7 — three emojis, NO legend
  {
    emojiSequence: ['🐸', '🌿', '💧'],
    legend: null,
    options: ['FROG ON LEAF IN RAIN', 'FISH IN WATER', 'BIRD ON TREE', 'BUG IN GRASS'],
    correctIndex: 0,
    successMsg: '🐸🌿💧 = FROG ON LEAF IN RAIN! Incredible decoding! 🐸',
    wrongMsg: 'No hints this time! 🐸 = frog, 🌿 = leaf/plant, 💧 = water/rain. Try again!',
  },
  // L8 — three emojis, NO legend
  {
    emojiSequence: ['🚀', '⭐', '🌌'],
    legend: null,
    options: ['ROCKET TO THE STARS IN SPACE', 'CAR ON THE ROAD', 'BOAT ON THE SEA', 'PLANE IN THE CLOUDS'],
    correctIndex: 0,
    successMsg: '🚀⭐🌌 = ROCKET TO THE STARS IN SPACE! Superstar! 🚀',
    wrongMsg: 'Think: 🚀 travels to ⭐ stars through 🌌 the galaxy. Try again!',
  },
  // L9 — three emojis, NO legend
  {
    emojiSequence: ['🎂', '🎁', '🎉'],
    legend: null,
    options: ['A SAD GOODBYE', 'A BIRTHDAY PARTY', 'A SCHOOL LESSON', 'A RAINY AFTERNOON'],
    correctIndex: 1,
    successMsg: '🎂🎁🎉 = A BIRTHDAY PARTY! What a celebration! 🎉',
    wrongMsg: 'Cake, gifts, and confetti — what kind of event is that? Try again!',
  },
  // L10 — four emojis, NO legend, idiomatic
  {
    emojiSequence: ['💡', '📚', '🏆', '🌟'],
    legend: null,
    options: ['PLAYING GAMES ALL DAY', 'SMART STUDYING WINS GLORY', 'BUYING BOOKS AT A STORE', 'SLEEPING UNDER THE STARS'],
    correctIndex: 1,
    successMsg: '💡📚🏆🌟 = SMART STUDYING WINS GLORY! You are a Cipher Master! 🏆🌟',
    wrongMsg: 'A lightbulb (idea/smart), books (studying), trophy (winning), star (glory). Try again!',
  },
];

export const getEmojiCipherLevel = (level) => {
  const prng = createPRNG(level * 613 + 7);
  const levelData = EMOJI_CIPHER_LEVELS[level - 1];
  // Shuffle options while tracking correct answer
  const indexed = levelData.options.map((opt, i) => ({ opt, isCorrect: i === levelData.correctIndex }));
  const shuffled = shuffleArray(indexed, prng);
  const correctIndex = shuffled.findIndex(item => item.isCorrect);
  return {
    ...levelData,
    options: shuffled.map(item => item.opt),
    correctIndex,
  };
};

// ===== Constellation Finder =====
const CONSTELLATION_LEVELS = [
  // L1 - Triangle (3 stars)
  {
    constellationName: "Triangle Constellation",
    emoji: "📐",
    hint: "Connect stars 1, 2, 3 to form a bright celestial triangle!",
    stars: [
      { id: 1, x: 160, y: 70 },
      { id: 2, x: 80, y: 230 },
      { id: 3, x: 240, y: 230 },
    ],
    successMsg: "Fantastic! You revealed the celestial Triangle! 📐✨",
  },
  // L2 - Little Dipper Handle (4 stars)
  {
    constellationName: "Little Dipper Handle",
    emoji: "🌟",
    hint: "Connect stars 1 to 4 along the tail of the Little Bear!",
    stars: [
      { id: 1, x: 60, y: 100 },
      { id: 2, x: 120, y: 130 },
      { id: 3, x: 180, y: 160 },
      { id: 4, x: 240, y: 220 },
    ],
    successMsg: "Wonderful! You tracked the Little Dipper's handle! 🌟✨",
  },
  // L3 - Cassiopeia (5 stars)
  {
    constellationName: "Cassiopeia's W",
    emoji: "👑",
    hint: "Connect stars 1 to 5 to form Queen Cassiopeia's starry crown W!",
    stars: [
      { id: 1, x: 50, y: 100 },
      { id: 2, x: 110, y: 220 },
      { id: 3, x: 160, y: 130 },
      { id: 4, x: 220, y: 240 },
      { id: 5, x: 270, y: 110 },
    ],
    successMsg: "Majestic! Cassiopeia's Crown shines brightly! 👑✨",
  },
  // L4 - Orion's Belt & Sword (5 stars)
  {
    constellationName: "Orion's Belt",
    emoji: "🏹",
    hint: "Connect stars 1 to 5 to align Orion the Hunter's belt & sword!",
    stars: [
      { id: 1, x: 70, y: 160 },
      { id: 2, x: 150, y: 160 },
      { id: 3, x: 230, y: 160 },
      { id: 4, x: 150, y: 210 },
      { id: 5, x: 150, y: 260 },
    ],
    successMsg: "Bullseye! Orion's Belt is completely connected! 🏹✨",
  },
  // L5 - Northern Cross / Cygnus (6 stars)
  {
    constellationName: "Cygnus the Swan",
    emoji: "🦢",
    hint: "Connect stars 1 to 6 to outline Cygnus soaring through the Milky Way!",
    stars: [
      { id: 1, x: 160, y: 50 },
      { id: 2, x: 160, y: 130 },
      { id: 3, x: 60, y: 130 },
      { id: 4, x: 260, y: 130 },
      { id: 5, x: 160, y: 210 },
      { id: 6, x: 160, y: 270 },
    ],
    successMsg: "Graceful! Cygnus the Swan spreads its wings! 🦢✨",
  },
  // L6 - Big Dipper (7 stars)
  {
    constellationName: "The Big Dipper",
    emoji: "🐻",
    hint: "Connect stars 1 to 7 to form the famous Great Bear scoop!",
    stars: [
      { id: 1, x: 40, y: 100 },
      { id: 2, x: 90, y: 130 },
      { id: 3, x: 140, y: 150 },
      { id: 4, x: 180, y: 200 },
      { id: 5, x: 180, y: 260 },
      { id: 6, x: 270, y: 260 },
      { id: 7, x: 270, y: 200 },
    ],
    successMsg: "Superb! The Big Dipper is glowing in the night sky! 🐻✨",
  },
  // L7 - Scorpius (8 stars)
  {
    constellationName: "Scorpius the Scorpion",
    emoji: "🦂",
    hint: "Connect stars 1 to 8 to trace the curving tail of Scorpius!",
    stars: [
      { id: 1, x: 240, y: 60 },
      { id: 2, x: 200, y: 100 },
      { id: 3, x: 180, y: 150 },
      { id: 4, x: 160, y: 200 },
      { id: 5, x: 120, y: 240 },
      { id: 6, x: 70, y: 230 },
      { id: 7, x: 60, y: 180 },
      { id: 8, x: 90, y: 150 },
    ],
    successMsg: "Stunning! The Scorpion's tail is fully illuminated! 🦂✨",
  },
  // L8 - Pegasus Square (8 stars)
  {
    constellationName: "Pegasus Great Square",
    emoji: "🐴",
    hint: "Connect stars 1 to 8 to build the Great Square of Pegasus!",
    stars: [
      { id: 1, x: 80, y: 80 },
      { id: 2, x: 240, y: 80 },
      { id: 3, x: 240, y: 220 },
      { id: 4, x: 80, y: 220 },
      { id: 5, x: 80, y: 80 },
      { id: 6, x: 40, y: 270 },
      { id: 7, x: 280, y: 270 },
      { id: 8, x: 280, y: 40 },
    ],
    successMsg: "Legendary! Pegasus taking flight among the stars! 🐴✨",
  },
  // L9 - Leo the Lion (9 stars)
  {
    constellationName: "Leo the Lion",
    emoji: "🦁",
    hint: "Connect stars 1 to 9 to draw Leo's majestic mane and body!",
    stars: [
      { id: 1, x: 250, y: 80 },
      { id: 2, x: 220, y: 50 },
      { id: 3, x: 170, y: 70 },
      { id: 4, x: 180, y: 130 },
      { id: 5, x: 240, y: 140 },
      { id: 6, x: 120, y: 150 },
      { id: 7, x: 60, y: 220 },
      { id: 8, x: 140, y: 220 },
      { id: 9, x: 180, y: 130 },
    ],
    successMsg: "Roaring success! Leo the Lion shines in glory! 🦁✨",
  },
  // L10 - Draco the Dragon (10 stars)
  {
    constellationName: "Draco the Dragon",
    emoji: "🐉",
    hint: "Connect all 10 stars to unlock the ancient Dragon of the North Pole!",
    stars: [
      { id: 1, x: 270, y: 60 },
      { id: 2, x: 230, y: 40 },
      { id: 3, x: 200, y: 80 },
      { id: 4, x: 230, y: 110 },
      { id: 5, x: 170, y: 130 },
      { id: 6, x: 120, y: 110 },
      { id: 7, x: 90, y: 160 },
      { id: 8, x: 130, y: 210 },
      { id: 9, x: 190, y: 230 },
      { id: 10, x: 250, y: 260 },
    ],
    successMsg: "UNBELIEVABLE! You mastered Draco the Celestial Dragon! 🐉✨",
  },
];

export const getConstellationLevel = (level) => {
  const prng = createPRNG(level * 701 + 11);
  const baseData = CONSTELLATION_LEVELS[level - 1];
  
  // Generate 6 ambient background stars
  const ambientStars = Array.from({ length: 6 }, () => ({
    x: Math.floor(prng() * 280 + 20),
    y: Math.floor(prng() * 280 + 20),
    r: Number((prng() * 1.5 + 1).toFixed(1)),
    opacity: Number((prng() * 0.5 + 0.3).toFixed(2)),
  }));

  return {
    ...baseData,
    ambientStars,
  };
};

// ===== Gear Gears =====
const GEAR_LEVELS = [
  // L1
  {
    question: "Gear A turns CLOCKWISE (➡️). Which way will Gear B turn?",
    gears: [
      { x: 100, y: 80, r: 40, label: "A (cw)", color: "#ff7043", dir: "cw" },
      { x: 180, y: 80, r: 40, label: "B (?)", color: "#42a5f5", dir: "ccw" },
    ],
    options: [
      { emoji: "🔄", label: "Counter-Clockwise (⬅️)" },
      { emoji: "🔁", label: "Clockwise (➡️)" },
      { emoji: "⏹️", label: "It Won't Move" },
      { emoji: "⬆️", label: "Straight Up" },
    ],
    correctIndex: 0,
    successMsg: "Correct! Adjacent meshed gears always turn in OPPOSITE directions! ⚙️",
    wrongMsg: "Remember: when teeth mesh together, one gear pushes the other in reverse! Try again.",
  },
  // L2
  {
    question: "Gear A turns COUNTER-CLOCKWISE (⬅️). Which way will Gear B turn?",
    gears: [
      { x: 100, y: 80, r: 40, label: "A (ccw)", color: "#ab47bc", dir: "ccw" },
      { x: 180, y: 80, r: 40, label: "B (?)", color: "#26a69a", dir: "cw" },
    ],
    options: [
      { emoji: "🔁", label: "Clockwise (➡️)" },
      { emoji: "🔄", label: "Counter-Clockwise (⬅️)" },
      { emoji: "⏹️", label: "Stays Still" },
      { emoji: "⬇️", label: "Straight Down" },
    ],
    correctIndex: 0,
    successMsg: "Spot on! If Gear A goes left, Gear B must go right! ⚙️",
    wrongMsg: "Opposites attract! Left-turning gear pushes right-turning gear. Try again.",
  },
  // L3
  {
    question: "Gear A turns CLOCKWISE (➡️). Which way will the last gear C turn?",
    gears: [
      { x: 70, y: 80, r: 35, label: "A (cw)", color: "#ef5350", dir: "cw" },
      { x: 140, y: 80, r: 35, label: "B", color: "#ffa726", dir: "ccw" },
      { x: 210, y: 80, r: 35, label: "C (?)", color: "#66bb6a", dir: "cw" },
    ],
    options: [
      { emoji: "🔁", label: "Clockwise (➡️)" },
      { emoji: "🔄", label: "Counter-Clockwise (⬅️)" },
      { emoji: "⏹️", label: "No Motion" },
      { emoji: "↔️", label: "Wobble Back & Forth" },
    ],
    correctIndex: 0,
    successMsg: "Genius! With 3 gears in a row, Gear 1 & Gear 3 turn in the SAME direction! ⚙️",
    wrongMsg: "Trace A -> B (opposite) -> C (opposite again!). Try again.",
  },
  // L4
  {
    question: "Gear A (cw) drives B, which drives C. Which direction does Gear C turn?",
    gears: [
      { x: 70, y: 80, r: 35, label: "A", color: "#8d6e63", dir: "cw" },
      { x: 140, y: 80, r: 35, label: "B", color: "#26c6da", dir: "ccw" },
      { x: 210, y: 80, r: 35, label: "C (?)", color: "#ec407a", dir: "cw" },
    ],
    options: [
      { emoji: "🔁", label: "Clockwise (➡️)" },
      { emoji: "🔄", label: "Counter-Clockwise (⬅️)" },
      { emoji: "⏹️", label: "Locked" },
      { emoji: "🔀", label: "Randomly" },
    ],
    correctIndex: 0,
    successMsg: "Brilliant! An odd number of gears in a chain means start & end spin together! ⚙️",
    wrongMsg: "A is CW ➡️ B is CCW ⬅️ C is CW ➡️! Try again.",
  },
  // L5
  {
    question: "4 gears in a row! A turns CLOCKWISE (➡️). Which way does Gear D turn?",
    gears: [
      { x: 50, y: 80, r: 30, label: "A (cw)", color: "#78909c", dir: "cw" },
      { x: 110, y: 80, r: 30, label: "B", color: "#5c6bc0", dir: "ccw" },
      { x: 170, y: 80, r: 30, label: "C", color: "#26a69a", dir: "cw" },
      { x: 230, y: 80, r: 30, label: "D (?)", color: "#ffca28", dir: "ccw" },
    ],
    options: [
      { emoji: "🔄", label: "Counter-Clockwise (⬅️)" },
      { emoji: "🔁", label: "Clockwise (➡️)" },
      { emoji: "⏹️", label: "Stuck" },
      { emoji: "🔄🔁", label: "Both Ways" },
    ],
    correctIndex: 0,
    successMsg: "Fantastic! 4 gears (even number) flips the end gear direction! ⚙️",
    wrongMsg: "Odd count = same direction; Even count = opposite direction! Try again.",
  },
  // L6
  {
    question: "BIG Gear A turns 1 full spin. SMALL Gear B is half its size. How many spins does B make?",
    gears: [
      { x: 100, y: 80, r: 45, label: "A (Big)", color: "#ff7043", dir: "cw" },
      { x: 170, y: 80, r: 25, label: "B (Small)", color: "#29b6f6", dir: "ccw" },
    ],
    options: [
      { emoji: "2️⃣", label: "2 Full Spins" },
      { emoji: "1️⃣", label: "1 Full Spin" },
      { emoji: "0️⃣", label: "Half a Spin" },
      { emoji: "4️⃣", label: "4 Full Spins" },
    ],
    correctIndex: 0,
    successMsg: "Super mechanical logic! Small gear has half as many teeth, so it spins TWICE as fast! ⚙️⚡",
    wrongMsg: "Smaller gears have fewer teeth, so they must turn FASTER to keep up! Try again.",
  },
  // L7
  {
    question: "SMALL Gear A makes 2 spins. BIG Gear B is twice its size. How many spins does B make?",
    gears: [
      { x: 90, y: 80, r: 25, label: "A (Small)", color: "#66bb6a", dir: "cw" },
      { x: 160, y: 80, r: 45, label: "B (Big)", color: "#ab47bc", dir: "ccw" },
    ],
    options: [
      { emoji: "1️⃣", label: "1 Full Spin" },
      { emoji: "2️⃣", label: "2 Full Spins" },
      { emoji: "4️⃣", label: "4 Full Spins" },
      { emoji: "0️⃣", label: "Zero Spins" },
    ],
    correctIndex: 0,
    successMsg: "Nailed it! Big gear takes twice as long, so 2 small spins = 1 big spin! ⚙️",
    wrongMsg: "Larger gear takes more teeth to rotate around once. Think slower and try again!",
  },
  // L8
  {
    question: "Gear A turns CCW (⬅️). Gear B is above A. Which way does B turn?",
    gears: [
      { x: 150, y: 110, r: 35, label: "A (ccw)", color: "#ef5350", dir: "ccw" },
      { x: 150, y: 45, r: 35, label: "B (?)", color: "#ffa726", dir: "cw" },
    ],
    options: [
      { emoji: "🔁", label: "Clockwise (➡️)" },
      { emoji: "🔄", label: "Counter-Clockwise (⬅️)" },
      { emoji: "⏹️", label: "No Movement" },
      { emoji: "⬆️", label: "Moves Upwards" },
    ],
    correctIndex: 0,
    successMsg: "Awesome! Vertical gear stacks work the exact same way — opposite direction! ⚙️",
    wrongMsg: "Direction flipping applies whether gears are side-by-side or stacked vertically! Try again.",
  },
  // L9
  {
    question: "3 gears in a triangle mesh: A touches B, B touches C, C touches A! What happens when A turns?",
    gears: [
      { x: 100, y: 110, r: 30, label: "A", color: "#26c6da", dir: "cw" },
      { x: 180, y: 110, r: 30, label: "B", color: "#ab47bc", dir: "ccw" },
      { x: 140, y: 50, r: 30, label: "C", color: "#ff7043", dir: "cw" },
    ],
    options: [
      { emoji: "🔒", label: "The Gears JAM & Lock Up!" },
      { emoji: "🚀", label: "They Spin Super Fast" },
      { emoji: "🔁", label: "All Spin Clockwise" },
      { emoji: "🔄", label: "All Spin Counter-Clockwise" },
    ],
    correctIndex: 0,
    successMsg: "WOW! You spotted the gear lock! An odd ring of 3 meshed gears locks up solid! 🔒⚙️",
    wrongMsg: "Trace A (CW) -> B (CCW) -> C (CW). But A and C touch each other too! What happens when two CW gears touch? Try again!",
  },
  // L10
  {
    question: "MASTER ENGINEER: 5-gear chain (A, B, C, D, E). Gear A turns CLOCKWISE. Which way does E turn?",
    gears: [
      { x: 40, y: 80, r: 25, label: "A", color: "#ef5350", dir: "cw" },
      { x: 90, y: 80, r: 25, label: "B", color: "#ffa726", dir: "ccw" },
      { x: 140, y: 80, r: 25, label: "C", color: "#66bb6a", dir: "cw" },
      { x: 190, y: 80, r: 25, label: "D", color: "#42a5f5", dir: "ccw" },
      { x: 240, y: 80, r: 25, label: "E (?)", color: "#ab47bc", dir: "cw" },
    ],
    options: [
      { emoji: "🔁", label: "Clockwise (➡️)" },
      { emoji: "🔄", label: "Counter-Clockwise (⬅️)" },
      { emoji: "🔒", label: "System Locks Up" },
      { emoji: "⏹️", label: "Stops at D" },
    ],
    correctIndex: 0,
    successMsg: "MASTER ENGINEER UNLOCKED! 5 gears (odd) = Gear 1 and 5 spin in the EXACT SAME direction! ⚙️🏆🌟",
    wrongMsg: "Count the flips: 1 (CW) -> 2 (CCW) -> 3 (CW) -> 4 (CCW) -> 5 (?); try again!",
  },
];

export const getGearGearsLevel = (level) => {
  const prng = createPRNG(level * 823 + 19);
  const baseData = GEAR_LEVELS[level - 1];
  const indexed = baseData.options.map((opt, i) => ({ opt, isCorrect: i === baseData.correctIndex }));
  const shuffled = shuffleArray(indexed, prng);
  const correctIndex = shuffled.findIndex(item => item.isCorrect);

  return {
    ...baseData,
    options: shuffled.map(item => item.opt),
    correctIndex,
  };
};
