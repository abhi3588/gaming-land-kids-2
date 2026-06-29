import { useState, useCallback } from 'react';
import { playSound } from '../../utils/sounds';

const SHAPES = [
  { name: 'Circle',   emoji: '⭕', color: '#4D96FF' },
  { name: 'Triangle', emoji: '🔺', color: '#FF6B6B' },
  { name: 'Star',     emoji: '⭐', color: '#FFD93D' },
  { name: 'Heart',    emoji: '💜', color: '#C77DFF' },
  { name: 'Square',   emoji: '🟦', color: '#6BCB77' },
  { name: 'Diamond',  emoji: '🔷', color: '#4CC9F0' },
  { name: 'Moon',     emoji: '🌙', color: '#FF9F1C' },
  { name: 'Cloud',    emoji: '☁️', color: '#A0C4FF' },
  { name: 'Cross',    emoji: '➕', color: '#ff5252' },
  { name: 'Arrow',    emoji: '➡️', color: '#34ace0' },
  { name: 'Sun',      emoji: '☀️', color: '#ffb142' },
  { name: 'Drop',     emoji: '💧', color: '#706fd3' },
  { name: 'Leaf',     emoji: '🍃', color: '#33d9b2' },
  { name: 'Snow',     emoji: '❄️', color: '#82ccdd' },
  { name: 'Spark',    emoji: '⚡', color: '#feca57' },
  { name: 'Fire',     emoji: '🔥', color: '#ff793f' },
  { name: 'Umbrella', emoji: '☂️', color: '#b33939' },
  { name: 'Bell',     emoji: '🔔', color: '#cd6133' },
  { name: 'Key',      emoji: '🔑', color: '#ccae62' },
  { name: 'Hexagon',  emoji: '⬡', color: '#10ac84' }
];

const TOTAL_ROUNDS = 20;

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

const buildRound = (level) => {
  const target = SHAPES[level - 1];
  const distractors = shuffle(SHAPES.filter((s) => s.name !== target.name)).slice(0, 3);
  const options = shuffle([target, ...distractors]);
  return { target, options };
};

const ShapeFinder = ({ onBack }) => {
  const [level, setLevel] = useState(1);
  const [round, setRound] = useState(() => buildRound(1));
  const [feedback, setFeedback] = useState('');
  const [feedbackType, setFeedbackType] = useState('');
  const [gameWon, setGameWon] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [picked, setPicked] = useState(null);

  const resetGame = useCallback(() => {
    setLevel(1);
    setRound(buildRound(1));
    setFeedback('');
    setFeedbackType('');
    setGameWon(false);
    setAnswered(false);
    setPicked(null);
  }, []);

  const handlePick = (shape) => {
    if (answered || gameWon) return;
    setPicked(shape.name);

    if (shape.name === round.target.name) {
      playSound('match');
      setFeedback('🎉 You found it!');
      setFeedbackType('correct');
      setAnswered(true);
      setTimeout(() => {
        if (level === TOTAL_ROUNDS) {
          setGameWon(true);
        } else {
          const nextLevel = level + 1;
          setLevel(nextLevel);
          setRound(buildRound(nextLevel));
          setFeedback('');
          setFeedbackType('');
          setAnswered(false);
          setPicked(null);
        }
      }, 800);
    } else {
      playSound('wrong');
      setFeedback('Oops! Try again! 👀');
      setFeedbackType('wrong');
      setTimeout(() => {
        setPicked(null);
        setFeedback('');
        setFeedbackType('');
      }, 700);
    }
  };

  return (
    <div className="game-view pop-in">
      {gameWon ? (
        <div className="champion-screen">
          <div style={{ fontSize: '4rem' }}>🏆</div>
          <h2>Shape Star!</h2>
          <p>You found all {TOTAL_ROUNDS} shapes! Amazing!</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={resetGame}>Play Again</button>
            <button className="btn" style={{ background: '#eee' }} onClick={() => typeof onBack === 'function' && onBack()}>
              Main Menu
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="game-header">
            <div>Shape Finder</div>
            <div>Round {level} / {TOTAL_ROUNDS}</div>
            <div className="progress-container">
              <div className="progress-bar" style={{ width: `${((level - 1) / TOTAL_ROUNDS) * 100}%` }} />
            </div>
          </div>

          <p style={{ textAlign: 'center', color: '#666', marginBottom: '0.5rem', fontWeight: 600 }}>
            Find the matching shape! 🔍
          </p>

          <div className="shape-target">
            <div className="shape-target-emoji">{round.target.emoji}</div>
            <div className="shape-target-name">{round.target.name}</div>
          </div>

          <div className="shape-options">
            {round.options.map((shape) => {
              let border = `4px solid ${shape.color}`;
              let bg = '#fff';
              if (picked === shape.name) {
                if (shape.name === round.target.name) {
                  bg = '#e8fdf3'; border = '4px solid #1dd1a1';
                } else {
                  bg = '#fff0f3'; border = '4px solid #ff6b9d';
                }
              }
              return (
                <button
                  key={shape.name}
                  className="shape-option-btn"
                  style={{ border, background: bg }}
                  onClick={() => handlePick(shape)}
                  disabled={answered}
                >
                  <span className="shape-option-emoji">{shape.emoji}</span>
                  <span className="shape-option-label">{shape.name}</span>
                </button>
              );
            })}
          </div>

          {feedback && (
            <div className={`sound-feedback ${feedbackType}`}>{feedback}</div>
          )}

          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <button className="btn btn-primary" style={{ background: '#eee', color: '#333' }}
              onClick={() => typeof onBack === 'function' && onBack()}>
              Main Menu
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ShapeFinder;
