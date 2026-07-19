import { useMemo, useState } from 'react';
import { playSound } from '../../utils/sounds';
import { TOTAL_LEVELS, getShapeFitLevel, getThemeForLevel } from './puzzle-utils';

const ShapeFitPuzzle = ({ puzzle, onBack }) => {
  const [level, setLevel] = useState(1);
  const [gameWon, setGameWon] = useState(false);
  const [allLevelsComplete, setAllLevelsComplete] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [placed, setPlaced] = useState([]);
  const [feedback, setFeedback] = useState('Choose a shape and place it in the matching slot.');
  const theme = useMemo(() => getThemeForLevel(level), [level]);
  const shapes = useMemo(() => getShapeFitLevel(level), [level]);

  const loadLevel = (nextLevel) => {
    setLevel(nextLevel);
    setPlaced([]);
    setSelectedId(null);
    setFeedback('Choose a shape and place it in the matching slot.');
  };

  const handlePlace = (slotId) => {
    if (!selectedId) return;

    const selectedShape = shapes.order.find((shape) => shape.id === selectedId);
    if (!selectedShape) return;

    if (slotId === selectedShape.id) {
      playSound('match');
      const nextPlaced = [...placed, selectedShape.id];
      setPlaced(nextPlaced);
      setSelectedId(null);
      setFeedback('Perfect fit!');

      if (nextPlaced.length === shapes.pool.length) {
        if (level >= TOTAL_LEVELS) {
          playSound('celebrate');
          setAllLevelsComplete(true);
          setGameWon(true);
          setFeedback('You matched every shape!');
          return;
        }

        setTimeout(() => {
          playSound('celebrate');
          loadLevel(level + 1);
        }, 700);
      }
    } else {
      playSound('wrong');
      setFeedback('That slot needs a different shape. Try again!');
    }
  };

  return (
    <div className="game-view pop-in">
      <div className="game-header">
        <div>{puzzle.title}</div>
        <div>Level {level} / {TOTAL_LEVELS}</div>
        <div>{placed.length} matched</div>
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${(level / TOTAL_LEVELS) * 100}%` }} />
        </div>
      </div>

      {gameWon ? (
        <div className="champion-screen">
          <div style={{ fontSize: '4rem' }}>{puzzle.completionEmoji}</div>
          <h2>{allLevelsComplete ? 'Shape Star!' : 'Level Complete!'}</h2>
          <p>{puzzle.completionMessage}</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={() => { setGameWon(false); setAllLevelsComplete(false); loadLevel(1); }}>
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

          <div className="shape-fit-board">
            <div className="shape-fit-side">
              <h3 className="shape-fit-side-title">Pick a Shape</h3>
              <div className="shape-fit-options">
                {shapes.order.map((shape) => (
                  <button
                    key={shape.id}
                    type="button"
                    className={`shape-fit-option${selectedId === shape.id ? ' selected' : ''}${placed.includes(shape.id) ? ' done' : ''}`}
                    onClick={() => {
                      if (placed.includes(shape.id)) return;
                      setSelectedId(shape.id);
                      setFeedback(`You chose ${shape.label}. Now place it in the matching slot.`);
                    }}
                  >
                    <span>{shape.emoji}</span>
                    <span>{shape.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="shape-fit-side">
              <h3 className="shape-fit-side-title">Place It Here</h3>
              <div className="shape-fit-slots">
                {shapes.pool.map((slot) => (
                  <button
                    key={slot.id}
                    type="button"
                    className={`shape-fit-slot${placed.includes(slot.id) ? ' filled' : ''}`}
                    onClick={() => handlePlace(slot.id)}
                  >
                    <span>{slot.emoji}</span>
                    <span>{slot.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button className="btn btn-back" onClick={() => { if (typeof onBack === 'function') onBack(); }}>Main Menu</button>
          </div>
        </>
      )}
    </div>
  );
};

export default ShapeFitPuzzle;
