import { useState, useEffect, useCallback, useRef } from 'react';
import { playSound } from '../../utils/sounds';

const COLORS = [
  { name: 'Red', hex: '#FF6B6B' },
  { name: 'Blue', hex: '#4D96FF' },
  { name: 'Green', hex: '#6BCB77' },
  { name: 'Yellow', hex: '#FFD93D' },
  { name: 'Purple', hex: '#C77DFF' },
  { name: 'Orange', hex: '#FF9F1C' },
];

const TOTAL_LEVELS = 20;
const PER_LEVEL = 5; // target-colored balloons to pop per level
const MAX_BALLOONS = 10;

// Deterministic per-level PRNG so every level is identical on replay.
const createPRNG = (seed) => {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
};

// Pre-build a deterministic stream of balloons for a level: the target color
// and the (cosmetic) position/size/duration mix are all derived from the seed.
const buildLevelPlan = (lvl) => {
  const prng = createPRNG(lvl * 911 + 17);
  const targetColor = COLORS[Math.floor(prng() * COLORS.length)];
  const targetBias = Math.max(0.2, 0.5 - (lvl - 1) * 0.015); // fewer correct balloons later
  const plan = [];
  for (let i = 0; i < 80; i++) {
    const isTarget = prng() < targetBias;
    plan.push({
      color: isTarget ? targetColor : COLORS[Math.floor(prng() * COLORS.length)],
      left: 8 + prng() * 80,
      duration: Math.max(2.2, 3.6 - lvl * 0.06) + prng() * 0.6,
      size: 50 + prng() * 26,
    });
  }
  return { targetColor, plan };
};

let balloonSeq = 0;

const BalloonPop = ({ onBack }) => {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [target, setTarget] = useState(() => buildLevelPlan(1).targetColor);
  const [balloons, setBalloons] = useState([]);
  const [popped, setPopped] = useState(0);
  const [feedback, setFeedback] = useState('Pop the balloons of the right color!');
  const [gameWon, setGameWon] = useState(false);

  const planRef = useRef(buildLevelPlan(1));
  const spawnIdxRef = useRef(0);

  const removeBalloon = useCallback((id) => setBalloons((prev) => prev.filter((b) => b.id !== id)), []);

  const startLevel = useCallback((lvl) => {
    const plan = buildLevelPlan(lvl);
    planRef.current = plan;
    spawnIdxRef.current = 0;
    setTarget(plan.targetColor);
    setPopped(0);
  }, []);

  const pop = useCallback((b) => {
    if (gameWon) return;

    // Wrong color: notify and let the child try a correct one (no advance).
    if (b.color.hex !== target.hex) {
      playSound('wrong');
      setFeedback(`That's a ${b.color.name} balloon — pop the ${target.name} ones! 🎈`);
      removeBalloon(b.id);
      return;
    }

    playSound('pop');
    setScore((s) => s + 1);
    const nextPopped = popped + 1;
    setPopped(nextPopped);
    removeBalloon(b.id);

    if (nextPopped >= PER_LEVEL) {
      if (level >= TOTAL_LEVELS) {
        playSound('celebrate');
        setGameWon(true);
      } else {
        const nextLevel = level + 1;
        startLevel(nextLevel);
        setLevel(nextLevel);
        setFeedback(`Level ${nextLevel}! Pop the ${planRef.current.targetColor.name} balloons! 🎈`);
      }
    } else {
      setFeedback('Great popping! Keep going! 🎉');
    }
  }, [gameWon, target, level, popped, startLevel]);

  // Spawn loop — balloons float upward inside the play area.
  useEffect(() => {
    if (gameWon) return;
    const spawnRate = Math.max(550, 1250 - level * 38); // faster at higher levels
    const interval = setInterval(() => {
      setBalloons((prev) => {
        if (prev.length >= MAX_BALLOONS) return prev;
        const spec = planRef.current.plan[spawnIdxRef.current % planRef.current.plan.length];
        spawnIdxRef.current += 1;
        const id = ++balloonSeq;
        return [...prev, { id, ...spec }];
      });
    }, spawnRate);
    return () => clearInterval(interval);
  }, [gameWon, level]);

  if (gameWon) {
    return (
      <div className="game-view pop-in">
        <div className="champion-screen">
          <div style={{ fontSize: '4rem' }}>🎈</div>
          <h2>Balloon Pop Champion!</h2>
          <p>You popped {score} balloons and cleared all {TOTAL_LEVELS} levels!</p>
          <p style={{ fontSize: '1.1rem', color: '#666', marginTop: '1rem' }}>
            Great job spotting colors — you're a real color detective!
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={() => {
              setLevel(1); setScore(0); startLevel(1);
              setBalloons([]); setFeedback('Pop the balloons of the right color!'); setGameWon(false);
            }}>
              Play Again
            </button>
            <button className="btn" onClick={() => { if (typeof onBack === 'function') onBack(); }}>
              Main Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="game-view pop-in">
      <div className="game-header">
        <div>Balloon Pop 🎈</div>
        <div>Level {level} / {TOTAL_LEVELS}</div>
        <div>Score: {score}</div>
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${(level / TOTAL_LEVELS) * 100}%` }} />
        </div>
      </div>

      <div className="bp-prompt">
        <span className="bp-prompt-text">Pop the</span>
        <span className="bp-target-color" style={{ background: target.hex }} aria-hidden />
        <span className="bp-prompt-text">{target.name} balloons!</span>
        <span className="bp-prompt-count">({popped}/{PER_LEVEL})</span>
      </div>

      <div className="bp-area" aria-label="Balloon play area">
        {balloons.map((b) => (
          <button
            key={b.id}
            className="bp-balloon"
            style={{
              left: `${b.left}%`,
              width: `${b.size}px`,
              height: `${b.size}px`,
              background: `radial-gradient(circle at 35% 30%, rgba(255,255,255,0.85), ${b.color.hex})`,
              animationDuration: `${b.duration}s`,
            }}
            onClick={() => pop(b)}
            onAnimationEnd={() => removeBalloon(b.id)}
            aria-label={`${b.color.name} balloon`}
          >
            <span className="bp-balloon-string" />
          </button>
        ))}
      </div>

      <div className="bp-feedback" style={{ color: feedback.includes('Great') || feedback.includes('Level') ? 'var(--candy-green)' : 'var(--text-muted)' }}>
        {feedback}
      </div>

      <div className="detail-back-container">
        <button className="btn" onClick={() => { if (typeof onBack === 'function') onBack(); }}>
          Main Menu
        </button>
      </div>
    </div>
  );
};

export default BalloonPop;
