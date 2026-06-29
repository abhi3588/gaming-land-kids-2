import { useState, useCallback } from 'react';
import { playSound } from '../../utils/sounds';

const COLORS = [
  '#FF6B6B', // red
  '#FFD93D', // yellow
  '#6BCB77', // green
  '#4D96FF', // blue
  '#C77DFF', // purple
  '#FF9F1C', // orange
  '#F06292', '#4DD0E1', '#81C784', '#FFB74D',
  '#BA68C8', '#4DB6AC', '#E57373', '#64B5F6',
  '#FF8A65', '#9575CD', '#4FC3F7', '#AED581',
  '#FFD54F', '#7986CB'
];

const TOTAL_LEVELS = 20;

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

const buildRound = (level) => {
  const target = COLORS[level - 1];
  const availableDistractors = COLORS.filter(c => c !== target);
  const optionCount = Math.min(3 + Math.floor(level / 5), 6);
  const distractors = shuffle(availableDistractors).slice(0, optionCount - 1);
  const options = shuffle([target, ...distractors]);
  return { target, options };
};

const ColorMatch = ({ onBack }) => {
  const [level, setLevel] = useState(1);
  const [round, setRound] = useState(() => buildRound(1));
  const [feedback, setFeedback] = useState('Tap the matching color!');
  const [gameWon, setGameWon] = useState(false);

  const nextRound = useCallback((nextLevel) => {
    setRound(buildRound(nextLevel));
  }, []);

  const handlePick = (c) => {
    if (gameWon) return;

    if (c === round.target) {
      playSound('match');
      if (level === TOTAL_LEVELS) {
        setTimeout(() => {
          setGameWon(true);
        }, 300);
        return;
      }

      setFeedback('Nice! Level up!');
      setTimeout(() => {
        setLevel((prev) => {
          const nextLevel = prev + 1;
          nextRound(nextLevel);
          return nextLevel;
        });
        setFeedback('Tap the matching color!');
      }, 400);
    } else {
      playSound('wrong');
      setFeedback('Oops, try the other color.');
    }
  };

  return (
    <div className="game-view pop-in">
      {gameWon ? (
        <div className="champion-screen">
          <div style={{ fontSize: '4rem' }}>🏆</div>
          <h2>Color Champion!</h2>
          <p>You completed all 20 color matching levels.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <button className="btn btn-primary" onClick={() => {
              setLevel(1);
              setGameWon(false);
              setFeedback('Tap the matching color!');
              nextRound(1);
            }}>
              Play Again
            </button>
            <button className="btn" style={{ background: '#eee' }} onClick={() => { if (typeof onBack === 'function') onBack(); }}>
              Main Menu
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="game-header">
            <div>Color Match</div>
            <div>Level {level} / {TOTAL_LEVELS}</div>
            <div>Options: {round.options.length}</div>
            <div className="progress-container">
              <div className="progress-bar" style={{ width: `${(level / TOTAL_LEVELS) * 100}%` }} />
            </div>
          </div>

          <p style={{ textAlign: 'center', margin: '-0.5rem 0 1rem', color: '#666' }}>Tap the color that matches the target!</p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', margin: '1rem 0' }}>
            <div className="color-circle" style={{ background: round.target }} aria-hidden />
          </div>

          <div className="color-options">
            {round.options.map((c, i) => (
              <button
                key={i}
                className="btn color-option"
                style={{ background: c }}
                onClick={() => handlePick(c)}
              />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--color-accent)', fontWeight: 700 }}>
            {feedback}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button className="btn btn-primary" onClick={() => { if (typeof onBack === 'function') onBack(); }}>Main Menu</button>
          </div>
        </>
      )}
    </div>
  );
};

export default ColorMatch;
