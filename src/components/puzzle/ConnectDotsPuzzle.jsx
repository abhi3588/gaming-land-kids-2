import { useMemo, useState } from 'react';
import { playSound } from '../../utils/sounds';
import {
  TOTAL_LEVELS,
  getConnectDotLayout,
  getThemeForLevel,
} from './puzzle-utils';

const ConnectDotsPuzzle = ({ puzzle, onBack }) => {
  const [level, setLevel] = useState(1);
  const [gameWon, setGameWon] = useState(false);
  const [allLevelsComplete, setAllLevelsComplete] = useState(false);
  const [nextDot, setNextDot] = useState(1);
  const [connected, setConnected] = useState([]);
  const [shakeDotId, setShakeDotId] = useState(null);
  const theme = useMemo(() => getThemeForLevel(level), [level]);
  const dots = useMemo(() => getConnectDotLayout(level), [level]);

  const loadLevel = (nextLevel) => {
    setLevel(nextLevel);
    setNextDot(1);
    setConnected([]);
    setShakeDotId(null);
  };

  const handleDotClick = (dot) => {
    if (connected.includes(dot.id)) return;

    if (dot.id === nextDot) {
      playSound('match');
      const nextConnected = [...connected, dot.id];
      setConnected(nextConnected);
      setNextDot(nextDot + 1);

      if (nextConnected.length === dots.length) {
        if (level >= TOTAL_LEVELS) {
          playSound('celebrate');
          setAllLevelsComplete(true);
          setGameWon(true);
          return;
        }
        setTimeout(() => {
          playSound('celebrate');
          loadLevel(level + 1);
        }, 900);
      }
      return;
    }

    playSound('wrong');
    setShakeDotId(dot.id);
    setTimeout(() => setShakeDotId(null), 400);
  };

  const lines = connected.slice(1).map((dotId, index) => {
    const from = dots.find((dot) => dot.id === connected[index]);
    const to = dots.find((dot) => dot.id === dotId);
    if (!from || !to) return null;

    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    return (
      <div
        key={`${from.id}-${to.id}`}
        className="dot-line"
        style={{
          left: `${from.x}%`,
          top: `${from.y}%`,
          width: `${length}%`,
          transform: `rotate(${angle}deg)`,
        }}
      />
    );
  });

  const revealComplete = connected.length === dots.length;

  return (
    <div className="game-view pop-in">
      <div className="game-header">
        <div>{puzzle.title}</div>
        <div>Level {level} / {TOTAL_LEVELS}</div>
        <div>Next dot: {Math.min(nextDot, dots.length)}</div>
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${(level / TOTAL_LEVELS) * 100}%` }} />
        </div>
      </div>

      {gameWon ? (
        <div className="champion-screen">
          <div style={{ fontSize: '4rem' }}>{puzzle.completionEmoji}</div>
          <h2>{allLevelsComplete ? 'Dot Connector Champion!' : 'Level Complete!'}</h2>
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
            Tap dot number {nextDot} to connect the picture!
          </div>

          <div className="connect-dots-board" style={{ background: theme.gradient }}>
            {lines}
            {dots.map((dot) => (
              <button
                key={dot.id}
                type="button"
                className={`dot-node${connected.includes(dot.id) ? ' connected' : ''}${shakeDotId === dot.id ? ' shake' : ''}${dot.id === nextDot ? ' active' : ''}`}
                style={{ left: `${dot.x}%`, top: `${dot.y}%` }}
                onClick={() => handleDotClick(dot)}
                aria-label={`Dot ${dot.id}`}
              >
                {dot.id}
              </button>
            ))}

            {revealComplete && (
              <div className="connect-dots-reveal">
                <span>{theme.emoji}</span>
                <p>Surprise!</p>
              </div>
            )}
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

export default ConnectDotsPuzzle;
