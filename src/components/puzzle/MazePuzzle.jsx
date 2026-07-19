import { useMemo, useState } from 'react';
import { playSound } from '../../utils/sounds';
import { TOTAL_LEVELS, generateMaze, getThemeForLevel } from './puzzle-utils';

const MazePuzzle = ({ puzzle, onBack }) => {
  const [level, setLevel] = useState(1);
  const [gameWon, setGameWon] = useState(false);
  const [allLevelsComplete, setAllLevelsComplete] = useState(false);
  const [position, setPosition] = useState([1, 1]);
  const [feedback, setFeedback] = useState('Find the treasure path through the maze.');
  const theme = useMemo(() => getThemeForLevel(level), [level]);
  const maze = useMemo(() => generateMaze(level), [level]);

  const loadLevel = (nextLevel) => {
    const nextMaze = generateMaze(nextLevel);
    setLevel(nextLevel);
    setPosition([...nextMaze.start]);
    setFeedback('Find the treasure path through the maze.');
  };

  const tryMove = (row, col) => {
    if (gameWon) return;

    const [currentRow, currentCol] = position;
    const isAdjacent = Math.abs(row - currentRow) + Math.abs(col - currentCol) === 1;
    const isOpen = maze.grid[row]?.[col] !== 1;

    if (!isAdjacent || !isOpen) {
      playSound('wrong');
      setFeedback('That path is blocked. Try another turn!');
      return;
    }

    playSound('pop');
    setPosition([row, col]);

    if (row === maze.goal[0] && col === maze.goal[1]) {
      if (level >= TOTAL_LEVELS) {
        playSound('celebrate');
        setAllLevelsComplete(true);
        setGameWon(true);
        setFeedback('Treasure found! You cleared every maze!');
        return;
      }

      setFeedback('Treasure found! Onward to the next maze!');
      setTimeout(() => {
        playSound('celebrate');
        loadLevel(level + 1);
      }, 700);
    } else {
      setFeedback('Great move! Keep following the path.');
    }
  };

  const getCellClass = (row, col) => {
    if (row === maze.goal[0] && col === maze.goal[1]) return 'maze-cell goal';
    if (row === position[0] && col === position[1]) return 'maze-cell player';
    if (maze.grid[row][col] === 1) return 'maze-cell wall';
    if (row === maze.start[0] && col === maze.start[1]) return 'maze-cell start';
    return 'maze-cell path';
  };

  return (
    <div className="game-view pop-in">
      <div className="game-header">
        <div>{puzzle.title}</div>
        <div>Level {level} / {TOTAL_LEVELS}</div>
        <div>Find the exit</div>
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${(level / TOTAL_LEVELS) * 100}%` }} />
        </div>
      </div>

      {gameWon ? (
        <div className="champion-screen">
          <div style={{ fontSize: '4rem' }}>{puzzle.completionEmoji}</div>
          <h2>{allLevelsComplete ? 'Maze Master!' : 'Level Complete!'}</h2>
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
            <button className="btn btn-back" onClick={() => { if (typeof onBack === 'function') onBack(); }}>Main Menu</button>
          </div>
        </div>
      ) : (
        <>
          <div className="puzzle-feedback" style={{ background: theme.gradient, color: 'white' }}>
            {feedback}
          </div>

          <div className="maze-grid" style={{ gridTemplateColumns: `repeat(${maze.grid[0].length}, 1fr)` }}>
            {maze.grid.flatMap((row, rowIndex) => row.map((cell, colIndex) => (
              <button
                key={`${rowIndex}-${colIndex}`}
                type="button"
                className={`${getCellClass(rowIndex, colIndex)} flex-center`}
                onClick={() => tryMove(rowIndex, colIndex)}
                aria-label={`Maze cell row ${rowIndex + 1} column ${colIndex + 1}`}
              >
                {rowIndex === maze.goal[0] && colIndex === maze.goal[1]
                  ? '🎁'
                  : rowIndex === position[0] && colIndex === position[1]
                    ? '🧒'
                    : rowIndex === maze.start[0] && colIndex === maze.start[1]
                      ? '🚩'
                      : ''}
              </button>
            )))}
          </div>

          <div className="maze-legend">
            <span><i className="maze-chip start" /> Start</span>
            <span><i className="maze-chip player" /> You</span>
            <span><i className="maze-chip goal" /> Goal</span>
            <span><i className="maze-chip path" /> Path</span>
            <span><i className="maze-chip wall" /> Wall</span>
          </div>

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button className="btn btn-back" onClick={() => { if (typeof onBack === 'function') onBack(); }}>Main Menu</button>
          </div>
        </>
      )}
    </div>
  );
};

export default MazePuzzle;
