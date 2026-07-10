import { useMemo, useState } from 'react';
import { playSound } from '../../utils/sounds';
import { TOTAL_LEVELS, getSpotDifferenceScene, getThemeForLevel } from './puzzle-utils';

const SpotDifferencePuzzle = ({ puzzle, onBack }) => {
  const [level, setLevel] = useState(1);
  const [gameWon, setGameWon] = useState(false);
  const [allLevelsComplete, setAllLevelsComplete] = useState(false);
  const [found, setFound] = useState([]);
  const [feedback, setFeedback] = useState('Tap the changed spots in the right picture.');
  const theme = useMemo(() => getThemeForLevel(level), [level]);
  const scene = useMemo(() => getSpotDifferenceScene(level), [level]);

  const loadLevel = (nextLevel) => {
    setLevel(nextLevel);
    setFound([]);
    setFeedback('Tap the changed spots in the right picture.');
  };

  const handleSpot = (item) => {
    if (found.includes(item.id)) return;

    if (item.isDiff) {
      playSound('match');
      const nextFound = [...found, item.id];
      setFound(nextFound);
      if (nextFound.length === 3) {
        if (level >= TOTAL_LEVELS) {
          playSound('celebrate');
          setAllLevelsComplete(true);
          setGameWon(true);
          setFeedback('You found every difference!');
          return;
        }

        setFeedback('Amazing spotting! Next level is ready!');
        setTimeout(() => {
          playSound('celebrate');
          loadLevel(level + 1);
        }, 700);
      } else {
        setFeedback('You found one! Keep spotting.');
      }
    } else {
      playSound('wrong');
      setFeedback('That one looks the same. Try another spot!');
    }
  };

  return (
    <div className="game-view pop-in">
      <div className="game-header">
        <div>{puzzle.title}</div>
        <div>Level {level} / {TOTAL_LEVELS}</div>
        <div>{found.length} found</div>
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${(level / TOTAL_LEVELS) * 100}%` }} />
        </div>
      </div>

      {gameWon ? (
        <div className="champion-screen">
          <div style={{ fontSize: '4rem' }}>{puzzle.completionEmoji}</div>
          <h2>{allLevelsComplete ? 'Spotter Superstar!' : 'Level Complete!'}</h2>
          <p>{puzzle.completionMessage}</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={() => { setGameWon(false); setAllLevelsComplete(false); loadLevel(1); }}>
              Play Again
            </button>
            <button className="btn" style={{ background: '#eee', color: '#333' }} onClick={() => { if (typeof onBack === 'function') onBack(); }}>
              Main Menu
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="puzzle-feedback" style={{ background: theme.gradient, color: 'white' }}>
            {feedback}
          </div>

          <div className="spot-difference-board">
            <div className="spot-scene">
              <h3>Left Picture</h3>
              <div className="spot-scene-inner">
                {scene.left.map((item) => (
                  <div key={`left-${item.id}`} className="spot-item" style={{ left: `${item.x}%`, top: `${item.y}%` }}>
                    {item.emoji}
                  </div>
                ))}
              </div>
            </div>
            <div className="spot-scene">
              <h3>Right Picture</h3>
              <div className="spot-scene-inner">
                {scene.right.map((item) => (
                  <button
                    key={`right-${item.id}`}
                    type="button"
                    className={`spot-item ${found.includes(item.id) ? 'found' : ''}`}
                    style={{ left: `${item.x}%`, top: `${item.y}%` }}
                    onClick={() => handleSpot(item)}
                  >
                    {item.emoji}
                  </button>
                ))}
              </div>
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

export default SpotDifferencePuzzle;
