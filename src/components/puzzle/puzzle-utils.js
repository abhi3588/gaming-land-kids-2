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
