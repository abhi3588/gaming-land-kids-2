import { useState } from 'react';
import { playSound } from '../../utils/sounds';
import { TOTAL_LEVELS, getColorSortLevel, getThemeForLevel } from './puzzle-utils';

const topColor = (tube) => (tube.length ? tube[tube.length - 1] : null);

const isSolved = (tubes) => {
  const nonEmpty = tubes.filter((t) => t.length > 0);
  const uniform = nonEmpty.every((t) => t.every((c) => c === t[0]));
  const distinct = new Set(nonEmpty.map((t) => t[0])).size === nonEmpty.length;
  return uniform && distinct;
};

// Move as many consecutive same-colour balls as fit from the top of src to dst.
const pour = (src, dst, capacity) => {
  const color = topColor(src);
  let moved = 0;
  while (src.length && src[src.length - 1] === color && dst.length < capacity) {
    dst.push(src.pop());
    moved += 1;
  }
  return moved;
};

const ColorSortPuzzle = ({ puzzle, onBack }) => {
  const [level, setLevel] = useState(1);
  const [gameWon, setGameWon] = useState(false);
  const [tubes, setTubes] = useState(() => getColorSortLevel(1).tubes.map((t) => [...t]));
  const [colors, setColors] = useState(() => getColorSortLevel(1).colors);
  const [capacity, setCapacity] = useState(() => getColorSortLevel(1).capacity);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState('Tap a tube, then tap another to pour!');

  const loadLevel = (nextLevel) => {
    const data = getColorSortLevel(nextLevel);
    setLevel(nextLevel);
    setTubes(data.tubes.map((t) => [...t]));
    setColors(data.colors);
    setCapacity(data.capacity);
    setSelected(null);
    setFeedback('Tap a tube, then tap another to pour!');
  };

  const sortedCount = tubes.filter((t) => t.length > 0 && t.every((c) => c === t[0])).length;

  const handleTubeClick = (index) => {
    if (gameWon) return;
    setFeedback('');

    if (selected === null) {
      if (tubes[index].length === 0) {
        setFeedback('Pick a tube that has balls!');
        return;
      }
      setSelected(index);
      return;
    }

    if (index === selected) {
      setSelected(null);
      return;
    }

    const src = tubes[selected];
    const dst = tubes[index];
    if (
      src.length === 0 ||
      dst.length >= capacity ||
      (dst.length > 0 && topColor(dst) !== topColor(src))
    ) {
      playSound('wrong');
      setFeedback('Those colours don’t match — try another tube!');
      setSelected(null);
      return;
    }

    const next = tubes.map((t) => [...t]);
    const moved = pour(next[selected], next[index], capacity);
    if (moved > 0) {
      playSound('match');
      setTubes(next);
      setSelected(null);
      if (isSolved(next)) {
        if (level >= TOTAL_LEVELS) {
          playSound('celebrate');
          setGameWon(true);
        } else {
          setTimeout(() => {
            playSound('celebrate');
            loadLevel(level + 1);
          }, 650);
        }
      }
    } else {
      playSound('wrong');
      setSelected(null);
    }
  };

  return (
    <div className="game-view pop-in">
      <div className="game-header">
        <div>{puzzle.title}</div>
        <div>Level {level} / {TOTAL_LEVELS}</div>
        <div>{sortedCount} sorted</div>
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${(level / TOTAL_LEVELS) * 100}%` }} />
        </div>
      </div>

      {gameWon ? (
        <div className="champion-screen">
          <div style={{ fontSize: '4rem' }}>{puzzle.completionEmoji}</div>
          <h2>Color Champion!</h2>
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

          <div className="color-sort-board">
            {tubes.map((tube, i) => (
              <button
                key={i}
                type="button"
                className={`color-sort-tube${selected === i ? ' selected' : ''}`}
                onClick={() => handleTubeClick(i)}
                aria-label={`Tube ${i + 1}`}
              >
                {tube.map((cIdx, j) => (
                  <span key={j} className="color-sort-ball" style={{ background: colors[cIdx] }} />
                ))}
              </button>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button className="btn btn-back" onClick={() => { if (typeof onBack === 'function') onBack(); }}>Main Menu</button>
          </div>
        </>
      )}
    </div>
  );
};

export default ColorSortPuzzle;
