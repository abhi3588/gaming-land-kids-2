import { useState, useCallback, useEffect } from 'react';
import { playSound } from '../../utils/sounds';

const WORDS = [
  { word: 'CAT',     hint: '🐱', clue: 'A furry pet that meows' },
  { word: 'DOG',     hint: '🐶', clue: 'A loyal pet that barks' },
  { word: 'SUN',     hint: '☀️', clue: 'It shines bright in the sky' },
  { word: 'CAKE',    hint: '🎂', clue: 'Sweet treat on your birthday' },
  { word: 'FISH',    hint: '🐟', clue: 'Lives in water and swims' },
  { word: 'BIRD',    hint: '🐦', clue: 'It has wings and can fly' },
  { word: 'TREE',    hint: '🌳', clue: 'Tall plant with leaves' },
  { word: 'MOON',    hint: '🌙', clue: 'Shines in the night sky' },
  { word: 'STAR',    hint: '⭐', clue: 'Twinkles high above' },
  { word: 'FROG',    hint: '🐸', clue: 'Jumps and says ribbit' },
  { word: 'RAIN',    hint: '🌧️', clue: 'Falls from clouds' },
  { word: 'APPLE',   hint: '🍎', clue: 'A crunchy red or green fruit' },
  { word: 'HOUSE',   hint: '🏠', clue: 'Where your family lives' },
  { word: 'TRAIN',   hint: '🚂', clue: 'Travels on tracks, choo choo!' },
  { word: 'CLOUD',   hint: '☁️', clue: 'Floats in the sky and brings rain' },
  { word: 'BOAT',    hint: '⛵', clue: 'Floats on the water' },
  { word: 'SHOE',    hint: '👟', clue: 'You wear it on your foot' },
  { word: 'BEAR',    hint: '🐻', clue: 'Large furry animal in the woods' },
  { word: 'MILK',    hint: '🥛', clue: 'White drink from a cow' },
  { word: 'BOOK',    hint: '📖', clue: 'You read its pages' }
];

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

const scrambleWord = (word) => {
  let shuffled = shuffle(word.split(''));
  while (shuffled.join('') === word && word.length > 1) {
    shuffled = shuffle(word.split(''));
  }
  return shuffled;
};

const buildRound = (level) => {
  const wordObj = WORDS[level - 1];
  return {
    ...wordObj,
    tiles: scrambleWord(wordObj.word).map((letter, i) => ({ letter, id: i, used: false })),
  };
};

const TOTAL_LEVELS = 20;

const WordScramble = ({ onBack }) => {
  const [levelIndex, setLevelIndex] = useState(0);
  const [round, setRound] = useState(() => buildRound(1));
  const [selected, setSelected] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [feedbackType, setFeedbackType] = useState('');
  const [gameWon, setGameWon] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);
  const [showClue, setShowClue] = useState(false);

  useEffect(() => {
    setSelected([]);
    setFeedback('');
    setFeedbackType('');
    setShowClue(false);
  }, [levelIndex]);

  const resetGame = useCallback(() => {
    setLevelIndex(0);
    setRound(buildRound(1));
    setSelected([]);
    setFeedback('');
    setFeedbackType('');
    setGameWon(false);
    setShowClue(false);
  }, []);

  const handleTilePick = (tile) => {
    if (tile.used) return;
    playSound('pop');

    const newSelected = [...selected, tile];
    const newRound = {
      ...round,
      tiles: round.tiles.map((t) => t.id === tile.id ? { ...t, used: true } : t),
    };
    setRound(newRound);
    setSelected(newSelected);

    const formed = newSelected.map((t) => t.letter).join('');

    if (newSelected.length === round.word.length) {
      if (formed === round.word) {
        playSound('match');
        setFeedback('🎉 Correct! Well done!');
        setFeedbackType('correct');
        setTimeout(() => {
          if (levelIndex + 1 >= TOTAL_LEVELS) {
            setGameWon(true);
          } else {
            const next = levelIndex + 1;
            setLevelIndex(next);
            setRound(buildRound(next + 1));
          }
        }, 1000);
      } else {
        playSound('wrong');
        setFeedback('Not quite! Try again!');
        setFeedbackType('wrong');
        setShakeKey((k) => k + 1);
        setTimeout(() => {
          setRound((r) => ({
            ...r,
            tiles: r.tiles.map((t) => ({ ...t, used: false })),
          }));
          setSelected([]);
          setFeedback('');
          setFeedbackType('');
        }, 700);
      }
    }
  };

  const handleClear = () => {
    setRound((r) => ({ ...r, tiles: r.tiles.map((t) => ({ ...t, used: false })) }));
    setSelected([]);
    setFeedback('');
    setFeedbackType('');
  };

  return (
    <div className="game-view pop-in">
      {gameWon ? (
        <div className="champion-screen">
          <div style={{ fontSize: '4rem' }}>🏆</div>
          <h2>Word Wizard!</h2>
          <p>You unscrambled all {TOTAL_LEVELS} words! Incredible!</p>
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
            <div>Word Scramble</div>
            <div>Word {levelIndex + 1} / {TOTAL_LEVELS}</div>
            <div className="progress-container">
              <div className="progress-bar" style={{ width: `${(levelIndex / TOTAL_LEVELS) * 100}%` }} />
            </div>
          </div>

          <p style={{ textAlign: 'center', color: '#666', marginBottom: '1.5rem', fontWeight: 600 }}>
            Tap the letters in the right order to spell the word! ✏️
          </p>

          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <span style={{ fontSize: '3.5rem' }}>{round.hint}</span>
          </div>

          <button
            className="clue-toggle-btn"
            onClick={() => setShowClue((v) => !v)}
          >
            {showClue ? '🙈 Hide Clue' : '💡 Show Clue'}
          </button>

          {showClue && (
            <div className="scramble-clue pop-in">
              {round.clue}
            </div>
          )}

          <div className="scramble-answer" key={shakeKey}>
            {Array.from({ length: round.word.length }).map((_, i) => {
              const letter = selected[i] ? selected[i].letter : null;
              return (
                <div
                  key={i}
                  style={{
                    width: 58,
                    height: 58,
                    background: letter ? '#ffffff' : 'rgba(255,255,255,0.5)',
                    border: letter ? '3px solid #00b4b5' : '3px solid #cbd5e1',
                    borderRadius: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.8rem',
                    fontWeight: 800,
                    color: '#1a5f7a',
                    boxShadow: letter ? '0 4px 12px rgba(0,180,181,0.25)' : 'none',
                    transition: 'border 0.15s, background 0.15s, box-shadow 0.15s',
                  }}
                >
                  {letter || ''}
                </div>
              );
            })}
          </div>

          <div className="scramble-tiles">
            {round.tiles.map((tile) => (
              <button
                key={tile.id}
                className={`scramble-tile${tile.used ? ' used' : ''}`}
                onClick={() => handleTilePick(tile)}
                disabled={tile.used}
              >
                {tile.letter}
              </button>
            ))}
          </div>

          {feedback && (
            <div className={`sound-feedback ${feedbackType}`}>
              {feedback}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
            <button className="btn" style={{ background: '#f3e8ff', color: '#7c3aed' }} onClick={handleClear}>
              🔄 Clear
            </button>
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

export default WordScramble;
