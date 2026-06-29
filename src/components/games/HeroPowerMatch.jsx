import { useState, useCallback } from 'react';
import { playSound } from '../../utils/sounds';

const HEROES = [
  { name: 'Super Sam',     emoji: '🦸',  power: 'Can fly! ✈️',         wrong: ['Shoots webs! 🕸️', 'Super speed! 💨', 'Freezes things! ❄️'] },
  { name: 'Spider Stevie', emoji: '🕷️',  power: 'Shoots webs! 🕸️',     wrong: ['Can fly! ✈️', 'Super strength! 💪', 'Controls weather! ⛈️'] },
  { name: 'Flash Frankie', emoji: '⚡',  power: 'Super speed! 💨',      wrong: ['Shoots webs! 🕸️', 'Freezes things! ❄️', 'Can fly! ✈️'] },
  { name: 'Ice Queen Iris',emoji: '🧊',  power: 'Freezes things! ❄️',  wrong: ['Super speed! 💨', 'Can fly! ✈️', 'Super strength! 💪'] },
  { name: 'Smash Sam',     emoji: '💪',  power: 'Super strength! 💪',   wrong: ['Freezes things! ❄️', 'Shoots webs! 🕸️', 'Magic shield! 🛡️'] },
  { name: 'Magnet Max',    emoji: '🧲',  power: 'Controls metal! 🔩',   wrong: ['Super strength! 💪', 'Super speed! 💨', 'Shoots webs! 🕸️'] },
  { name: 'Cloud Carl',    emoji: '⛈️',  power: 'Controls weather! ⛈️', wrong: ['Can fly! ✈️', 'Controls metal! 🔩', 'Freezes things! ❄️'] },
  { name: 'Shield Stella', emoji: '🛡️',  power: 'Magic shield! 🛡️',    wrong: ['Controls weather! ⛈️', 'Super strength! 💪', 'Super speed! 💨'] },
  { name: 'Wonder Wendy',  emoji: '🌟',  power: 'Magic lasso! 🌀',      wrong: ['Magic shield! 🛡️', 'Can fly! ✈️', 'Controls metal! 🔩'] },
  { name: 'Robo Rex',      emoji: '🤖',  power: 'Laser beams! 🔴',      wrong: ['Magic lasso! 🌀', 'Freezes things! ❄️', 'Super speed! 💨'] },
  { name: 'Aqua Andy',     emoji: '🌊',  power: 'Talks to fish! 🐟',    wrong: ['Shoots webs! 🕸️', 'Can fly! ✈️', 'Super speed! 💨'] },
  { name: 'Bat Bob',       emoji: '🦇',  power: 'Rich gadgets! 🦇',     wrong: ['Controls metal! 🔩', 'Magic lasso! 🌀', 'Laser beams! 🔴'] },
  { name: 'Super Sally',   emoji: '🦸‍♀️', power: 'Laser vision! 👀',     wrong: ['Shoots webs! 🕸️', 'Magic shield! 🛡️', 'Freezes things! ❄️'] },
  { name: 'Wolf Wayne',    emoji: '🐺',  power: 'Sharp claws! 🔪',      wrong: ['Can fly! ✈️', 'Controls weather! ⛈️', 'Super speed! 💨'] },
  { name: 'Cyclops Cy',    emoji: '🔴',  power: 'Optic blast! 💥',      wrong: ['Talks to fish! 🐟', 'Super strength! 💪', 'Shoots webs! 🕸️'] },
  { name: 'Hulk Harry',    emoji: '💚',  power: 'Gamma smash! 🟢',      wrong: ['Magic lasso! 🌀', 'Controls metal! 🔩', 'Super speed! 💨'] },
  { name: 'Panther Pat',   emoji: '🐾',  power: 'Vibranium suit! 🐈',   wrong: ['Can fly! ✈️', 'Talks to fish! 🐟', 'Freezes things! ❄️'] },
  { name: 'Iron Izzy',     emoji: '🦾',  power: 'Robot armor! 🤖',      wrong: ['Controls weather! ⛈️', 'Super strength! 💪', 'Shoots webs! 🕸️'] },
  { name: 'Thor Tom',      emoji: '🔨',  power: 'Magic hammer! 🔨',     wrong: ['Rich gadgets! 🦇', 'Magic lasso! 🌀', 'Laser beams! 🔴'] },
  { name: 'Ant Andy',      emoji: '🐜',  power: 'Shrinks tiny! 🐜',     wrong: ['Magic hammer! 🔨', 'Talks to fish! 🐟', 'Super strength! 💪'] },
];

const TOTAL_ROUNDS = 20;
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

const buildRound = (level) => {
  const hero = HEROES[level - 1];
  const options = shuffle([hero.power, ...hero.wrong.slice(0, 3)]);
  return { hero, options };
};

const HeroPowerMatch = ({ onBack }) => {
  const [level, setLevel] = useState(1);
  const [round, setRound] = useState(() => buildRound(1));
  const [feedback, setFeedback] = useState('');
  const [feedbackType, setFeedbackType] = useState('');
  const [gameWon, setGameWon] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [picked, setPicked] = useState(null);

  const resetGame = useCallback(() => {
    setLevel(1);
    setRound(buildRound(1));
    setFeedback('');
    setFeedbackType('');
    setGameWon(false);
    setAnswered(false);
    setPicked(null);
  }, []);

  const handlePick = (power) => {
    if (answered || gameWon) return;
    setPicked(power);
    if (power === round.hero.power) {
      playSound('match');
      setFeedback('🦸 Super! You know your heroes!');
      setFeedbackType('correct');
      setAnswered(true);
      setTimeout(() => {
        if (level === TOTAL_ROUNDS) {
          setGameWon(true);
        } else {
          const next = level + 1;
          setLevel(next);
          setRound(buildRound(next));
          setFeedback('');
          setFeedbackType('');
          setAnswered(false);
          setPicked(null);
        }
      }, 900);
    } else {
      playSound('wrong');
      setFeedback("That's not right! Try again! 🤔");
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
          <h2>Hero Expert!</h2>
          <p>You know every hero's superpower! Amazing!</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={resetGame}>Play Again</button>
            <button className="btn" style={{ background: '#eee' }} onClick={() => typeof onBack === 'function' && onBack()}>Main Menu</button>
          </div>
        </div>
      ) : (
        <>
          <div className="game-header">
            <div>Hero Power Match</div>
            <div>Round {level} / {TOTAL_ROUNDS}</div>
            <div className="progress-container">
              <div className="progress-bar" style={{ width: `${((level - 1) / TOTAL_ROUNDS) * 100}%` }} />
            </div>
          </div>

          <p style={{ textAlign: 'center', color: '#666', marginBottom: '0.5rem', fontWeight: 600 }}>
            What is this hero's superpower? 🦸
          </p>

          <div className="hero-display">
            <div className="hero-emoji">{round.hero.emoji}</div>
            <div className="hero-name">{round.hero.name}</div>
          </div>

          <div className="hero-options">
            {round.options.map((power) => {
              let cls = 'hero-power-btn';
              if (picked === power) {
                cls += power === round.hero.power ? ' hero-correct' : ' hero-wrong';
              }
              return (
                <button key={power} className={cls} onClick={() => handlePick(power)} disabled={answered}>
                  {power}
                </button>
              );
            })}
          </div>

          {feedback && (
            <div className={`sound-feedback ${feedbackType}`}>{feedback}</div>
          )}

          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <button className="btn" style={{ background: '#eee', color: '#333' }}
              onClick={() => typeof onBack === 'function' && onBack()}>Main Menu</button>
          </div>
        </>
      )}
    </div>
  );
};

export default HeroPowerMatch;
