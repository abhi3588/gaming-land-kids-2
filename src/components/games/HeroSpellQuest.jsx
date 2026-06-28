import { useState, useCallback, useEffect } from 'react';
import { playSound } from '../../utils/sounds';

const HEROES = [
  { word: 'HULK',      emoji: '💚', clue: 'He smashes things when he gets angry!' },
  { word: 'THOR',      emoji: '⚡', clue: 'He wields a magical hammer called Mjolnir!' },
  { word: 'FLASH',     emoji: '🏃', clue: 'He is the fastest superhero alive!' },
  { word: 'BATMAN',    emoji: '🦇', clue: 'The Dark Knight who protects Gotham City!' },
  { word: 'VENOM',     emoji: '🕸️', clue: 'An alien creature that bonds with a human!' },
  { word: 'IRONMAN',   emoji: '🦾', clue: 'A genius who built a powerful armored suit!' },
  { word: 'AQUAMAN',   emoji: '🌊', clue: 'He rules the underwater kingdom of Atlantis!' },
  { word: 'CYCLOPS',   emoji: '🔴', clue: 'He shoots powerful laser beams from his eyes!' },
  { word: 'PANTHER',   emoji: '🐾', clue: 'The king of Wakanda with a vibranium suit!' },
  { word: 'SUPERMAN',  emoji: '🦸', clue: 'He flies, has laser vision, and is super strong!' },
  { word: 'WOLVERINE', emoji: '🐺', clue: 'He has razor-sharp claws and heals super fast!' },
  { word: 'SPIDERMAN', emoji: '🕷️', clue: 'He swings through New York City on webs!' },
];

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

const scrambleWord = (word) => {
  let shuffled = shuffle(word.split(''));
  let attempts = 0;
  while (shuffled.join('') === word && word.length > 1 && attempts < 20) {
    shuffled = shuffle(word.split(''));
    attempts++;
  }
  return shuffled;
};

const buildRound = () => {
  const heroObj = HEROES[Math.floor(Math.random() * HEROES.length)];
  return {
    ...heroObj,
    tiles: scrambleWord(heroObj.word).map((letter, i) => ({ letter, id: i, used: false })),
  };
};

const TOTAL_LEVELS = 20;

const HeroSpellQuest = ({ onBack }) => {
  const [levelIndex, setLevelIndex] = useState(0);
  const [round, setRound] = useState(() => buildRound());
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
    setRound(buildRound());
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
        setFeedback('🦸 Hero spelled! Awesome!');
        setFeedbackType('correct');
        setTimeout(() => {
          if (levelIndex + 1 >= TOTAL_LEVELS) {
            setGameWon(true);
          } else {
            const next = levelIndex + 1;
            setLevelIndex(next);
            setRound(buildRound());
          }
        }, 1000);
      } else {
        playSound('wrong');
        setFeedback('Not quite! Try again! 💪');
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

  const boxSize = round.word.length >= 8 ? 46 : round.word.length >= 6 ? 52 : 58;
  const fontSize = round.word.length >= 8 ? '1.3rem' : '1.7rem';

  return (
    <div className="game-view pop-in">
      {gameWon ? (
        <div className="champion-screen">
          <div style={{ fontSize: '4rem' }}>🏆</div>
          <h2>Hero Speller!</h2>
          <p>You spelled all {TOTAL_LEVELS} superheroes! You're a legend!</p>
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
            <div>Hero Spell Quest</div>
            <div>Hero {levelIndex + 1} / {TOTAL_LEVELS}</div>
            <div className="progress-container">
              <div className="progress-bar" style={{ width: `${(levelIndex / TOTAL_LEVELS) * 100}%` }} />
            </div>
          </div>

          <p style={{ textAlign: 'center', color: '#666', marginBottom: '0.75rem', fontWeight: 600 }}>
            Spell the superhero name! 🦸‍♂️
          </p>

          <div style={{ textAlign: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: 'clamp(3.5rem, 12vw, 5.5rem)' }}>{round.emoji}</span>
          </div>

          <button className="clue-toggle-btn" onClick={() => setShowClue((v) => !v)}>
            {showClue ? '🙈 Hide Clue' : '💡 Show Clue'}
          </button>

          {showClue && <div className="scramble-clue pop-in">{round.clue}</div>}

          <div className="scramble-answer" key={shakeKey} style={{ flexWrap: 'wrap', gap: '0.35rem' }}>
            {Array.from({ length: round.word.length }).map((_, i) => {
              const letter = selected[i] ? selected[i].letter : null;
              return (
                <div key={i} style={{
                  width: boxSize, height: boxSize,
                  background: letter ? '#ffffff' : 'rgba(255,255,255,0.5)',
                  border: letter ? '3px solid #c0392b' : '3px solid #cbd5e1',
                  borderRadius: 12,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize, fontWeight: 800, color: '#7b0000',
                  boxShadow: letter ? '0 4px 12px rgba(192,57,43,0.25)' : 'none',
                  transition: 'border 0.15s, background 0.15s, box-shadow 0.15s',
                }}>
                  {letter || ''}
                </div>
              );
            })}
          </div>

          <div className="scramble-tiles">
            {round.tiles.map((tile) => (
              <button
                key={tile.id}
                className={`scramble-tile hero-tile${tile.used ? ' used' : ''}`}
                onClick={() => handleTilePick(tile)}
                disabled={tile.used}
              >
                {tile.letter}
              </button>
            ))}
          </div>

          {feedback && (
            <div className={`sound-feedback ${feedbackType}`}>{feedback}</div>
          )}

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
            <button className="btn" style={{ background: '#ffeaa7', color: '#7c3aed' }} onClick={handleClear}>
              🔄 Clear
            </button>
            <button className="btn" style={{ background: '#eee', color: '#333' }}
              onClick={() => typeof onBack === 'function' && onBack()}>
              Main Menu
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default HeroSpellQuest;
