import { useState } from 'react';
import { playSound } from '../../utils/sounds';

const WORD_LEVELS = [
  { word: 'CAT', emoji: '🐱' },
  { word: 'DOG', emoji: '🐶' },
  { word: 'FROG', emoji: '🐸' },
  { word: 'LION', emoji: '🦁' },
  { word: 'BEAR', emoji: '🐻' },
  { word: 'BIRD', emoji: '🐦' },
  { word: 'FISH', emoji: '🐟' },
  { word: 'CRAB', emoji: '🦀' },
  { word: 'PANDA', emoji: '🐼' },
  { word: 'PIZZA', emoji: '🍕' },
  { word: 'ROCKET', emoji: '🚀' },
  { word: 'BALLOON', emoji: '🎈' },
  { word: 'CUPCAKE', emoji: '🧁' },
  { word: 'MONKEY', emoji: '🐒' },
  { word: 'BANANA', emoji: '🍌' },
  { word: 'FLOWER', emoji: '🌸' },
  { word: 'APPLE', emoji: '🍎' },
  { word: 'TIGER', emoji: '🐯' },
  { word: 'ROCKET', emoji: '🚀' },
  { word: 'SUNNY', emoji: '☀️' }
];

const TOTAL_LEVELS = 20;

const shuffle = (array) => [...array].sort(() => Math.random() - 0.5);

const createWordState = (question) => {
  if (!question) return { slots: [], tiles: [] };
  const word = question.word;
  const slots = Array.from({ length: word.length }, () => null);

  let letters = word.split('');
  if (word.length <= 4) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 0; i < 2; i++) {
      letters.push(alphabet[Math.floor(Math.random() * alphabet.length)]);
    }
  }

  let scrambled = shuffle(letters);
  let retries = 0;
  while (scrambled.join('').substring(0, word.length) === word && retries < 20) {
    scrambled = shuffle(scrambled);
    retries++;
  }

  const tiles = scrambled.map((letter, idx) => ({
    id: `${question.word}-${idx}`,
    letter,
    used: false
  }));

  return { slots, tiles };
};

const WordBuilder = ({ onBack }) => {
  const [level, setLevel] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(() => WORD_LEVELS[Math.floor(Math.random() * WORD_LEVELS.length)]);
  const [selectedSlots, setSelectedSlots] = useState(() => createWordState(currentQuestion).slots);
  const [scrambledTiles, setScrambledTiles] = useState(() => createWordState(currentQuestion).tiles);
  const [isCorrect, setIsCorrect] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [message, setMessage] = useState('Build the word for the emoji!');
  const [gameWon, setGameWon] = useState(false);

  const loadLevel = (nextLevel) => {
    if (nextLevel > TOTAL_LEVELS) {
      setGameWon(true);
      return;
    }

    const nextQuestion = WORD_LEVELS[Math.floor(Math.random() * WORD_LEVELS.length)];
    setLevel(nextLevel);
    setCurrentQuestion(nextQuestion);
    setIsCorrect(false);
    setHasError(false);
    setMessage('Build the word for the emoji!');

    const { slots, tiles } = createWordState(nextQuestion);
    setSelectedSlots(slots);
    setScrambledTiles(tiles);
  };

  const resetGame = () => {
    setGameWon(false);
    setLevel(1);
    loadLevel(1);
  };

  const handleTileClick = (tile) => {
    if (isCorrect || tile.used || gameWon) return;

    playSound('pop');

    const emptyIdx = selectedSlots.findIndex((slot) => slot === null);
    if (emptyIdx === -1) return;

    const newSlots = [...selectedSlots];
    newSlots[emptyIdx] = { letter: tile.letter, tileId: tile.id };
    setSelectedSlots(newSlots);

    const newTiles = scrambledTiles.map((t) =>
      t.id === tile.id ? { ...t, used: true } : t
    );
    setScrambledTiles(newTiles);

    if (emptyIdx === selectedSlots.length - 1) {
      const spelledWord = newSlots.map((s) => s.letter).join('');
      if (spelledWord === currentQuestion.word) {
        playSound('match');
        setIsCorrect(true);
        setMessage('Correct! Well done!');

        setTimeout(() => {
          if (level === TOTAL_LEVELS) {
            setGameWon(true);
          } else {
            playSound('celebrate');
            loadLevel(level + 1);
          }
        }, 900);
      } else {
        playSound('wrong');
        setHasError(true);
        setMessage('Try again!');
        setTimeout(() => {
          setHasError(false);
          setSelectedSlots(Array.from({ length: currentQuestion.word.length }, () => null));
          setScrambledTiles(scrambledTiles.map((t) => ({ ...t, used: false })));
          setMessage('Build the word for the emoji!');
        }, 800);
      }
    }
  };

  const handleSlotClick = (slotIdx) => {
    const slot = selectedSlots[slotIdx];
    if (!slot || isCorrect || gameWon) return;

    playSound('pop');

    const newTiles = scrambledTiles.map((t) =>
      t.id === slot.tileId ? { ...t, used: false } : t
    );
    setScrambledTiles(newTiles);

    const newSlots = [...selectedSlots];
    newSlots[slotIdx] = null;
    setSelectedSlots(newSlots);
  };

  const handleHint = () => {
    if (isCorrect || gameWon) return;

    playSound('pop');

    const firstEmptyOrWrongIdx = selectedSlots.findIndex((slot, idx) => {
      return slot === null || slot.letter !== currentQuestion.word[idx];
    });

    if (firstEmptyOrWrongIdx === -1) return;

    const existingSlot = selectedSlots[firstEmptyOrWrongIdx];
    let currentTiles = [...scrambledTiles];
    let currentSlots = [...selectedSlots];

    if (existingSlot) {
      currentTiles = currentTiles.map((t) =>
        t.id === existingSlot.tileId ? { ...t, used: false } : t
      );
      currentSlots[firstEmptyOrWrongIdx] = null;
    }

    const targetLetter = currentQuestion.word[firstEmptyOrWrongIdx];
    const correctTileIdx = currentTiles.findIndex((t) => t.letter === targetLetter && !t.used);

    if (correctTileIdx !== -1) {
      currentTiles[correctTileIdx].used = true;
      currentSlots[firstEmptyOrWrongIdx] = {
        letter: targetLetter,
        tileId: currentTiles[correctTileIdx].id
      };

      setScrambledTiles(currentTiles);
      setSelectedSlots(currentSlots);
    }
  };

  return (
    <div className="game-view pop-in">
      <p style={{ textAlign: 'center', margin: '0 0 1.5rem', color: '#666' }}>
        Spell the word for the emoji! ✏️
      </p>

      {gameWon ? (
        <div className="champion-screen">
          <div style={{ fontSize: '4rem' }}>🏆</div>
          <h2>Word Master!</h2>
          <p>You completed all 20 word-building levels.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <button className="btn btn-primary" onClick={resetGame}>Play Again</button>
            <button className="btn" style={{ background: '#eee' }} onClick={() => { if (typeof onBack === 'function') onBack(); }}>Main Menu</button>
          </div>
        </div>
      ) : (
        <>
          <div className="game-header">
            <div>Word Builder</div>
            <div>Level {level} / {TOTAL_LEVELS}</div>
            <div>{currentQuestion.word.length} letters</div>
            <div className="progress-container">
              <div className="progress-bar" style={{ width: `${(level / TOTAL_LEVELS) * 100}%` }} />
            </div>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--color-accent)', fontWeight: 700 }}>
            {message}
          </div>

          <div className="word-emoji-display pop-in">{currentQuestion.emoji}</div>

          <div className={`letter-slots-container ${hasError ? 'shake' : ''}`}>
            {selectedSlots.map((slot, idx) => (
              <div
                key={idx}
                className={`letter-slot ${slot ? 'filled' : ''} ${hasError ? 'error' : ''}`}
                onClick={() => handleSlotClick(idx)}
              >
                {slot ? slot.letter : ''}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '1rem', margin: '1rem 0' }}>
            <button className="btn" style={{ background: '#ffb703', color: 'white', padding: '0.6rem 1.2rem', fontSize: '1rem' }} onClick={handleHint}>
              💡 Hint
            </button>
            <button className="btn" style={{ background: '#cbd5e1', color: '#333', padding: '0.6rem 1.2rem', fontSize: '1rem' }} onClick={resetGame}>
              🔄 Reset
            </button>
          </div>

          <div className="letter-tiles-container">
            {scrambledTiles.map((tile) => (
              <button
                key={tile.id}
                className={`letter-tile ${tile.used ? 'used' : ''}`}
                onClick={() => handleTileClick(tile)}
                disabled={tile.used || isCorrect}
              >
                {tile.letter}
              </button>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <button className="btn btn-primary" onClick={() => { if (typeof onBack === 'function') onBack(); }}>Main Menu</button>
          </div>
        </>
      )}
    </div>
  );
};

export default WordBuilder;
