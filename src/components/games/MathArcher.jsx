import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { playSound } from '../../utils/sounds';

const TOTAL_LEVELS = 20;
const LANES = [12, 33, 55, 77]; // top % positions for targets in the play area

// Deterministic seeded PRNG
const createPRNG = (seed) => {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
};

// --- Level data generator ---
// Levels 1–5:   addition only, 1–10, 3 answer targets
// Levels 6–10:  addition + subtraction, 1–20, 4 targets
// Levels 11–15: × (×2–×5) + mixed add/sub, 4 targets, faster
// Levels 16–20: all operators, numbers to 100, 5 targets, fastest
const buildLevel = (lvl) => {
  const prng = createPRNG(lvl * 307 + 53);
  const rInt = (min, max) => Math.floor(prng() * (max - min + 1)) + min;

  let a, b, op, answer;

  if (lvl <= 5) {
    op = '+'; a = rInt(1, 10); b = rInt(1, 10); answer = a + b;
  } else if (lvl <= 10) {
    if (prng() < 0.5) {
      op = '+'; a = rInt(1, 20); b = rInt(1, 20); answer = a + b;
    } else {
      op = '−'; a = rInt(5, 20); b = rInt(1, a); answer = a - b;
    }
  } else if (lvl <= 15) {
    const r = prng();
    if (r < 0.4) {
      op = '×'; a = rInt(2, 5); b = rInt(2, 9); answer = a * b;
    } else if (r < 0.7) {
      op = '+'; a = rInt(10, 50); b = rInt(10, 50); answer = a + b;
    } else {
      op = '−'; a = rInt(10, 50); b = rInt(1, a); answer = a - b;
    }
  } else {
    const r = prng();
    if (r < 0.35) {
      op = '×'; a = rInt(3, 9); b = rInt(3, 12); answer = a * b;
    } else if (r < 0.65) {
      op = '+'; a = rInt(20, 100); b = rInt(20, 100); answer = a + b;
    } else {
      op = '−'; a = rInt(30, 100); b = rInt(5, a); answer = a - b;
    }
  }

  // Distractors — deterministic, unique, non-negative
  const targetCount = lvl <= 5 ? 3 : lvl <= 15 ? 4 : 5;
  const wrongs = new Set();
  let guard = 0;
  while (wrongs.size < targetCount - 1 && guard < 40) {
    guard++;
    const delta = rInt(1, Math.max(3, Math.floor(Math.abs(answer) * 0.25)));
    const w = prng() < 0.5 ? answer + delta : answer - delta;
    if (w !== answer && w >= 0) wrongs.add(w);
  }

  const allAnswers = [answer, ...wrongs];
  // Shuffle allAnswers deterministically
  for (let i = allAnswers.length - 1; i > 0; i--) {
    const j = Math.floor(prng() * (i + 1));
    [allAnswers[i], allAnswers[j]] = [allAnswers[j], allAnswers[i]];
  }

  // Build targets with deterministic lane/speed/direction
  const useLanes = LANES.slice(0, targetCount);
  const shuffledLanes = [...useLanes];
  for (let i = shuffledLanes.length - 1; i > 0; i--) {
    const j = Math.floor(prng() * (i + 1));
    [shuffledLanes[i], shuffledLanes[j]] = [shuffledLanes[j], shuffledLanes[i]];
  }

  const baseDuration = Math.max(4.5, 9.5 - lvl * 0.25);
  const targets = allAnswers.slice(0, targetCount).map((ans, i) => ({
    id: `${lvl}-${i}`,
    answer: ans,
    top: shuffledLanes[i % shuffledLanes.length],
    duration: baseDuration + prng() * 1.5,
    direction: prng() < 0.5 ? 'normal' : 'reverse',
  }));

  return { a, b, op, answer, targets };
};

let targetSeq = 0;

const MathArcher = ({ onBack }) => {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('Solve it and tap the right answer! 🎯');
  const [solved, setSolved] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  const levelData = useMemo(() => buildLevel(level), [level]);

  // Give each target a unique DOM key so targets remount on level change
  const [targetKeys] = useState(() => ({}));
  const seqRef = useRef(0);
  const getKey = useCallback((id) => {
    if (!targetKeys[id]) { targetKeys[id] = ++seqRef.current; }
    return targetKeys[id];
  }, [targetKeys]);

  // Viewport-width awareness for narrow screens
  const [isNarrow, setIsNarrow] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 576 : false,
  );
  useEffect(() => {
    const onResize = () => setIsNarrow(window.innerWidth < 576);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleShoot = useCallback((t) => {
    if (solved || gameWon) return;
    if (t.answer === levelData.answer) {
      playSound('match');
      setSolved(true);
      setScore((s) => s + 1);
      setFeedback('Bullseye! 🎯 Great shot!');
      setTimeout(() => {
        if (level >= TOTAL_LEVELS) {
          playSound('celebrate');
          setGameWon(true);
        } else {
          setLevel((l) => l + 1);
          setSolved(false);
          setFeedback('Solve it and tap the right answer! 🎯');
          // clear key cache so new targets remount
          Object.keys(targetKeys).forEach((k) => delete targetKeys[k]);
        }
      }, 600);
    } else {
      playSound('wrong');
      setFeedback(`Oops! That's ${t.answer} — find the right answer! 🏹`);
    }
  }, [solved, gameWon, levelData.answer, level, targetKeys]);

  const handlePlayAgain = () => {
    setLevel(1); setScore(0); setSolved(false); setGameWon(false);
    setFeedback('Solve it and tap the right answer! 🎯');
    Object.keys(targetKeys).forEach((k) => delete targetKeys[k]);
  };

  if (gameWon) {
    return (
      <div className="game-view pop-in">
        <div className="champion-screen">
          <div style={{ fontSize: '4rem' }}>🏹</div>
          <h2>Master Archer!</h2>
          <p>You solved all {TOTAL_LEVELS} math challenges!</p>
          <p style={{ fontSize: '1.1rem', color: '#666', marginTop: '1rem' }}>
            Quick thinking and sharp aim — you're a math archery champion! ✨
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={handlePlayAgain}>Play Again</button>
            <button className="btn btn-back" onClick={() => { if (typeof onBack === 'function') onBack(); }}>Main Menu</button>
          </div>
        </div>
      </div>
    );
  }

  // Narrow screens: hide one lane so there's more space
  const visibleTargets = isNarrow
    ? levelData.targets.filter((_, i) => i < levelData.targets.length - 1)
    : levelData.targets;

  return (
    <div className="game-view pop-in">
      <div className="game-header">
        <div>Math Archer 🏹</div>
        <div>Level {level} / {TOTAL_LEVELS}</div>
        <div>Score: {score}</div>
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${(level / TOTAL_LEVELS) * 100}%` }} />
        </div>
      </div>

      <div className="ma-question" aria-live="polite">
        {levelData.a} {levelData.op} {levelData.b} = ?
      </div>

      <div className="ma-area" aria-label="Moving answer targets">
        {visibleTargets.map((t) => (
          <button
            key={`${level}-${t.id}`}
            className={`ma-target${solved && t.answer === levelData.answer ? ' hit' : ''}`}
            style={{
              top: `${t.top}%`,
              animationDuration: `${t.duration}s`,
              animationDirection: t.direction,
            }}
            onClick={() => handleShoot(t)}
            aria-label={`Answer ${t.answer}`}
          >
            <span className="ma-target-emoji" aria-hidden>🍎</span>
            <span className="ma-target-text">{t.answer}</span>
          </button>
        ))}
      </div>

      <div className="ma-feedback" style={{ color: solved ? 'var(--candy-green)' : 'var(--text-muted)' }}>
        {feedback}
      </div>

      <div className="detail-back-container">
        <button className="btn btn-back" onClick={() => { if (typeof onBack === 'function') onBack(); }}>Main Menu</button>
      </div>
    </div>
  );
};

export default MathArcher;
