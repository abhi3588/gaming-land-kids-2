export const TOTAL_LEVELS = 5;
export const GRID_SIZE = 3;

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
// via background-position, so the 9 pieces reassemble into the picture.
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
// image, scaled to 3x the piece and offset so this (row,col) cell
// reveals exactly its third. background-position % is exact for this.
export const getPieceBackgroundStyle = (theme, row, col) => ({
  backgroundImage: buildSolutionImage(theme),
  backgroundSize: '300% 300%',
  backgroundPosition: `${col === 0 ? '0%' : col === 1 ? '50%' : '100%'} ${row === 0 ? '0%' : row === 1 ? '50%' : '100%'}`,
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
  const size = GRID_SIZE;
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
  const size = 7;
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
  return { grid, start: [1, 1], goal: [size - 2, size - 2] };
};

export const getConnectDotLayout = (level) => {
  const count = 6 + (level % 3);
  const prng = createPRNG(level * 503);
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    x: 15 + (index % 3) * 30 + prng() * 8,
    y: 12 + Math.floor(index / 3) * 28 + prng() * 8,
  }));
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

  const diffIndices = shuffleArray([0, 1, 2, 3, 4, 5, 6, 7], prng).slice(0, 3);
  const altEmojis = ['🌲', '🌙', '🏡', '🌺', '🐤', '🐝', '☁️', '💫'];
  const right = left.map((item, index) => ({
    ...item,
    emoji: diffIndices.includes(index) ? altEmojis[index] : item.emoji,
    isDiff: diffIndices.includes(index),
  }));

  return { left, right, diffIndices };
};

export const getShapeFitLevel = (level) => {
  const shapes = [
    { id: 'circle', emoji: '🔴', label: 'Circle' },
    { id: 'square', emoji: '🟦', label: 'Square' },
    { id: 'triangle', emoji: '🔺', label: 'Triangle' },
    { id: 'star', emoji: '⭐', label: 'Star' },
  ];
  const prng = createPRNG(level * 719);
  let order = shuffleArray(shapes, prng);
  // Keep any shape from sitting directly above its matching slot.
  let guard = 0;
  while (order.some((shape, index) => shape.id === shapes[index].id) && guard < 30) {
    order = shuffleArray(shapes, prng);
    guard += 1;
  }
  return order;
};

// ===== Color Sort (ball sort) =====
// Tubes hold colored balls; goal is to pour until each tube holds one color.
// The level starts from a solved board and is scrambled by a sequence of
// *reverse* pours, so the result is always solvable by replaying those pours.
const SORT_COLORS = ['#ff6b6b', '#4dabf7', '#51cf66', '#ffd43b', '#cc5de8', '#ff922b'];
const SORT_CAPACITY = 4;

export const getColorSortLevel = (level) => {
  const colorCount = Math.min(2 + Math.floor((level - 1) / 2), SORT_COLORS.length); // L1-2:2, L3-4:3, L5:4
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
  const pairs = level < 5 ? 2 + level : 8; // L1:3, L2:4, L3:5, L4:6, L5:8
  const chosen = MEMORY_EMOJIS.slice(0, pairs);
  const deck = shuffleArray([...chosen, ...chosen], createPRNG(level * 677));
  return { deck, pairs };
};
