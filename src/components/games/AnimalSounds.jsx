import { useState, useCallback } from 'react';
import { playSound } from '../../utils/sounds';

const ANIMALS = [
  { name: 'Dog',      emoji: '🐶', sound: 'Woof!',   wrong: ['Moo!', 'Meow!', 'Baa!'] },
  { name: 'Cat',      emoji: '🐱', sound: 'Meow!',   wrong: ['Woof!', 'Oink!', 'Moo!'] },
  { name: 'Cow',      emoji: '🐮', sound: 'Moo!',    wrong: ['Meow!', 'Ribbit!', 'Baa!'] },
  { name: 'Duck',     emoji: '🦆', sound: 'Quack!',  wrong: ['Moo!', 'Woof!', 'Hiss!'] },
  { name: 'Sheep',    emoji: '🐑', sound: 'Baa!',    wrong: ['Oink!', 'Quack!', 'Woof!'] },
  { name: 'Pig',      emoji: '🐷', sound: 'Oink!',   wrong: ['Baa!', 'Moo!', 'Meow!'] },
  { name: 'Frog',     emoji: '🐸', sound: 'Ribbit!', wrong: ['Quack!', 'Woof!', 'Oink!'] },
  { name: 'Lion',     emoji: '🦁', sound: 'Roar!',   wrong: ['Moo!', 'Meow!', 'Baa!'] },
  { name: 'Elephant', emoji: '🐘', sound: 'Trumpet!',wrong: ['Roar!', 'Quack!', 'Woof!'] },
  { name: 'Horse',    emoji: '🐴', sound: 'Neigh!',  wrong: ['Moo!', 'Baa!', 'Oink!'] },
  { name: 'Owl',      emoji: '🦉', sound: 'Hoot!',   wrong: ['Quack!', 'Meow!', 'Woof!'] },
  { name: 'Snake',    emoji: '🐍', sound: 'Hiss!',   wrong: ['Baa!', 'Ribbit!', 'Roar!'] },
  { name: 'Monkey',   emoji: '🐵', sound: 'Ooh-ooh!',wrong: ['Woof!', 'Hoot!', 'Moo!'] },
  { name: 'Bee',      emoji: '🐝', sound: 'Buzz!',   wrong: ['Hiss!', 'Quack!', 'Ribbit!'] },
  { name: 'Rooster',  emoji: '🐓', sound: 'Cock-a-doodle-doo!', wrong: ['Quack!', 'Moo!', 'Baa!'] },
];

const TOTAL_LEVELS = ANIMALS.length;

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

const buildRound = (animalIndex) => {
  const animal = ANIMALS[animalIndex];
  const options = shuffle([animal.sound, ...animal.wrong.slice(0, 3)]);
  return { animal, options };
};

const AnimalSounds = ({ onBack }) => {
  const [level, setLevel] = useState(1);
  const [round, setRound] = useState(() => buildRound(0));
  const [feedback, setFeedback] = useState('');
  const [feedbackType, setFeedbackType] = useState('');
  const [gameWon, setGameWon] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);
  const [answered, setAnswered] = useState(false);

  const resetGame = useCallback(() => {
    setLevel(1);
    setRound(buildRound(0));
    setFeedback('');
    setFeedbackType('');
    setGameWon(false);
    setAnswered(false);
  }, []);

  const handlePick = (option) => {
    if (answered || gameWon) return;

    if (option === round.animal.sound) {
      playSound('match');
      setFeedback('🎉 That\'s right! Great job!');
      setFeedbackType('correct');
      setAnswered(true);

      setTimeout(() => {
        if (level === TOTAL_LEVELS) {
          setGameWon(true);
        } else {
          const nextLevel = level + 1;
          setLevel(nextLevel);
          setRound(buildRound(nextLevel - 1));
          setFeedback('');
          setFeedbackType('');
          setAnswered(false);
        }
      }, 900);
    } else {
      playSound('wrong');
      setFeedback('Oops! Try again!');
      setFeedbackType('wrong');
      setShakeKey((k) => k + 1);
      setTimeout(() => {
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
          <h2>Animal Expert!</h2>
          <p>You knew all {TOTAL_LEVELS} animal sounds! Amazing!</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={resetGame}>Play Again</button>
            <button className="btn" style={{ background: '#eee' }} onClick={() => typeof onBack === 'function' && onBack()}>
              Main Menu
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="game-header">
            <div>Animal Sounds</div>
            <div>Level {level} / {TOTAL_LEVELS}</div>
            <div className="progress-container">
              <div className="progress-bar" style={{ width: `${((level - 1) / TOTAL_LEVELS) * 100}%` }} />
            </div>
          </div>

          <p style={{ textAlign: 'center', color: '#666', marginBottom: '1.5rem', fontWeight: 600 }}>
            What sound does this animal make? 🔊
          </p>

          <div className="animal-display" key={shakeKey}>
            <div className="animal-emoji">{round.animal.emoji}</div>
            <div className="animal-name">{round.animal.name}</div>
          </div>

          <div className="sound-options">
            {round.options.map((opt, i) => (
              <button
                key={i}
                className={`sound-btn${answered && opt === round.animal.sound ? ' correct-sound' : ''}`}
                onClick={() => handlePick(opt)}
                disabled={answered}
              >
                {opt}
              </button>
            ))}
          </div>

          {feedback && (
            <div className={`sound-feedback ${feedbackType}`}>
              {feedback}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button className="btn btn-primary" style={{ background: '#eee', color: '#333' }}
              onClick={() => typeof onBack === 'function' && onBack()}>
              Main Menu
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AnimalSounds;
