import { useState, useCallback } from 'react';
import { playSound } from '../../utils/sounds';

const TOTAL_LEVELS = 20;

const createPRNG = (seed) => {
  let currentSeed = seed;
  return () => {
    let x = Math.sin(currentSeed++) * 10000;
    return x - Math.floor(x);
  };
};

const generateQuestion = (levelNum) => {
  const prng = createPRNG(levelNum * 10);
  const rand = (min, max) => Math.floor(prng() * (max - min + 1)) + min;
  const level = levelNum < 5 ? 'easy' : levelNum < 12 ? 'medium' : 'hard';
  let a, b, op, answer;

  if (level === 'easy') {
    op = rand(0, 1) === 0 ? '+' : '-';
    if (op === '+') { a = rand(1, 20); b = rand(1, 20); answer = a + b; }
    else            { a = rand(5, 20); b = rand(1, a);   answer = a - b; }
  } else if (level === 'medium') {
    op = rand(0, 2) === 0 ? '×' : rand(0, 1) === 0 ? '+' : '-';
    if (op === '×') { a = rand(2, 9);  b = rand(2, 9);   answer = a * b; }
    else if (op === '+') { a = rand(10, 50); b = rand(10, 50); answer = a + b; }
    else            { a = rand(20, 80); b = rand(5, a);  answer = a - b; }
  } else {
    op = rand(0, 1) === 0 ? '×' : rand(0, 1) === 0 ? '+' : '-';
    if (op === '×') { a = rand(6, 12); b = rand(6, 12);  answer = a * b; }
    else if (op === '+') { a = rand(50, 150); b = rand(50, 150); answer = a + b; }
    else            { a = rand(50, 200); b = rand(10, a); answer = a - b; }
  }

  const wrongSet = new Set();
  while (wrongSet.size < 3) {
    const delta = rand(1, Math.max(4, Math.floor(answer * 0.2)));
    const w = rand(0, 1) === 0 ? answer + delta : answer - delta;
    if (w !== answer && w >= 0) wrongSet.add(w);
  }
  const wrongs = [...wrongSet];
  const options = [...wrongs, answer].sort(() => prng() - 0.5);

  return { a, b, op, answer, options, level };
};

const MathNinja = ({ onBack }) => {
  const [level, setLevel]         = useState(1);
  const [score, setScore]         = useState(0);
  const [streak, setStreak]       = useState(0);
  const [question, setQuestion]   = useState(() => generateQuestion(1));
  const [picked, setPicked]       = useState(null);
  const [flash, setFlash]         = useState('');
  const [gameWon, setGameWon]     = useState(false);

  const resetGame = useCallback(() => {
    setLevel(1);
    setScore(0);
    setStreak(0);
    setQuestion(generateQuestion(1));
    setPicked(null);
    setFlash('');
    setGameWon(false);
  }, []);

  const handlePick = (opt) => {
    if (picked !== null || gameWon) return;
    setPicked(opt);

    if (opt === question.answer) {
      playSound('match');
      const newScore = score + 1;
      setScore(newScore);
      setStreak(s => s + 1);
      setFlash('correct');
      setTimeout(() => {
        if (level >= TOTAL_LEVELS) {
          setGameWon(true);
        } else {
          setLevel(l => l + 1);
          setQuestion(generateQuestion(level + 1));
          setPicked(null);
          setFlash('');
        }
      }, 400);
    } else {
      playSound('wrong');
      setStreak(0);
      setFlash('wrong');
      setTimeout(() => {
        if (level >= TOTAL_LEVELS) {
          setGameWon(true);
        } else {
          setLevel(l => l + 1);
          setQuestion(generateQuestion(level + 1));
          setPicked(null);
          setFlash('');
        }
      }, 600);
    }
  };

  const grade = score >= 18 ? '🥷 Grand Master Ninja!'  :
                score >= 14 ? '⚔️ Ninja Master!'        :
                score >= 9  ? '🌟 Rising Ninja!'        :
                              '🎯 Ninja Trainee!';

  return (
    <div className="game-view pop-in">
      {gameWon ? (
        <div className="champion-screen">
          <div style={{ fontSize: '4rem' }}>🥷</div>
          <h2>{grade}</h2>
          <p>You scored <strong>{score}</strong> out of <strong>{TOTAL_LEVELS}</strong>!</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
            <button className="btn btn-primary" onClick={resetGame}>Play Again</button>
            <button className="btn" style={{ background: '#eee' }} onClick={() => typeof onBack === 'function' && onBack()}>Main Menu</button>
          </div>
        </div>
      ) : (
        <>
          <div className="game-header">
            <div>Math Ninja</div>
            <div>Level {level} / {TOTAL_LEVELS}</div>
            <div>Score: {score}</div>
            <div className="progress-container">
              <div className="progress-bar" style={{ width: `${(level / TOTAL_LEVELS) * 100}%` }} />
            </div>
          </div>

          <div className="ninja-hud" style={{ justifyContent: 'center' }}>
            {streak >= 3 && <div className="ninja-streak">🔥 {streak} streak!</div>}
          </div>

          <div className={`ninja-question-card ${flash}`}>
            <div className="ninja-question">
              {question.a} {question.op} {question.b} = ?
            </div>
            <div className="ninja-level-badge">{question.level}</div>
          </div>

          <div className="ninja-options">
            {question.options.map((opt) => {
              let cls = 'ninja-btn';
              if (picked === opt) cls += opt === question.answer ? ' ninja-correct' : ' ninja-wrong';
              return (
                <button key={opt} className={cls} onClick={() => handlePick(opt)} disabled={picked !== null}>
                  {opt}
                </button>
              );
            })}
          </div>

          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <button className="btn" style={{ background: '#eee', color: '#333' }}
              onClick={() => typeof onBack === 'function' && onBack()}>
              Main Menu
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MathNinja;
