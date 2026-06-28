import { useState, useCallback } from 'react';
import { playSound } from '../../utils/sounds';

const ROUNDS = [
  { seq: ['🐶','🐱','🐶','🐱'], answer: '🐶', wrong: ['🐸','🐭','🦁'] },
  { seq: ['🍎','🍊','🍎','🍊'], answer: '🍎', wrong: ['🍋','🍇','🍓'] },
  { seq: ['⭐','🌙','⭐','🌙'], answer: '⭐', wrong: ['☀️','🌟','💫'] },
  { seq: ['🔴','🔵','🔴','🔵'], answer: '🔴', wrong: ['🟡','🟢','🟣'] },
  { seq: ['🌸','🌷','🌸','🌷'], answer: '🌸', wrong: ['🌻','🌹','🍀'] },
  { seq: ['🐶','🐶','🐱','🐶'], answer: '🐶', wrong: ['🐸','🐭','🐮'] },
  { seq: ['🍎','🍎','🍊','🍎'], answer: '🍎', wrong: ['🍋','🍇','🍓'] },
  { seq: ['🚗','🚌','🚗','🚌'], answer: '🚗', wrong: ['🚂','🚀','🛵'] },
  { seq: ['🌞','🌧️','🌞','🌧️'], answer: '🌞', wrong: ['❄️','🌈','🌙'] },
  { seq: ['🎈','🎀','🎈','🎀'], answer: '🎈', wrong: ['🎁','🎂','🎉'] },
  { seq: ['🐸','🐸','🦊','🐸'], answer: '🐸', wrong: ['🐯','🐻','🦁'] },
  { seq: ['🍰','🍩','🍰','🍩'], answer: '🍰', wrong: ['🧁','🍪','🎂'] },
  { seq: ['🐶','🐱','🐸','🐶'], answer: '🐱', wrong: ['🦁','🐭','🐮'] },
  { seq: ['🔺','🔵','🔺','🔵'], answer: '🔺', wrong: ['🟡','⬛','🔷'] },
  { seq: ['🌈','⭐','🌈','⭐'], answer: '🌈', wrong: ['🌙','☀️','💫'] },
  { seq: ['🍦','🍭','🍦','🍭'], answer: '🍦', wrong: ['🍫','🧁','🍰'] },
  { seq: ['🐧','🐧','🦋','🐧'], answer: '🐧', wrong: ['🦉','🦆','🐦'] },
  { seq: ['🏠','🌳','🏠','🌳'], answer: '🏠', wrong: ['🏡','⛺','🏰'] },
];

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

const TOTAL_LEVELS = 20;

const buildRounds = () =>
  Array.from({ length: TOTAL_LEVELS }, () => {
    const r = ROUNDS[Math.floor(Math.random() * ROUNDS.length)];
    return {
      ...r,
      opts: shuffle([r.answer, ...r.wrong.slice(0, 3)]),
    };
  });

const TOTAL = TOTAL_LEVELS;

const WhatComesNext = ({ onBack }) => {
  const [rounds, setRounds]         = useState(buildRounds);
  const [index, setIndex]           = useState(0);
  const [wrongPicks, setWrongPicks] = useState([]);
  const [solved, setSolved]         = useState(false);
  const [feedback, setFeedback]     = useState('');
  const [feedbackType, setFeedbackType] = useState('');
  const [score, setScore]           = useState(0);
  const [gameWon, setGameWon]       = useState(false);

  const current = rounds[index];

  const resetGame = useCallback(() => {
    setRounds(buildRounds());
    setIndex(0);
    setWrongPicks([]);
    setSolved(false);
    setFeedback('');
    setFeedbackType('');
    setScore(0);
    setGameWon(false);
  }, []);

  const handlePick = (opt) => {
    if (solved || wrongPicks.includes(opt)) return;

    if (opt === current.answer) {
      playSound('match');
      setFeedback('🎉 Well done! You got it!');
      setFeedbackType('correct');
      setSolved(true);
      setScore((s) => s + 1);
      setTimeout(() => {
        if (index + 1 >= TOTAL) {
          setGameWon(true);
        } else {
          setIndex((i) => i + 1);
          setWrongPicks([]);
          setSolved(false);
          setFeedback('');
          setFeedbackType('');
        }
      }, 1000);
    } else {
      playSound('wrong');
      setWrongPicks((prev) => [...prev, opt]);
      setFeedback("❌ Oops! That's not right — try again!");
      setFeedbackType('wrong');
    }
  };

  return (
    <div className="game-view pop-in">
      {gameWon ? (
        <div className="champion-screen">
          <div style={{ fontSize: '4rem' }}>🏆</div>
          <h2>Pattern Pro!</h2>
          <p>You spotted <strong>{score}</strong> out of <strong>{TOTAL}</strong> patterns! Brilliant!</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={resetGame}>Play Again</button>
            <button className="btn" style={{ background: '#eee' }} onClick={() => typeof onBack === 'function' && onBack()}>Main Menu</button>
          </div>
        </div>
      ) : (
        <>
          <div className="game-header">
            <div>What Comes Next?</div>
            <div>Round {index + 1} / {TOTAL}</div>
            <div>Score: {score}</div>
            <div className="progress-container">
              <div className="progress-bar" style={{ width: `${(index / TOTAL) * 100}%` }} />
            </div>
          </div>

          <p style={{ textAlign: 'center', color: '#666', fontWeight: 700, marginBottom: '1rem', fontSize: 'clamp(0.95rem,3vw,1.1rem)' }}>
            What comes next in the pattern? 🔮
          </p>

          <div className="wcn-sequence">
            {current.seq.map((emoji, i) => (
              <div key={i} className="wcn-tile">{emoji}</div>
            ))}
            <div className="wcn-tile wcn-blank">❓</div>
          </div>

          <div className="wcn-options">
            {current.opts.map((opt) => {
              const isWrong   = wrongPicks.includes(opt);
              const isCorrect = solved && opt === current.answer;
              let cls = 'wcn-btn';
              if (isCorrect) cls += ' wcn-correct';
              else if (isWrong) cls += ' wcn-wrong';
              return (
                <button
                  key={opt}
                  className={cls}
                  onClick={() => handlePick(opt)}
                  disabled={isWrong || solved}
                  title={isWrong ? 'Already tried!' : ''}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {feedback && <div className={`sound-feedback ${feedbackType}`}>{feedback}</div>}

          <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
            <button className="btn" style={{ background: '#eee', color: '#333' }}
              onClick={() => typeof onBack === 'function' && onBack()}>Main Menu</button>
          </div>
        </>
      )}
    </div>
  );
};

export default WhatComesNext;
