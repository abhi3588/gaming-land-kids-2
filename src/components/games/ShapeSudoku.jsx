import { useState } from 'react';
import { playSound } from '../../utils/sounds';

const SHAPES = ['🦁', '🐼', '🐸', '🐙'];
const SUDOKU_BOARDS = [
  [
    [1, 2, 3, 4],
    [3, 4, 1, 2],
    [2, 1, 4, 3],
    [4, 3, 2, 1]
  ],
  [
    [4, 3, 2, 1],
    [2, 1, 4, 3],
    [3, 4, 1, 2],
    [1, 2, 3, 4]
  ],
  [
    [2, 4, 1, 3],
    [1, 3, 4, 2],
    [4, 2, 3, 1],
    [3, 1, 2, 4]
  ],
  [
    [3, 1, 4, 2],
    [4, 2, 3, 1],
    [1, 3, 2, 4],
    [2, 4, 1, 3]
  ]
];

const TOTAL_LEVELS = 20;

const getClueCount = (level) => Math.max(12 - Math.floor((level - 1) / 2), 6);

const createPRNG = (seed) => {
  let currentSeed = seed;
  return () => {
    let x = Math.sin(currentSeed++) * 10000;
    return x - Math.floor(x);
  };
};

const createPuzzleData = (level) => {
  const prng = createPRNG(level * 100);
  const template = SUDOKU_BOARDS[Math.floor(prng() * SUDOKU_BOARDS.length)];
  const shuffledShapes = [...SHAPES].sort(() => prng() - 0.5);
  const shapeMapping = {
    1: shuffledShapes[0],
    2: shuffledShapes[1],
    3: shuffledShapes[2],
    4: shuffledShapes[3]
  };

  const solution = template.map((row) => row.map((val) => shapeMapping[val]));
  const play = solution.map((row) => row.map((val) => ({ value: val, isClue: true })));

  const clueCount = getClueCount(level);
  let clearedCount = 0;
  while (clearedCount < 16 - clueCount) {
    const r = Math.floor(prng() * 4);
    const c = Math.floor(prng() * 4);
    if (play[r][c].isClue) {
      play[r][c] = { value: null, isClue: false };
      clearedCount++;
    }
  }

  return play;
};

const checkSudokuRules = (grid) => {
  for (let r = 0; r < 4; r++) {
    const rowSet = new Set(grid[r]);
    if (rowSet.size !== 4 || rowSet.has(null)) return false;
  }
  for (let c = 0; c < 4; c++) {
    const colSet = new Set();
    for (let r = 0; r < 4; r++) colSet.add(grid[r][c]);
    if (colSet.size !== 4 || colSet.has(null)) return false;
  }
  const quads = [
    [[0, 0], [0, 1], [1, 0], [1, 1]],
    [[0, 2], [0, 3], [1, 2], [1, 3]],
    [[2, 0], [2, 1], [3, 0], [3, 1]],
    [[2, 2], [2, 3], [3, 2], [3, 3]]
  ];
  for (const q of quads) {
    const quadSet = new Set();
    for (const [r, c] of q) quadSet.add(grid[r][c]);
    if (quadSet.size !== 4 || quadSet.has(null)) return false;
  }
  return true;
};

const getConflicts = (grid) => {
  const conflictCells = [];
  for (let r = 0; r < 4; r++) {
    for (let c1 = 0; c1 < 4; c1++) {
      for (let c2 = c1 + 1; c2 < 4; c2++) {
        if (grid[r][c1] && grid[r][c1] === grid[r][c2]) {
          conflictCells.push(`${r}-${c1}`, `${r}-${c2}`);
        }
      }
    }
  }
  for (let c = 0; c < 4; c++) {
    for (let r1 = 0; r1 < 4; r1++) {
      for (let r2 = r1 + 1; r2 < 4; r2++) {
        if (grid[r1][c] && grid[r1][c] === grid[r2][c]) {
          conflictCells.push(`${r1}-${c}`, `${r2}-${c}`);
        }
      }
    }
  }
  const quads = [
    [[0, 0], [0, 1], [1, 0], [1, 1]],
    [[0, 2], [0, 3], [1, 2], [1, 3]],
    [[2, 0], [2, 1], [3, 0], [3, 1]],
    [[2, 2], [2, 3], [3, 2], [3, 3]]
  ];
  for (const q of quads) {
    for (let i = 0; i < 4; i++) {
      for (let j = i + 1; j < 4; j++) {
        const [r1, c1] = q[i];
        const [r2, c2] = q[j];
        if (grid[r1][c1] && grid[r1][c1] === grid[r2][c2]) {
          conflictCells.push(`${r1}-${c1}`, `${r2}-${c2}`);
        }
      }
    }
  }
  return Array.from(new Set(conflictCells));
};

const ShapeSudoku = ({ onBack }) => {
  const [level, setLevel] = useState(1);
  const [playGrid, setPlayGrid] = useState(() => createPuzzleData(1));
  const [selectedShape, setSelectedShape] = useState(SHAPES[0]);
  const [isSolved, setIsSolved] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [errors, setErrors] = useState([]);
  const [message, setMessage] = useState('Place shapes so each row, column, and square is unique.');

  const loadLevel = (nextLevel) => {
    if (nextLevel > TOTAL_LEVELS) {
      setGameWon(true);
      return;
    }
    setLevel(nextLevel);
    setPlayGrid(createPuzzleData(nextLevel));
    setIsSolved(false);
    setErrors([]);
    setMessage(`Level ${nextLevel}: ${getClueCount(nextLevel)} clues remain.`);
  };

  const resetGame = () => {
    setGameWon(false);
    loadLevel(1);
  };

  const getQuadClass = (r, c) => {
    if (r < 2 && c < 2) return 'quad-a';
    if (r < 2 && c >= 2) return 'quad-b';
    if (r >= 2 && c < 2) return 'quad-c';
    return 'quad-d';
  };

  const handleCellClick = (r, c) => {
    if (isSolved || gameWon || playGrid[r][c].isClue) return;

    playSound('pop');
    const newGrid = playGrid.map((row, rowIdx) =>
      row.map((cell, colIdx) => {
        if (rowIdx === r && colIdx === c) {
          const newValue = cell.value === selectedShape ? null : selectedShape;
          return { ...cell, value: newValue };
        }
        return cell;
      })
    );

    setPlayGrid(newGrid);
    checkBoardState(newGrid);
  };

  const checkBoardState = (grid) => {
    const flatGrid = grid.flat();
    const hasEmpty = flatGrid.some((cell) => cell.value === null);

    if (!hasEmpty) {
      const stringGrid = grid.map((row) => row.map((cell) => cell.value));
      const isValid = checkSudokuRules(stringGrid);
      if (isValid) {
        playSound('match');
        setIsSolved(true);
        setErrors([]);
        if (level === TOTAL_LEVELS) {
          setTimeout(() => {
            playSound('celebrate');
            setGameWon(true);
          }, 700);
        } else {
          setTimeout(() => {
            playSound('celebrate');
            loadLevel(level + 1);
          }, 900);
        }
      } else {
        playSound('wrong');
        const conflictCells = getConflicts(stringGrid);
        setErrors(conflictCells);
        setMessage('Oops! Fix the repeating shapes.');
      }
    } else {
      setErrors([]);
    }
  };

  return (
    <div className="game-view pop-in">
      {gameWon ? (
        <div className="champion-screen">
          <div style={{ fontSize: '4rem' }}>🏆</div>
          <h2>Sudoku Solver!</h2>
          <p>You completed all 20 shape Sudoku levels.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <button className="btn btn-primary" onClick={resetGame}>Play Again</button>
            <button className="btn" style={{ background: '#eee' }} onClick={() => { if (typeof onBack === 'function') onBack(); }}>Main Menu</button>
          </div>
        </div>
      ) : (
        <>
          <div className="game-header">
            <div>Shape Sudoku</div>
            <div>Level {level} / {TOTAL_LEVELS}</div>
            <div>Clues: {getClueCount(level)}</div>
            <div className="progress-container">
              <div className="progress-bar" style={{ width: `${(level / TOTAL_LEVELS) * 100}%` }} />
            </div>
          </div>

          <p style={{ textAlign: 'center', margin: '-0.5rem 0 1rem', color: '#666' }}>{message}</p>

          <div className="sudoku-board-container">
            <div className="sudoku-grid">
              {playGrid.map((row, rIdx) =>
                row.map((cell, cIdx) => {
                  const key = `${rIdx}-${cIdx}`;
                  const hasError = errors.includes(key);
                  return (
                    <div
                      key={key}
                      className={`sudoku-cell ${getQuadClass(rIdx, cIdx)} ${cell.isClue ? 'clue' : ''} ${hasError ? 'shake' : ''}`}
                      onClick={() => handleCellClick(rIdx, cIdx)}
                      style={{
                        border: hasError ? '3px solid var(--color-secondary)' : 'none',
                        color: hasError ? 'var(--color-secondary)' : 'inherit'
                      }}
                    >
                      {cell.value}
                    </div>
                  );
                })
              )}
            </div>

            <div className="sudoku-shelf">
              {SHAPES.map((shape) => (
                <div
                  key={shape}
                  className={`sudoku-shelf-item ${selectedShape === shape ? 'active' : ''}`}
                  onClick={() => {
                    playSound('pop');
                    setSelectedShape(shape);
                  }}
                >
                  {shape}
                </div>
              ))}
            </div>

            {errors.length > 0 && (
              <div style={{ marginTop: '1.5rem' }}>
                <p style={{ color: 'var(--color-secondary)', fontWeight: 'bold' }}>
                  Oops! Some shapes are repeating. Try fixing them! ❌
                </p>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
            <button className="btn" style={{ background: '#eee' }} onClick={() => loadLevel(level)}>
              🔄 Restart Level
            </button>
            <button className="btn btn-primary" onClick={() => { if (typeof onBack === 'function') onBack(); }}>Main Menu</button>
          </div>
        </>
      )}
    </div>
  );
};

export default ShapeSudoku;
