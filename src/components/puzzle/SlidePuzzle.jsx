import { useMemo, useState } from 'react';
import { playSound } from '../../utils/sounds';
import {
  TOTAL_LEVELS,
  createSolvableSlideBoard,
  getPieceBackgroundStyle,
  getSlideSize,
  getThemeForLevel,
  isSlideSolved,
} from './puzzle-utils';

const SlidePuzzle = ({ puzzle, onBack }) => {
  const [level, setLevel] = useState(1);
  const [gameWon, setGameWon] = useState(false);
  const [allLevelsComplete, setAllLevelsComplete] = useState(false);
  const [moves, setMoves] = useState(0);
  const theme = useMemo(() => getThemeForLevel(level), [level]);
  const gridSize = getSlideSize(level);
  const [board, setBoard] = useState(() => createSolvableSlideBoard(1));

  const emptyIndex = board.indexOf(gridSize * gridSize - 1);

  const loadLevel = (nextLevel) => {
    setLevel(nextLevel);
    setBoard(createSolvableSlideBoard(nextLevel));
    setMoves(0);
  };

  const tryMove = (index) => {
    const size = gridSize;
    const emptyRow = Math.floor(emptyIndex / size);
    const emptyCol = emptyIndex % size;
    const row = Math.floor(index / size);
    const col = index % size;
    const isAdjacent = (
      (row === emptyRow && Math.abs(col - emptyCol) === 1)
      || (col === emptyCol && Math.abs(row - emptyRow) === 1)
    );

    if (!isAdjacent) return;

    playSound('pop');
    const nextBoard = [...board];
    nextBoard[emptyIndex] = nextBoard[index];
    nextBoard[index] = size * size - 1;
    setBoard(nextBoard);
    setMoves((count) => count + 1);

    if (isSlideSolved(nextBoard)) {
      if (level >= TOTAL_LEVELS) {
        playSound('celebrate');
        setAllLevelsComplete(true);
        setGameWon(true);
        return;
      }
      setTimeout(() => {
        playSound('celebrate');
        loadLevel(level + 1);
      }, 700);
    }
  };

  const renderTile = (value, index) => {
    if (value === gridSize * gridSize - 1) {
      return <div key={index} className="puzzle-cell puzzle-cell-empty" aria-hidden="true" />;
    }

    const row = Math.floor(value / gridSize);
    const col = value % gridSize;

    return (
      <button
        key={index}
        type="button"
        className="puzzle-cell puzzle-slide-tile"
        onClick={() => tryMove(index)}
        aria-label={`Slide tile ${value + 1}`}
      >
        <div
          className="puzzle-piece-content"
          style={getPieceBackgroundStyle(theme, row, col, gridSize)}
        />
      </button>
    );
  };

  return (
    <div className="game-view pop-in">
      <div className="game-header">
        <div>{puzzle.title}</div>
        <div>Level {level} / {TOTAL_LEVELS}</div>
        <div>{moves} moves</div>
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${(level / TOTAL_LEVELS) * 100}%` }} />
        </div>
      </div>

      {gameWon ? (
        <div className="champion-screen">
          <div style={{ fontSize: '4rem' }}>{puzzle.completionEmoji}</div>
          <h2>{allLevelsComplete ? 'Slide Puzzle Champion!' : 'Level Complete!'}</h2>
          <p>{puzzle.completionMessage}</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              className="btn btn-primary"
              onClick={() => {
                setGameWon(false);
                setAllLevelsComplete(false);
                loadLevel(1);
              }}
            >
              Play Again
            </button>
            <button className="btn" style={{ background: '#eee' }} onClick={() => { if (typeof onBack === 'function') onBack(); }}>
              Main Menu
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="puzzle-feedback">
            Tap a tile next to the empty space to slide it. Rebuild the {theme.emoji} picture!
          </div>

          <div className="puzzle-board-container">
            <div className="puzzle-preview" style={{ background: theme.gradient }} aria-hidden="true">
              <span>{theme.emoji}</span>
            </div>

            <div className={`puzzle-grid puzzle-grid-${gridSize}`}>
              {board.map((value, index) => renderTile(value, index))}
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button className="btn btn-primary" onClick={() => { if (typeof onBack === 'function') onBack(); }}>
              Main Menu
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SlidePuzzle;
