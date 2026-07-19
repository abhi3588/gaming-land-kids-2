import { useState } from 'react';
import { playSound } from '../../utils/sounds';
import {
  TOTAL_LEVELS,
  getPipeConnectorLevel,
  getPipeFilled,
  getPipeOpenDirs,
  getThemeForLevel,
} from './puzzle-utils';

// Edge midpoints for each direction (0=N, 1=E, 2=S, 3=W) on a 100x100 viewBox.
const DIR_COORDS = {
  0: [50, 2],
  1: [98, 50],
  2: [50, 98],
  3: [2, 50],
};

const PipeSvg = ({ cell }) => {
  const open = getPipeOpenDirs(cell);
  return (
    <svg viewBox="0 0 100 100" className="pipe-svg" aria-hidden="true">
      {open.map((d) => (
        <line
          key={d}
          className="pipe-line"
          x1="50"
          y1="50"
          x2={DIR_COORDS[d][0]}
          y2={DIR_COORDS[d][1]}
          strokeWidth="20"
          strokeLinecap="round"
        />
      ))}
      <circle className="pipe-hub" cx="50" cy="50" r="15" />
    </svg>
  );
};

const PipeConnectorPuzzle = ({ puzzle, onBack }) => {
  const initial = getPipeConnectorLevel(1);
  const [level, setLevel] = useState(1);
  const [gameWon, setGameWon] = useState(false);
  const [data, setData] = useState(initial);
  const [board, setBoard] = useState(() => initial.board.map((row) => row.map((c) => ({ ...c }))));
  const [feedback, setFeedback] = useState('Tap the pipes to rotate them and lead water to the flower!');

  const filled = getPipeFilled(board, data.start);
  const isWon = filled.has(`${data.end[0]},${data.end[1]}`);

  const loadLevel = (nextLevel) => {
    const nd = getPipeConnectorLevel(nextLevel);
    setData(nd);
    setBoard(nd.board.map((row) => row.map((c) => ({ ...c }))));
    setLevel(nextLevel);
    setFeedback('Tap the pipes to rotate them and lead water to the flower!');
  };

  const handleRotate = (r, c) => {
    if (gameWon) return;
    const next = board.map((row) => row.map((cell) => ({ ...cell })));
    next[r][c].rot = (next[r][c].rot + 1) % 4;
    setBoard(next);
    playSound('pop');

    const newFilled = getPipeFilled(next, data.start);
    if (newFilled.has(`${data.end[0]},${data.end[1]}`)) {
      if (level >= TOTAL_LEVELS) {
        playSound('celebrate');
        setGameWon(true);
      } else {
        setFeedback('Water flows! On to the next garden! 💧');
        setTimeout(() => {
          playSound('celebrate');
          loadLevel(level + 1);
        }, 700);
      }
    } else {
      setFeedback('Keep rotating until the water reaches the flower! 🌸');
    }
  };

  return (
    <div className="game-view pop-in">
      <div className="game-header">
        <div>{puzzle.title}</div>
        <div>Level {level} / {TOTAL_LEVELS}</div>
        <div>{isWon ? 'Flowing!' : 'Rotating…'}</div>
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${(level / TOTAL_LEVELS) * 100}%` }} />
        </div>
      </div>

      {gameWon ? (
        <div className="champion-screen">
          <div style={{ fontSize: '4rem' }}>{puzzle.completionEmoji}</div>
          <h2>Plumbing Pro!</h2>
          <p>{puzzle.completionMessage}</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
            <button className="btn btn-primary" onClick={() => { setGameWon(false); loadLevel(1); }}>
              Play Again
            </button>
            <button className="btn btn-back" onClick={() => { if (typeof onBack === 'function') onBack(); }}>Main Menu</button>
          </div>
        </div>
      ) : (
        <>
          <div className="puzzle-feedback" style={{ background: getThemeForLevel(level).gradient, color: 'white' }}>
            {feedback}
          </div>

          <div
            className="pipe-board"
            style={{ gridTemplateColumns: `repeat(${data.size}, 1fr)` }}
            role="grid"
            aria-label="Pipe grid"
          >
            {board.map((row, r) => row.map((cell, c) => {
              const key = `${r},${c}`;
              const isFilled = filled.has(key);
              const isStart = data.start[0] === r && data.start[1] === c;
              const isEnd = data.end[0] === r && data.end[1] === c;
              return (
                <button
                  key={key}
                  type="button"
                  role="gridcell"
                  className={`pipe-cell${isFilled ? ' filled' : ''}`}
                  onClick={() => handleRotate(r, c)}
                  aria-label={`Rotate pipe ${r + 1}, ${c + 1}`}
                >
                  <PipeSvg cell={cell} />
                  {isStart && <span className="pipe-marker start" aria-hidden="true">💧</span>}
                  {isEnd && <span className="pipe-marker end" aria-hidden="true">🌸</span>}
                </button>
              );
            }))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button className="btn btn-back" onClick={() => { if (typeof onBack === 'function') onBack(); }}>Main Menu</button>
          </div>
        </>
      )}
    </div>
  );
};

export default PipeConnectorPuzzle;
