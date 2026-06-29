import { useState, useCallback } from 'react';
import { playSound } from '../../utils/sounds';

const ROUNDS = [
  { question: "Which one is NOT an animal?",  items: ['🐶','🐱','🍎','🐭'], odd: '🍎' },
  { question: "Which one is NOT a fruit?",    items: ['🍊','🍋','🐶','🍇'], odd: '🐶' },
  { question: "Which one does NOT fly?",      items: ['✈️','🦋','🐦','🐟'], odd: '🐟' },
  { question: "Which one is NOT a vehicle?",  items: ['🚗','🐸','🚌','🚲'], odd: '🐸' },
  { question: "Which one is NOT a veggie?",   items: ['🥕','🌽','🍕','🥦'], odd: '🍕' },
  { question: "Which one is NOT in the sky?", items: ['☀️','🌙','⭐','🐠'], odd: '🐠' },
  { question: "Which one is NOT a toy?",      items: ['🪀','🎮','🧸','🍔'], odd: '🍔' },
  { question: "Which one is NOT clothing?",   items: ['👒','👟','🧤','🍌'], odd: '🍌' },
  { question: "Which one is NOT a drink?",    items: ['🥛','🧃','🚂','🍵'], odd: '🚂' },
  { question: "Which one is NOT a sea animal?", items: ['🐠','🐙','🦀','🐘'], odd: '🐘' },
  { question: "Which one is NOT round?",      items: ['🍕','🌕','⭕','📦'], odd: '📦' },
  { question: "Which one is NOT a musical instrument?", items: ['🎸','🎹','🥁','🍰'], odd: '🍰' },
  { question: "Which one is NOT in a farm?",  items: ['🐄','🐔','🐖','🦈'], odd: '🦈' },
  { question: "Which one is NOT a sport?",    items: ['⚽','🏀','🍦','🎾'], odd: '🍦' },
  { question: "Which one is NOT a tool?",     items: ['🔨','🪛','✂️','🌸'], odd: '🌸' },
  { question: "Which one is NOT a letter?",   items: ['A','B','7','C'], odd: '7' },
  { question: "Which one is NOT a bug?",      items: ['🐜','🕷️','🦋','🐘'], odd: '🐘' },
  { question: "Which one is NOT cold?",       items: ['🧊','⛄','❄️','🔥'], odd: '🔥' },
  { question: "Which one is NOT sweet?",      items: ['🎂','🍫','🍭','🍋'], odd: '🍋' },
  { question: "Which one is NOT red?",        items: ['🍎','🍓','🍅','🍌'], odd: '🍌' }
];

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
const TOTAL_LEVELS = 20;

const OddOneOut = ({ onBack }) => {
  const [order] = useState(() => ROUNDS.map(q => ({ ...q, items: shuffle([...q.items]) })));
  const [levelIndex, setLevelIndex] = useState(0);
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [feedbackType, setFeedbackType] = useState('');
  const [gameWon, setGameWon] = useState(false);
  const [score, setScore] = useState(0);

  const current = order[levelIndex];
  const TOTAL = TOTAL_LEVELS;

  const resetGame = useCallback(() => {
    setLevelIndex(0);
    setPicked(null);
    setFeedback('');
    setFeedbackType('');
    setGameWon(false);
    setScore(0);
  }, []);

  const handlePick = (emoji) => {
    if (picked || gameWon) return;
    setPicked(emoji);

    if (emoji === current.odd) {
      playSound('match');
      setFeedback('🎉 Correct! Great thinking!');
      setFeedbackType('correct');
      setScore((s) => s + 1);
      setTimeout(() => {
        if (levelIndex + 1 >= TOTAL) {
          setGameWon(true);
        } else {
          setLevelIndex((i) => i + 1);
          setPicked(null);
          setFeedback('');
          setFeedbackType('');
        }
      }, 900);
    } else {
      playSound('wrong');
      setFeedback('Not quite! Try again! 🤔');
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
          <h2>Super Thinker!</h2>
          <p>You got {score} out of {TOTAL} correct! Brilliant!</p>
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
            <div>Odd One Out</div>
            <div>Round {levelIndex + 1} / {TOTAL}</div>
            <div>Score: {score}</div>
            <div className="progress-container">
              <div className="progress-bar" style={{ width: `${(levelIndex / TOTAL) * 100}%` }} />
            </div>
          </div>

          <div className="odd-question">
            {current.question}
          </div>

          <div className="odd-grid">
            {current.items.map((emoji) => {
              let extra = '';
              if (picked === emoji) {
                extra = emoji === current.odd ? ' odd-correct' : ' odd-wrong';
              }
              return (
                <button
                  key={emoji}
                  className={`odd-btn${extra}`}
                  onClick={() => handlePick(emoji)}
                  disabled={!!picked}
                >
                  {emoji}
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

export default OddOneOut;
