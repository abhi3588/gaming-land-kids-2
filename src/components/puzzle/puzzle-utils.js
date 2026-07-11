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
