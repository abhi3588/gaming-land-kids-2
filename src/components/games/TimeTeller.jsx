import { useState, useCallback } from 'react';
import { playSound } from '../../utils/sounds';

const TOTAL_LEVELS = 20;
const GAME_SEED = 104729;

// Deterministic PRNG so each level always yields the same clock + answers.
const createPRNG = (seed) => {
  let s = seed;
  return () => {
    const x = Math.sin(s++) * 10000;
    return x - Math.floor(x);
  };
};

const pad2 = (n) => String(n).padStart(2, '0');
const formatTime = (h, m) => `${h}:${pad2(m)}`;

const optionCountFor = (level) => Math.min(3 + Math.floor((level - 1) / 4), 6);

const generateQuestion = (levelNum) => {
  const prng = createPRNG(levelNum * GAME_SEED + 7);
  const randInt = (min, max) => Math.floor(prng() * (max - min + 1)) + min;

  // Granularity increases: o'clock/half-hour -> quarter hours -> 5-min steps.
  const mChoices = levelNum < 5
    ? [0, 30]
    : levelNum < 10
      ? [0, 15, 30, 45]
      : [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

  const h = randInt(1, 12);
  const m = mChoices[randInt(0, mChoices.length - 1)];
  const answer = formatTime(h, m);

  // Distractors: nearby times (change the hour or step the minutes).
  const step = levelNum < 10 ? 15 : 5;
  const want = optionCountFor(levelNum);
  const opts = new Set([answer]);
  let guard = 0;
  while (opts.size < want && guard < 300) {
    guard += 1;
    let cand;
    if (prng() < 0.5) {
      let nh = ((h + (prng() < 0.5 ? -1 : 1)) % 12 + 12) % 12;
      nh = nh === 0 ? 12 : nh;
      cand = formatTime(nh, m);
    } else {
      const nm = ((m + (prng() < 0.5 ? -step : step)) % 60 + 60) % 60;
      cand = formatTime(h, nm);
    }
    if (cand !== answer) opts.add(cand);
  }
  let nm = m;
  while (opts.size < want) {
    nm = (nm + step) % 60;
    const cand = formatTime(h, nm);
    if (cand !== answer) opts.add(cand);
  }

  const options = [...opts].sort(() => prng() - 0.5);
  return { h, m, answer, options };
};

const Clock = ({ h, m }) => {
  const hourAngle = (h % 12) * 30 + m * 0.5;
  const minAngle = m * 6;
  const ticks = Array.from({ length: 12 }, (_, i) => {
    const ang = (i * 30 * Math.PI) / 180;
    const x1 = 120 + 92 * Math.sin(ang);
    const y1 = 120 - 92 * Math.cos(ang);
    const x2 = 120 + 100 * Math.sin(ang);
    const y2 = 120 - 100 * Math.cos(ang);
    const num = i === 0 ? 12 : i;
    const nx = 120 + 74 * Math.sin(ang);
    const ny = 120 - 74 * Math.cos(ang);
    return (
      <g key={i}>
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#34495e" strokeWidth={i % 3 === 0 ? 3 : 2} strokeLinecap="round" />
        <text x={nx} y={ny} fontSize="15" fontWeight="700" fill="#34495e" textAnchor="middle" dominantBaseline="central">{num}</text>
      </g>
    );
  });

  return (
    <div className="clock-wrap">
      <svg className="clock-face" viewBox="0 0 240 240" role="img" aria-label={`Clock showing ${formatTime(h, m)}`}>
        <circle cx="120" cy="120" r="112" fill="#fffdf5" stroke="#34495e" strokeWidth="6" />
        {ticks}
        <line x1="120" y1="120" x2="120" y2="62" stroke="#2d3436" strokeWidth="8" strokeLinecap="round" transform={`rotate(${hourAngle} 120 120)`} />
        <line x1="120" y1="120" x2="120" y2="42" stroke="#e17055" strokeWidth="5" strokeLinecap="round" transform={`rotate(${minAngle} 120 120)`} />
        <circle cx="120" cy="120" r="7" fill="#2d3436" />
      </svg>
    </div>
  );
};

const TimeTeller = ({ onBack }) => {
  const [level, setLevel] = useState(1);
  const [question, setQuestion] = useState(() => generateQuestion(1));
  const [picked, setPicked] = useState(null);
  const [wrongId, setWrongId] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [gameWon, setGameWon] = useState(false);

  const loadLevel = useCallback((n) => {
    setLevel(n);
    setQuestion(generateQuestion(n));
    setPicked(null);
    setWrongId(null);
    setFeedback('');
  }, []);

  const resetGame = useCallback(() => {
    setGameWon(false);
    loadLevel(1);
  }, [loadLevel]);

  const handlePick = (opt) => {
    if (picked !== null || gameWon) return;
    setPicked(opt);

    if (opt === question.answer) {
      playSound('match');
      setFeedback('🎉 Correct!');
      setTimeout(() => {
        if (level >= TOTAL_LEVELS) setGameWon(true);
        else loadLevel(level + 1);
      }, 650);
    } else {
      playSound('wrong');
      setWrongId(opt);
      setFeedback('❌ Not quite — try again!');
      setTimeout(() => {
        setPicked(null);
        setWrongId(null);
      }, 900);
    }
  };

  return (
    <div className="game-view pop-in">
      {gameWon ? (
        <div className="champion-screen">
          <div style={{ fontSize: '4rem' }}>🕒</div>
          <h2>Time Teller Champion!</h2>
          <p>You read every clock across all {TOTAL_LEVELS} levels! 🏆</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
            <button className="btn btn-primary" onClick={resetGame}>Play Again</button>
            <button className="btn" style={{ background: '#eee' }} onClick={() => typeof onBack === 'function' && onBack()}>Main Menu</button>
          </div>
        </div>
      ) : (
        <>
          <div className="game-header">
            <div>Time Teller</div>
            <div>Level {level} / {TOTAL_LEVELS}</div>
            <div>{feedback || 'What time is it?'}</div>
            <div className="progress-container">
              <div className="progress-bar" style={{ width: `${(level / TOTAL_LEVELS) * 100}%` }} />
            </div>
          </div>

          <Clock h={question.h} m={question.m} />

          <div className="choice-options">
            {question.options.map((opt) => {
              let cls = 'choice-btn';
              if (picked === opt) cls += opt === question.answer ? ' choice-correct' : ' choice-wrong';
              return (
                <button key={opt} className={cls} onClick={() => handlePick(opt)} disabled={picked !== null}>
                  {opt}
                </button>
              );
            })}
          </div>

          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <button className="btn" style={{ background: '#eee', color: '#333' }} onClick={() => typeof onBack === 'function' && onBack()}>
              Main Menu
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TimeTeller;
