import { useState } from 'react';
import { playSound } from '../../utils/sounds';

const WORD_DATABASE = [
  { word: 'CAT', emoji: '🐱' },
  { word: 'DOG', emoji: '🐶' },
  { word: 'FROG', emoji: '🐸' },
  { word: 'LION', emoji: '🦁' },
  { word: 'FISH', emoji: '🐟' },
  { word: 'BIRD', emoji: '🐦' },
  { word: 'BEAR', emoji: '🐻' },
  { word: 'CRAB', emoji: '🦀' },
  { word: 'PANDA', emoji: '🐼' },
  { word: 'PIZZA', emoji: '🍕' },
  { word: 'ROCKET', emoji: '🚀' },
  { word: 'BALLOON', emoji: '🎈' },
  { word: 'CUPCAKE', emoji: '🧁' },
  { word: 'MONKEY', emoji: '🐒' },
  { word: 'BANANA', emoji: '🍌' },
  { word: 'FLOWER', emoji: '🌸' }
];

// Helper functions defined outside the component for purity
const shuffle = (array) => {
  return [...array].sort(() => Math.random() - 0.5);
};

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
  while (scrambled.join('').substring(0, word.length) === word) {
    scrambled = shuffle(scrambled);
  }

  const tiles = scrambled.map((letter, idx) => ({
    id: idx,
    letter,
    used: false
  }));

  return { slots, tiles };
};

const WordBuilder = ({ onBack }) => {
  // Initialize state synchronously using lazy initializers
  const [db, setDb] = useState(() => shuffle(WORD_DATABASE));
  const [wordIndex, setWordIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(() => db[0]);
  
  const [selectedSlots, setSelectedSlots] = useState(() => {
    const { slots } = createWordState(db[0]);
    return slots;
  });
  const [scrambledTiles, setScrambledTiles] = useState(() => {
    const { tiles } = createWordState(db[0]);
    return tiles;
  });

  const [isCorrect, setIsCorrect] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [streak, setStreak] = useState(0);

  const initGame = () => {
    const shuffledDb = shuffle(WORD_DATABASE);
    setDb(shuffledDb);
    setWordIndex(0);
    loadWord(shuffledDb[0]);
    setStreak(0);
  };

  const loadWord = (question) => {
    if (!question) return;
    
    setCurrentQuestion(question);
    setIsCorrect(false);
    setHasError(false);

    const { slots, tiles } = createWordState(question);
    setSelectedSlots(slots);
    setScrambledTiles(tiles);
  };

  const handleTileClick = (tile) => {
    if (isCorrect || tile.used) return;

    playSound('pop');
    
    const emptyIdx = selectedSlots.findIndex(slot => slot === null);
    if (emptyIdx === -1) return;

    const newSlots = [...selectedSlots];
    newSlots[emptyIdx] = { letter: tile.letter, tileId: tile.id };
    setSelectedSlots(newSlots);

    const newTiles = scrambledTiles.map(t => 
      t.id === tile.id ? { ...t, used: true } : t
    );
    setScrambledTiles(newTiles);

    if (emptyIdx === selectedSlots.length - 1) {
      const spelledWord = newSlots.map(s => s.letter).join('');
      if (spelledWord === currentQuestion.word) {
        playSound('match');
        setIsCorrect(true);
        setStreak(streak + 1);
        
        setTimeout(() => {
          playSound('celebrate');
          const nextIndex = wordIndex + 1;
          if (nextIndex < db.length) {
            setWordIndex(nextIndex);
            loadWord(db[nextIndex]);
          } else {
            initGame();
          }
        }, 1200);
      } else {
        playSound('wrong');
        setHasError(true);
        setTimeout(() => {
          setHasError(false);
          setSelectedSlots(Array.from({ length: currentQuestion.word.length }, () => null));
          setScrambledTiles(scrambledTiles.map(t => ({ ...t, used: false })));
        }, 800);
      }
    }
  };

  const handleSlotClick = (slotIdx) => {
    const slot = selectedSlots[slotIdx];
    if (!slot || isCorrect) return;

    playSound('pop');

    const newTiles = scrambledTiles.map(t => 
      t.id === slot.tileId ? { ...t, used: false } : t
    );
    setScrambledTiles(newTiles);

    const newSlots = [...selectedSlots];
    newSlots[slotIdx] = null;
    setSelectedSlots(newSlots);
  };

  const handleHint = () => {
    if (isCorrect) return;

    playSound('pop');

    const firstEmptyOrWrongIdx = selectedSlots.findIndex((slot, idx) => {
      return slot === null || slot.letter !== currentQuestion.word[idx];
    });

    if (firstEmptyOrWrongIdx === -1) return;

    const existingSlot = selectedSlots[firstEmptyOrWrongIdx];
    let currentTiles = [...scrambledTiles];
    let currentSlots = [...selectedSlots];

    if (existingSlot) {
      currentTiles = currentTiles.map(t => 
        t.id === existingSlot.tileId ? { ...t, used: false } : t
      );
      currentSlots[firstEmptyOrWrongIdx] = null;
    }

    const targetLetter = currentQuestion.word[firstEmptyOrWrongIdx];
    const correctTileIdx = currentTiles.findIndex(t => t.letter === targetLetter && !t.used);
    
    if (correctTileIdx !== -1) {
      currentTiles[correctTileIdx].used = true;
      currentSlots[firstEmptyOrWrongIdx] = { 
        letter: targetLetter, 
        tileId: currentTiles[correctTileIdx].id 
      };

      setScrambledTiles(currentTiles);
      setSelectedSlots(currentSlots);

      if (currentSlots.every(s => s !== null)) {
        const spelledWord = currentSlots.map(s => s.letter).join('');
        if (spelledWord === currentQuestion.word) {
          playSound('match');
          setIsCorrect(true);
          setStreak(streak + 1);
          setTimeout(() => {
            playSound('celebrate');
            const nextIndex = wordIndex + 1;
            if (nextIndex < db.length) {
              setWordIndex(nextIndex);
              loadWord(db[nextIndex]);
            } else {
              initGame();
            }
          }, 1200);
        }
      }
    }
  };

  return (
    <div className="game-view pop-in">
      <h2>Word Builder</h2>
      <p style={{ textAlign: 'center', margin: '-0.5rem 0 1.5rem', color: '#666' }}>
        Spell the word for the emoji! ✏️
      </p>

      {currentQuestion && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ alignSelf: 'stretch', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', padding: '0 10px', fontSize: '1.2rem', color: 'var(--color-accent)' }}>
            <div>Streak: {streak} 🔥</div>
            <div>Word: {wordIndex + 1}/{db.length}</div>
          </div>

          <div className="word-emoji-display pop-in">
            {currentQuestion.emoji}
          </div>

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
            <button className="btn" style={{ background: '#cbd5e1', color: '#333', padding: '0.6rem 1.2rem', fontSize: '1rem' }} onClick={initGame}>
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
        </div>
      )}

      <div style={{ textAlign: 'center', marginTop: '3rem' }}>
        <button className="btn btn-primary" onClick={onBack}>Main Menu</button>
      </div>
    </div>
  );
};

export default WordBuilder;
