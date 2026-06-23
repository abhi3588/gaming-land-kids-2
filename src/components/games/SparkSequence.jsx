import { useState, useEffect, useRef } from 'react';
import { playSound } from '../../utils/sounds';

// Setup Audio Context lazily
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let localAudioCtx = null;

const playTone = (frequency, duration = 0.4) => {
  if (!localAudioCtx) {
    localAudioCtx = new AudioCtx();
  }
  if (localAudioCtx.state === 'suspended') {
    localAudioCtx.resume();
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
    localAudioCtx = new AudioCtx();
  }
  if (localAudioCtx.state === 'suspended') {
    localAudioCtx.resume();
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

// Pad color mapping and frequencies
const PADS = [
  { id: 0, colorClass: 'red', freq: 261.63 },    // C4
  { id: 1, colorClass: 'blue', freq: 293.66 },   // D4
  { id: 2, colorClass: 'yellow', freq: 329.63 }, // E4
  { id: 3, colorClass: 'green', freq: 349.23 }   // F4
];

// Helper defined outside component for purity
const getRandomPadIndex = () => Math.floor(Math.random() * 4);

const SparkSequence = ({ onBack }) => {
  const [sequence, setSequence] = useState([]);
  const [userSequence, setUserSequence] = useState([]);
  const [activePad, setActivePad] = useState(null);
  const [isPlayingSeq, setIsPlayingSeq] = useState(false);
  const [score, setScore] = useState(0);
  
  // Initialize highScore synchronously
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('spark_highscore');
    return saved ? parseInt(saved) : 0;
  });

  const [gameState, setGameState] = useState('idle'); // 'idle', 'playing', 'gameover'
  const [message, setMessage] = useState('Watch the lights!');

  const timeoutsRef = useRef([]);

  useEffect(() => {
    // Copy current array of timeouts to clear them correctly
    const timeouts = timeoutsRef.current;
    return () => {
      timeouts.forEach(t => clearTimeout(t));
    };
  }, []);

  const addTimeout = (fn, delay) => {
    const id = setTimeout(fn, delay);
    timeoutsRef.current.push(id);
    return id;
  };

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    const startSeq = [getRandomPadIndex()];
    setSequence(startSeq);
    setUserSequence([]);
    addTimeout(() => runSequence(startSeq), 600);
  };

  const runSequence = async (seq) => {
    setIsPlayingSeq(true);
    setMessage('Watch the pattern!');
    
    const delay = (ms) => new Promise(resolve => addTimeout(resolve, ms));
    await delay(300);

    for (let i = 0; i < seq.length; i++) {
      const padId = seq[i];
      const pad = PADS.find(p => p.id === padId);
      
      setActivePad(padId);
      playTone(pad.freq, 0.45);
      
      await delay(500);
      setActivePad(null);
      await delay(200);
    }

    setIsPlayingSeq(false);
    setMessage('Your turn! Copy it!');
  };

  const handlePadClick = (id) => {
    if (isPlayingSeq || gameState !== 'playing') return;

    setActivePad(id);
    const pad = PADS.find(p => p.id === id);
    playTone(pad.freq, 0.35);

    addTimeout(() => {
      setActivePad(null);
    }, 200);

    const nextIndex = userSequence.length;
    
    if (sequence[nextIndex] === id) {
      const newSeq = [...userSequence, id];
      setUserSequence(newSeq);

      if (newSeq.length === sequence.length) {
        const nextScore = score + 1;
        setScore(nextScore);

        if (nextScore > highScore) {
          setHighScore(nextScore);
          localStorage.setItem('spark_highscore', nextScore.toString());
        }

        setMessage('Correct! 🎉');
        playSound('match');

        const newSequence = [...sequence, getRandomPadIndex()];
        setSequence(newSequence);
        setUserSequence([]);

        addTimeout(() => {
          runSequence(newSequence);
        }, 1000);
      }
    } else {
      playWrongBuzz();
      setGameState('gameover');
      setMessage('Game Over! ❌');
    }
  };

  return (
    <div className="game-view pop-in">
      <h2>Spark Sequence</h2>
      <p style={{ textAlign: 'center', margin: '-0.5rem 0 1.5rem', color: '#666' }}>
        Repeat the lights and sounds sequence! ⚡
      </p>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', padding: '0 10px', fontSize: '1.2rem', color: 'var(--color-accent)', marginBottom: '1.5rem' }}>
        <div>Score: {score}</div>
        <div>High Score: {highScore}🏆</div>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <p style={{ fontSize: '1.4rem', fontWeight: 'bold', color: isPlayingSeq ? 'var(--color-primary)' : 'var(--color-accent)' }}>
          {message}
        </p>
      </div>

      {gameState === 'playing' ? (
        <div className="spark-grid">
          {PADS.map(pad => (
            <div
              key={pad.id}
              className={`spark-pad ${pad.colorClass} ${activePad === pad.id ? 'active' : ''}`}
              onClick={() => handlePadClick(pad.id)}
              style={{
                pointerEvents: isPlayingSeq ? 'none' : 'auto'
              }}
            />
          ))}
        </div>
      ) : (
        <div style={{ 
          textAlign: 'center', 
          background: 'white', 
          borderRadius: '24px', 
          padding: '3rem 2rem', 
          boxShadow: 'var(--shadow-pop)',
          border: '4px solid ' + (gameState === 'gameover' ? 'var(--color-soft-pink)' : 'var(--color-soft-blue)')
        }}>
          {gameState === 'gameover' ? (
            <>
              <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>💥</div>
              <h3 style={{ fontSize: '2rem', color: 'var(--color-secondary)', marginBottom: '1rem' }}>Game Over!</h3>
              <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: '#666' }}>
                You reached a sequence length of <strong>{score}</strong>.
              </p>
            </>
          ) : (
            <>
              <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>⚡</div>
              <h3 style={{ fontSize: '2rem', color: 'var(--color-primary)', marginBottom: '1rem' }}>Spark Sequence</h3>
              <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: '#666' }}>Test your focus and memory!</p>
            </>
          )}

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <button className="btn btn-primary" onClick={startGame}>
              {gameState === 'gameover' ? 'Try Again' : 'Start Game'}
            </button>
            <button className="btn" style={{ background: '#eee' }} onClick={onBack}>Main Menu</button>
          </div>
        </div>
      )}

      {gameState === 'playing' && (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button className="btn btn-primary" style={{ background: '#eee', color: '#333' }} onClick={onBack}>Main Menu</button>
        </div>
      )}
    </div>
  );
};

export default SparkSequence;
