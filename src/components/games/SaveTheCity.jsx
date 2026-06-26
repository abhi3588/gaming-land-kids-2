import { useState, useCallback } from 'react';
import { playSound } from '../../utils/sounds';

const HEROES = [
  { id: 'sam',    name: 'Super Sam',     emoji: '🦸',  power: 'fly' },
  { id: 'stevie', name: 'Spider Stevie', emoji: '🕷️',  power: 'webs' },
  { id: 'frankie',name: 'Flash Frankie', emoji: '⚡',  power: 'speed' },
  { id: 'iris',   name: 'Ice Queen Iris',emoji: '🧊',  power: 'freeze' },
  { id: 'smash',  name: 'Smash Sam',     emoji: '💪',  power: 'strength' },
  { id: 'max',    name: 'Magnet Max',    emoji: '🧲',  power: 'metal' },
];

const ROUNDS = [
  {
    danger: '🔥 A huge FIRE is burning the park!',
    answer: 'iris',
    hint:   'Who can freeze the fire?',
  },
  {
    danger: '🐱 A kitten is stuck high in a tree!',
    answer: 'stevie',
    hint:   'Who can climb walls and swing up there?',
  },
  {
    danger: '🚂 A runaway train is going too fast!',
    answer: 'max',
    hint:   'Who can control metal and stop it?',
  },
  {
    danger: '🌊 Floodwater is filling the street!',
    answer: 'iris',
    hint:   'Who can freeze the water solid?',
  },
  {
    danger: '🪨 A giant boulder is rolling downhill!',
    answer: 'smash',
    hint:   'Who is strong enough to stop it?',
  },
  {
    danger: '🎈 A balloon is floating to the clouds!',
    answer: 'sam',
    hint:   'Who can fly up and catch it?',
  },
  {
    danger: '🤖 A runaway robot is loose in town!',
    answer: 'max',
    hint:   'Who can control metal parts and shut it down?',
  },
  {
    danger: '🏗️ A bridge is about to break!',
    answer: 'smash',
    hint:   'Who has the strength to hold it together?',
  },
  {
    danger: '🐻 A bear is chasing the picnic goers!',
    answer: 'frankie',
    hint:   'Who is fast enough to lead it away safely?',
  },
  {
    danger: '❄️ Everything is frozen and icy cold!',
    answer: 'smash',
    hint:   'Who is strong enough to break the ice?',
  },
  {
    danger: '🕸️ Sticky webs are blocking the road!',
    answer: 'stevie',
    hint:   'Who made the webs and can clear them?',
  },
  {
    danger: '🚑 Someone needs help RIGHT NOW!',
    answer: 'frankie',
    hint:   'Who is fast enough to get there in seconds?',
  },
];

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

const SaveTheCity = ({ onBack }) => {
  const [order] = useState(() => shuffle([...ROUNDS]));
  const [levelIndex, setLevelIndex] = useState(0);
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [feedbackType, setFeedbackType] = useState('');
  const [gameWon, setGameWon] = useState(false);
  const [score, setScore] = useState(0);
  const [heroOptions] = useState(() => shuffle([...HEROES]));

  const current = order[levelIndex];
  const TOTAL = order.length;

  const resetGame = useCallback(() => {
    setLevelIndex(0);
    setPicked(null);
    setFeedback('');
    setFeedbackType('');
    setGameWon(false);
    setScore(0);
  }, []);

  const handlePick = (heroId) => {
    if (picked || gameWon) return;
    setPicked(heroId);
    if (heroId === current.answer) {
      playSound('match');
      setFeedback('🦸 The city is saved! Great pick!');
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
      }, 950);
    } else {
      playSound('wrong');
      setFeedback("Hmm, not quite! Think again! 🤔");
      setFeedbackType('wrong');
      setTimeout(() => {
        setPicked(null);
        setFeedback('');
        setFeedbackType('');
      }, 750);
    }
  };

  const correctHero = HEROES.find((h) => h.id === current?.answer);

  return (
    <div className="game-view pop-in">
      {gameWon ? (
        <div className="champion-screen">
          <div style={{ fontSize: '4rem' }}>🏙️</div>
          <h2>City Defender!</h2>
          <p>You saved the city {score} out of {TOTAL} times! Incredible!</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={resetGame}>Play Again</button>
            <button className="btn" style={{ background: '#eee' }} onClick={() => typeof onBack === 'function' && onBack()}>Main Menu</button>
          </div>
        </div>
      ) : (
        <>
          <div className="game-header">
            <div>Save the City</div>
            <div>Round {levelIndex + 1} / {TOTAL}</div>
            <div>Score: {score}</div>
            <div className="progress-container">
              <div className="progress-bar" style={{ width: `${(levelIndex / TOTAL) * 100}%` }} />
            </div>
          </div>

          <div className="city-danger-box">
            <div className="city-danger-text">{current.danger}</div>
            <div className="city-hint">👇 {current.hint}</div>
          </div>

          <div className="city-hero-grid">
            {heroOptions.map((hero) => {
              let cls = 'city-hero-btn';
              if (picked === hero.id) {
                cls += hero.id === current.answer ? ' city-correct' : ' city-wrong';
              }
              return (
                <button key={hero.id} className={cls} onClick={() => handlePick(hero.id)} disabled={!!picked}>
                  <span className="city-hero-emoji">{hero.emoji}</span>
                  <span className="city-hero-name">{hero.name}</span>
                </button>
              );
            })}
          </div>

          {feedback && (
            <div className={`sound-feedback ${feedbackType}`}>{feedback}</div>
          )}

          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <button className="btn" style={{ background: '#eee', color: '#333' }}
              onClick={() => typeof onBack === 'function' && onBack()}>Main Menu</button>
          </div>
        </>
      )}
    </div>
  );
};

export default SaveTheCity;
