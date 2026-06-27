import { useState, useEffect, useCallback, useRef } from 'react';
import { playSound } from '../../utils/sounds';

const GAME_TIME = 60;

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateQuestion = (score) => {
  const level = score < 5 ? 'easy' : score < 12 ? 'medium' : 'hard';
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
  const options = [...wrongs, answer].sort(() => Math.random() - 0.5);

  return { a, b, op, answer, options, level };
};

const MathNinja = ({ onBack }) => {
  const [phase, setPhase]         = useState('ready');
  const [timeLeft, setTimeLeft]   = useState(GAME_TIME);
  const [score, setScore]         = useState(0);
  const [streak, setStreak]       = useState(0);
  const [best, setBest]           = useState(() => Number(localStorage.getItem('mathninja-best') || 0));
  const [question, setQuestion]   = useState(() => generateQuestion(0));
  const [picked, setPicked]       = useState(null);
  const [flash, setFlash]         = useState('');
  const timerRef                  = useRef(null);
  const scoreRef                  = useRef(0);

  const nextQuestion = useCallback((currentScore) => {
    setQuestion(generateQuestion(currentScore));
    setPicked(null);
    setFlash('');
  }, []);

  useEffect(() => {
    if (phase !== 'playing') return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setPhase('gameover');
          setBest((prev) => {
            const newBest = Math.max(prev, scoreRef.current);
            localStorage.setItem('mathninja-best', newBest);
            return newBest;
          });
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase]);

  const startGame = () => {
    setPhase('playing');
    setTimeLeft(GAME_TIME);
    setScore(0);
    setStreak(0);
    scoreRef.current = 0;
    setQuestion(generateQuestion(0));
    setPicked(null);
    setFlash('');
  };

  const handlePick = (opt) => {
    if (picked !== null || phase !== 'playing') return;
    setPicked(opt);

    if (opt === question.answer) {
      playSound('match');
      const newScore = score + 1;
      const newStreak = streak + 1;
      setScore(newScore);
      setStreak(newStreak);
      scoreRef.current = newScore;
      setFlash('correct');
      setTimeout(() => nextQuestion(newScore), 400);
    } else {
      playSound('wrong');
      setStreak(0);
      setFlash('wrong');
      setTimeout(() => nextQuestion(score), 600);
    }
  };

  const timerPct = (timeLeft / GAME_TIME) * 100;
  const timerColor = timeLeft > 20 ? '#1dd1a1' : timeLeft > 10 ? '#ff9f43' : '#ff6b6b';

  const grade = score >= 20 ? '🥷 Grand Master Ninja!'  :
                score >= 14 ? '⚔️ Ninja Master!'        :
                score >= 9  ? '🌟 Rising Ninja!'        :
                              '🎯 Ninja Trainee!';

  return (
    <div className="game-view pop-in">
      {phase === 'ready' && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 'clamp(4rem,14vw,7rem)', marginBottom: '0.5rem' }}>🥷</div>
          <h2 style={{ fontSize: 'clamp(1.6rem,5vw,2.2rem)', color: '#2d3436', marginBottom: '0.5rem' }}>Math Ninja</h2>
          <p style={{ color: '#636e72', marginBottom: '0.5rem', fontSize: 'clamp(0.95rem,3vw,1.1rem)' }}>
            Solve as many maths problems as you can in <strong>60 seconds!</strong>
          </p>
          <p style={{ color: '#aaa', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            🏆 Best score: {best}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '0.85rem 2rem' }} onClick={startGame}>
              ⚔️ Start!
            </button>
            <button className="btn" style={{ background: '#eee' }} onClick={() => typeof onBack === 'function' && onBack()}>
              Main Menu
            </button>
          </div>
        </div>
      )}

      {phase === 'gameover' && (
        <div className="champion-screen">
          <div style={{ fontSize: '4rem' }}>🥷</div>
          <h2>{grade}</h2>
          <p>You scored <strong>{score}</strong> correct answers!</p>
          {score >= best && score > 0 && (
            <p style={{ color: '#e17055', fontWeight: 800 }}>🎉 New Best Score!</p>
          )}
          <p style={{ color: '#aaa', fontSize: '0.95rem' }}>Best ever: {best}</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
            <button className="btn btn-primary" onClick={startGame}>Play Again</button>
            <button className="btn" style={{ background: '#eee' }} onClick={() => typeof onBack === 'function' && onBack()}>Main Menu</button>
          </div>
        </div>
      )}

      {phase === 'playing' && (
        <>
          <div className="ninja-hud">
            <div className="ninja-score">⚔️ {score}</div>
            {streak >= 3 && <div className="ninja-streak">🔥 {streak} streak!</div>}
            <div className="ninja-timer" style={{ color: timerColor }}>⏱ {timeLeft}s</div>
          </div>

          <div className="ninja-timer-bar-bg">
            <div className="ninja-timer-bar" style={{ width: `${timerPct}%`, background: timerColor }} />
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

          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <button className="btn" style={{ background: 'rgba(255,255,255,0.8)', color: '#555', fontSize: '0.88rem' }}
              onClick={() => { clearInterval(timerRef.current); setPhase('ready'); }}>
              ← Quit
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MathNinja;
