import { useState, useEffect, useRef } from 'react';
import { playSound } from '../../utils/sounds';

const getAudioContextClass = () => {
  if (typeof window === 'undefined') return null;
  return window.AudioContext || window.webkitAudioContext || null;
};

let localAudioCtx = null;

const playTone = (frequency, duration = 0.4) => {
  if (!localAudioCtx) {
    const AudioCtx = getAudioContextClass();
    if (!AudioCtx) return;
    try {
      localAudioCtx = new AudioCtx();
    } catch (err) {
      return;
    }
  }
  if (localAudioCtx.state === 'suspended') {
    localAudioCtx.resume().catch(() => {});
  }

  const now = localAudioCtx.currentTime;
  const osc = localAudioCtx.createOscillator();
  const gain = localAudioCtx.createGain();
  osc.connect(gain);
  gain.connect(localAudioCtx.destination);
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(frequency, now);
  gain.gain.setValueAtTime(0.15, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
  osc.start(now);
  osc.stop(now + duration);
};

const playWrongBuzz = () => {
  if (!localAudioCtx) {
    const AudioCtx = getAudioContextClass();
    if (!AudioCtx) return;
    try {
      localAudioCtx = new AudioCtx();
    } catch (err) {
      return;
    }
  }
  if (localAudioCtx.state === 'suspended') {
    localAudioCtx.resume().catch(() => {});
  }
  const now = localAudioCtx.currentTime;
  const osc = localAudioCtx.createOscillator();
  const gain = localAudioCtx.createGain();
  osc.connect(gain);
  gain.connect(localAudioCtx.destination);
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(120, now);
  osc.frequency.linearRampToValueAtTime(80, now + 0.6);
  gain.gain.setValueAtTime(0.2, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
  osc.start(now);
  osc.stop(now + 0.6);
};

const PADS = [
  { id: 0, colorClass: 'red', freq: 261.63 },
  { id: 1, colorClass: 'blue', freq: 293.66 },
  { id: 2, colorClass: 'yellow', freq: 329.63 },
  { id: 3, colorClass: 'green', freq: 349.23 }
];

const getRandomPadIndex = () => Math.floor(Math.random() * PADS.length);
const TOTAL_LEVELS = 20;

const SparkSequence = ({ onBack }) => {
  const [sequence, setSequence] = useState([]);
  const [userSequence, setUserSequence] = useState([]);
  const [activePad, setActivePad] = useState(null);
  const [isPlayingSeq, setIsPlayingSeq] = useState(false);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [highScore, setHighScore] = useState(() => {
    try {
      const saved = localStorage.getItem('spark_highscore');
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });
  const [gameState, setGameState] = useState('idle');
  const [message, setMessage] = useState('Watch the lights!');
  const [gameWon, setGameWon] = useState(false);

  const timeoutsRef = useRef([]);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      timeoutsRef.current.forEach((t) => clearTimeout(t));
    };
  }, []);

  const addTimeout = (fn, delay) => {
    const id = setTimeout(fn, delay);
    timeoutsRef.current.push(id);
    return id;
  };

  const runSequence = async (seq) => {
    setIsPlayingSeq(true);
    setMessage('Watch the pattern!');

    const delay = (ms) => new Promise((resolve) => addTimeout(resolve, ms));
    await delay(300);

    for (let i = 0; i < seq.length; i++) {
      if (!isMountedRef.current) return;
      const padId = seq[i];
      const pad = PADS.find((p) => p.id === padId);
      if (!pad) continue;

      setActivePad(padId);
      playTone(pad.freq, 0.45);
      await delay(500);
      if (!isMountedRef.current) return;
      setActivePad(null);
      await delay(200);
    }

    if (!isMountedRef.current) return;
    setIsPlayingSeq(false);
    setMessage('Your turn! Copy it!');
  };

  const startGame = () => {
    setGameState('playing');
    setGameWon(false);
    setScore(0);
    setLevel(1);
    const startSeq = [getRandomPadIndex()];
    setSequence(startSeq);
    setUserSequence([]);
    setMessage('Watch the pattern!');
    addTimeout(() => runSequence(startSeq), 600);
  };

  const advanceSequence = () => {
    const nextLevel = level + 1;
    const nextSequence = [...sequence, getRandomPadIndex()];
    setSequence(nextSequence);
    setUserSequence([]);
    setLevel(nextLevel);
    setScore(nextLevel - 1);
    if (nextLevel > highScore) {
      setHighScore(nextLevel - 1);
      try {
        localStorage.setItem('spark_highscore', (nextLevel - 1).toString());
      } catch {}
    }
    setMessage('Great job! Next round...');
    addTimeout(() => runSequence(nextSequence), 1000);
  };

  const handlePadClick = (id) => {
    if (isPlayingSeq || gameState !== 'playing' || gameWon) return;

    setActivePad(id);
    const pad = PADS.find((p) => p.id === id);
    if (pad) playTone(pad.freq, 0.35);

    addTimeout(() => {
      setActivePad(null);
    }, 200);

    const nextIndex = userSequence.length;
    if (sequence[nextIndex] === id) {
      const nextSequence = [...userSequence, id];
      setUserSequence(nextSequence);

      if (nextSequence.length === sequence.length) {
        if (level === TOTAL_LEVELS) {
          setGameWon(true);
          setGameState('idle');
          setMessage('Champion! You completed all levels!');
          playSound('celebrate');
          return;
        }

        setMessage('Correct! 🎉');
        playSound('match');
        advanceSequence();
      }
    } else {
      playWrongBuzz();
      setGameState('gameover');
      setMessage('Game Over! ❌');
    }
  };

  return (
    <div className="game-view pop-in">
      {gameWon ? (
        <div className="champion-screen">
          <div style={{ fontSize: '4rem' }}>🏆</div>
          <h2>Sequence Champion!</h2>
          <p>You completed all 20 levels of Spark Sequence.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <button className="btn btn-primary" onClick={startGame}>Play Again</button>
            <button className="btn" style={{ background: '#eee' }} onClick={() => { if (typeof onBack === 'function') onBack(); }}>Main Menu</button>
          </div>
        </div>
      ) : (
        <>
          <div className="game-header">
            <div>Spark Sequence</div>
            <div>Level {level} / {TOTAL_LEVELS}</div>
            <div>Score: {score}</div>
            <div className="progress-container">
              <div className="progress-bar" style={{ width: `${(level / TOTAL_LEVELS) * 100}%` }} />
            </div>
          </div>

          <p style={{ textAlign: 'center', margin: '-0.5rem 0 1rem', color: '#666', fontSize: 'clamp(0.9rem, 2.5vw, 1rem)' }}>
            Repeat the lights and sounds sequence! ⚡
          </p>

          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            flexWrap: 'wrap', gap: '0.4rem',
            fontWeight: 'bold', padding: '0.5rem 0.75rem',
            fontSize: 'clamp(0.9rem, 3vw, 1.1rem)',
            background: 'rgba(255,255,255,0.7)', borderRadius: '999px',
            marginBottom: '0.75rem',
          }}>
            <div>🏆 Best: {highScore}</div>
            <div style={{ color: gameState === 'playing' ? '#1dd1a1' : '#aaa' }}>
              {gameState === 'playing' ? (isPlayingSeq ? '👀 Watch…' : '👆 Your turn!') : '⏸ Ready'}
            </div>
          </div>

          {gameState === 'playing' ? (
            <>
              <div className="spark-grid">
                {PADS.map((pad) => (
                  <div
                    key={pad.id}
                    className={`spark-pad ${pad.colorClass} ${activePad === pad.id ? 'active' : ''}`}
                    onClick={() => handlePadClick(pad.id)}
                    style={{ pointerEvents: isPlayingSeq ? 'none' : 'auto', cursor: isPlayingSeq ? 'default' : 'pointer' }}
                  />
                ))}
              </div>
              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <button
                  className="btn"
                  style={{ background: 'rgba(255,255,255,0.85)', color: '#555', fontSize: '0.9rem', padding: '0.55rem 1.2rem' }}
                  onClick={() => { if (typeof onBack === 'function') onBack(); }}
                >
                  ← Main Menu
                </button>
              </div>
            </>
          ) : (
            <div style={{
              textAlign: 'center', background: 'white', borderRadius: '24px',
              padding: 'clamp(1.5rem, 5vw, 3rem) clamp(1rem, 4vw, 2rem)',
              boxShadow: 'var(--shadow-pop)',
              border: `4px solid ${gameState === 'gameover' ? '#ffb7b2' : '#b2ebf2'}`,
            }}>
              {gameState === 'gameover' ? (
                <>
                  <div style={{ fontSize: 'clamp(3rem, 10vw, 5rem)', marginBottom: '0.75rem' }}>💥</div>
                  <h3 style={{ fontSize: 'clamp(1.4rem, 5vw, 2rem)', color: '#ee5253', marginBottom: '0.75rem' }}>Game Over!</h3>
                  <p style={{ fontSize: 'clamp(1rem, 3vw, 1.2rem)', marginBottom: '1.5rem', color: '#666' }}>
                    You reached level <strong>{level}</strong>.
                  </p>
                </>
              ) : (
                <>
                  <div style={{ fontSize: 'clamp(3rem, 10vw, 5rem)', marginBottom: '0.75rem' }}>⚡</div>
                  <h3 style={{ fontSize: 'clamp(1.4rem, 5vw, 2rem)', color: '#54a0ff', marginBottom: '0.75rem' }}>Spark Sequence</h3>
                  <p style={{ fontSize: 'clamp(1rem, 3vw, 1.2rem)', marginBottom: '1.5rem', color: '#666' }}>Test your focus and memory!</p>
                </>
              )}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button className="btn btn-primary" style={{ flex: '1 1 120px', maxWidth: 200 }} onClick={startGame}>
                  {gameState === 'gameover' ? '🔄 Try Again' : '▶ Start Game'}
                </button>
                <button className="btn" style={{ background: '#eee', flex: '1 1 120px', maxWidth: 200 }} onClick={() => { if (typeof onBack === 'function') onBack(); }}>
                  ← Main Menu
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SparkSequence;
