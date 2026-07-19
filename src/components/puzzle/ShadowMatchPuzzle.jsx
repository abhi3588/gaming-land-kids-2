import { useState } from 'react';
import { playSound } from '../../utils/sounds';
import { TOTAL_LEVELS, getShadowMatchLevel } from './puzzle-utils';

const ShadowMatchPuzzle = ({ puzzle, onBack }) => {
  const [level, setLevel] = useState(1);
  const [data, setData] = useState(() => getShadowMatchLevel(1));
  const [selectedId, setSelectedId] = useState(null);
  const [matched, setMatched] = useState([]);
  const [feedback, setFeedback] = useState('Tap a colourful toy, then tap its dark shadow!');
  const [gameWon, setGameWon] = useState(false);
  const [allLevelsComplete, setAllLevelsComplete] = useState(false);

  const loadLevel = (nextLevel) => {
    const nd = getShadowMatchLevel(nextLevel);
    setLevel(nextLevel);
    setData(nd);
    setMatched([]);
    setSelectedId(null);
    setFeedback('Tap a colourful toy, then tap its dark shadow!');
  };

  const handleEmojiClick = (id) => {
    if (matched.includes(id)) return;
    playSound('pop');
    setSelectedId(id);
    setFeedback('Now find the matching shadow on the right!');
  };

  const handleShadowClick = (shadowItem) => {
    if (matched.includes(shadowItem.id) || !selectedId) return;

    if (selectedId === shadowItem.id) {
      playSound('match');
      const nextMatched = [...matched, shadowItem.id];
      setMatched(nextMatched);
      setSelectedId(null);
      setFeedback('Perfect match! 🌟');

      if (nextMatched.length === data.items.length) {
        if (level >= TOTAL_LEVELS) {
          playSound('celebrate');
          setAllLevelsComplete(true);
          setGameWon(true);
        } else {
          setTimeout(() => {
            playSound('celebrate');
            loadLevel(level + 1);
          }, 900);
        }
      }
    } else {
      playSound('wrong');
      setSelectedId(null);
      setFeedback('That shadow belongs to a different toy. Try again!');
    }
  };

  const handleReset = () => {
    playSound('pop');
    setGameWon(false);
    setAllLevelsComplete(false);
    loadLevel(1);
  };

  return (
    <div className="game-view pop-in">
      <div className="game-header">
        <div>{puzzle.title}</div>
        <div>Level {level} / {TOTAL_LEVELS}</div>
        <div>{matched.length} matched</div>
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${(level / TOTAL_LEVELS) * 100}%` }} />
        </div>
      </div>

      {gameWon ? (
        <div className="champion-screen">
          <div style={{ fontSize: '4rem' }}>{puzzle.completionEmoji}</div>
          <h2>{allLevelsComplete ? 'Shadow Star!' : 'Level Complete!'}</h2>
          <p>{puzzle.completionMessage}</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={handleReset}>
              Play Again
            </button>
            <button className="btn btn-back" onClick={() => { if (typeof onBack === 'function') onBack(); }}>Main Menu</button>
          </div>
        </div>
      ) : (
        <>
          <div style={{
            textAlign: 'center',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            color: feedback.startsWith('Perfect') ? 'var(--candy-green)' : '#666',
            background: feedback.startsWith('Perfect') ? 'rgba(29,209,161,0.1)' : 'rgba(108, 92, 231, 0.08)',
            padding: '0.75rem 1rem',
            borderRadius: '14px',
            maxWidth: '520px',
            margin: '0 auto 1.5rem'
          }}>
            {feedback}
          </div>

          <div className="shape-fit-board">
            {/* Colourful toys */}
            <div className="shape-fit-side">
              <h3 className="shape-fit-side-title">Colourful Toys</h3>
              <div className="shape-fit-options">
                {data.items.map((item) => {
                  const isMatched = matched.includes(item.id);
                  const classes =
                    'shape-fit-option' +
                    (selectedId === item.id ? ' selected' : '') +
                    (isMatched ? ' done' : '');
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={classes}
                      onClick={() => handleEmojiClick(item.id)}
                    >
                      <span>{item.emoji}</span>
                      <span>{item.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dark shadows to match */}
            <div className="shape-fit-side">
              <h3 className="shape-fit-side-title">Match the Shadow</h3>
              <div className="shape-fit-slots">
                {data.shadows.map((shadowItem) => {
                  const isMatched = matched.includes(shadowItem.id);
                  return (
                    <button
                      key={shadowItem.id}
                      type="button"
                      className={`shape-fit-slot${isMatched ? ' filled' : ''}`}
                      onClick={() => handleShadowClick(shadowItem)}
                    >
                      <span style={{
                        filter: isMatched ? 'none' : 'brightness(0)',
                        opacity: isMatched ? 1 : 0.55
                      }}>
                        {shadowItem.emoji}
                      </span>
                    </button>
                  );
                })}
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

export default ShadowMatchPuzzle;
