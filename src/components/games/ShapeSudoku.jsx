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

// Helper functions defined outside the component for purity
const createPuzzleData = () => {
  const template = SUDOKU_BOARDS[Math.floor(Math.random() * SUDOKU_BOARDS.length)];
  const shuffledShapes = [...SHAPES].sort(() => Math.random() - 0.5);
  const shapeMapping = {
    1: shuffledShapes[0],
    2: shuffledShapes[1],
    3: shuffledShapes[2],
    4: shuffledShapes[3]
  };

  const solution = template.map(row => row.map(val => shapeMapping[val]));
  const play = solution.map(row => row.map(val => ({ value: val, isClue: true })));
  
  let clearedCount = 0;
  while (clearedCount < 8) {
    const r = Math.floor(Math.random() * 4);
    const c = Math.floor(Math.random() * 4);
    if (play[r][c].isClue) {
      play[r][c] = { value: null, isClue: false };
      clearedCount++;
    }
  }
  return play;
};

const checkSudokuRules = (grid) => {
  // Check rows
  for (let r = 0; r < 4; r++) {
    const rowSet = new Set(grid[r]);
    if (rowSet.size !== 4 || rowSet.has(null)) return false;
  }
  // Check columns
  for (let c = 0; c < 4; c++) {
    const colSet = new Set();
    for (let r = 0; r < 4; r++) colSet.add(grid[r][c]);
    if (colSet.size !== 4 || colSet.has(null)) return false;
  }
  // Check quadrants
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
  
  // Check rows for duplicates
  for (let r = 0; r < 4; r++) {
    for (let c1 = 0; c1 < 4; c1++) {
      for (let c2 = c1 + 1; c2 < 4; c2++) {
        if (grid[r][c1] && grid[r][c1] === grid[r][c2]) {
          conflictCells.push(`${r}-${c1}`, `${r}-${c2}`);
        }
      }
    }
  }

  // Check columns for duplicates
  for (let c = 0; c < 4; c++) {
    for (let r1 = 0; r1 < 4; r1++) {
      for (let r2 = r1 + 1; r2 < 4; r2++) {
        if (grid[r1][c] && grid[r1][c] === grid[r2][c]) {
          conflictCells.push(`${r1}-${c}`, `${r2}-${c}`);
        }
      }
    }
  }

  // Check quadrants for duplicates
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
  // Initialize grid synchronously
  const [playGrid, setPlayGrid] = useState(createPuzzleData);
  const [selectedShape, setSelectedShape] = useState(SHAPES[0]);
  const [isWon, setIsWon] = useState(false);
  const [errors, setErrors] = useState([]);

  const generatePuzzle = () => {
    setIsWon(false);
    setErrors([]);
    setPlayGrid(createPuzzleData());
  };

  // Determine quadrant for shading
  const getQuadClass = (r, c) => {
    if (r < 2 && c < 2) return 'quad-a';
    if (r < 2 && c >= 2) return 'quad-b';
    if (r >= 2 && c < 2) return 'quad-c';
    return 'quad-d';
  };

  const handleCellClick = (r, c) => {
    if (isWon || playGrid[r][c].isClue) return;

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
    const hasEmpty = flatGrid.some(cell => cell.value === null);

    if (!hasEmpty) {
      const stringGrid = grid.map(row => row.map(cell => cell.value));
      const isValid = checkSudokuRules(stringGrid);

      if (isValid) {
        playSound('match');
        setIsWon(true);
        setTimeout(() => {
          playSound('celebrate');
        }, 800);
      } else {
        playSound('wrong');
        const conflictCells = getConflicts(stringGrid);
        setErrors(conflictCells);
      }
    } else {
      setErrors([]);
    }
  };

  return (
    <div className="game-view pop-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2>Shape Sudoku</h2>
      <p style={{ textAlign: 'center', margin: '-0.5rem 0 1.5rem', color: '#666' }}>
        Place shapes so they don't repeat in any row, column, or 2x2 grid! 🧩
      </p>

      {playGrid.length > 0 && (
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
                      color: hasError ? 'var(--color-secondary)' : 'inherit',
                    }}
                  >
                    {cell.value}
                  </div>
                );
              })
            )}
          </div>

          {!isWon ? (
            <>
              <div className="sudoku-shelf">
                {SHAPES.map(shape => (
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
              
              <div style={{ marginTop: '1.5rem', minHeight: '24px' }}>
                {errors.length > 0 && (
                  <p style={{ color: 'var(--color-secondary)', fontWeight: 'bold' }}>
                    Oops! Some shapes are repeating. Try fixing them! ❌
                  </p>
                )}
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', marginTop: '2rem' }} className="pop-in">
              <h3 style={{ color: 'var(--color-success)', fontSize: '1.8rem', marginBottom: '1rem' }}>
                🎉 You Solved the Sudoku! 🎉
              </h3>
              <button className="btn btn-primary" onClick={generatePuzzle}>
                Play Again
              </button>
            </div>
          )}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
        {!isWon && (
          <button className="btn" style={{ background: '#eee' }} onClick={generatePuzzle}>
            🔄 Restart
          </button>
        )}
        <button className="btn btn-primary" onClick={onBack}>Main Menu</button>
      </div>
    </div>
  );
};

export default ShapeSudoku;
