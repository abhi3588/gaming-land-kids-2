import { useState, useCallback, useMemo } from 'react';
import { playSound } from '../../utils/sounds';

const TOTAL_LEVELS = 20;

// Deterministic seeded PRNG (same pattern as CoinCounter / TimeTeller)
const createPRNG = (seed) => {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
};

// Full animal/food pool
const ALL_ANIMALS = [
  { id: 'monkey',  emoji: '🐒', name: 'Monkey',   food: 'banana',  foodEmoji: '🍌', foodLabel: 'Banana' },
  { id: 'rabbit',  emoji: '🐰', name: 'Rabbit',   food: 'carrot',  foodEmoji: '🥕', foodLabel: 'Carrot' },
  { id: 'dog',     emoji: '🐶', name: 'Dog',       food: 'bone',    foodEmoji: '🦴', foodLabel: 'Bone' },
  { id: 'bear',    emoji: '🐻', name: 'Bear',      food: 'honey',   foodEmoji: '🍯', foodLabel: 'Honey' },
  { id: 'elephant',emoji: '🐘', name: 'Elephant',  food: 'apple',   foodEmoji: '🍏', foodLabel: 'Apple' },
  { id: 'panda',   emoji: '🐼', name: 'Panda',     food: 'bamboo',  foodEmoji: '🎋', foodLabel: 'Bamboo' },
  { id: 'fox',     emoji: '🦊', name: 'Fox',       food: 'chicken', foodEmoji: '🍗', foodLabel: 'Chicken' },
  { id: 'rooster', emoji: '🐓', name: 'Rooster',   food: 'corn',    foodEmoji: '🌽', foodLabel: 'Corn' },
];

const ALL_FOODS = ALL_ANIMALS.map((a) => ({
  id: a.food, emoji: a.foodEmoji, label: a.foodLabel,
}));

// --- Level generator ---
// Levels 1–5:  4 food choices, 1 animal shown
// Levels 6–12: 5 food choices, 1 animal shown (more distractors)
// Levels 13–20: 6 food choices, 2 animals shown simultaneously (must feed both)
const buildLevel = (lvl) => {
  const prng = createPRNG(lvl * 131 + 7);
  const pick = (arr, n) => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(prng() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy.slice(0, n);
  };

  const isTwoAnimal = lvl >= 13;
  const animalCount = isTwoAnimal ? 2 : 1;
  const animals = pick(ALL_ANIMALS, animalCount);
  const correctFoodIds = new Set(animals.map((a) => a.food));

  const foodCount = lvl <= 5 ? 4 : lvl <= 12 ? 5 : 6;
  const distractors = ALL_FOODS.filter((f) => !correctFoodIds.has(f.id));
  const distPick = pick(distractors, foodCount - animals.length);
  const foods = pick(
    [...animals.map((a) => ALL_FOODS.find((f) => f.id === a.food)), ...distPick],
    foodCount,
  );

  return { animals, foods };
};

const FeedAnimals = ({ onBack }) => {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  const levelData = useMemo(() => buildLevel(level), [level]);
  const { animals, foods } = levelData;

  // Track which animals have been fed this level (for dual-animal levels)
  const [fedIds, setFedIds] = useState([]);
  const [feedback, setFeedback] = useState('Tap the food your friend wants! 🍽️');
  const [happyIds, setHappyIds] = useState([]);

  // The next animal waiting to be fed (for dual-animal mode, feed them one at a time)
  const pendingAnimal = animals.find((a) => !fedIds.includes(a.id)) || null;

  const resetLevelState = useCallback(() => {
    setFedIds([]);
    setFeedback('Tap the food your friend wants! 🍽️');
    setHappyIds([]);
  }, []);

  const handleFeed = useCallback((food) => {
    if (!pendingAnimal || gameWon) return;

    if (food.id === pendingAnimal.food) {
      playSound('match');
      const newFedIds = [...fedIds, pendingAnimal.id];
      const newHappyIds = [...happyIds, pendingAnimal.id];
      setFedIds(newFedIds);
      setHappyIds(newHappyIds);
      setScore((s) => s + 1);
      setFeedback(`Yum! ${pendingAnimal.name} loves ${food.label}! 😋`);

      // All animals in this level fed
      if (newFedIds.length === animals.length) {
        if (level >= TOTAL_LEVELS) {
          setTimeout(() => { playSound('celebrate'); setGameWon(true); }, 800);
        } else {
          setTimeout(() => {
            playSound('celebrate');
            setLevel((l) => l + 1);
            resetLevelState();
          }, 900);
        }
      } else {
        const next = animals.find((a) => !newFedIds.includes(a.id));
        if (next) setFeedback(`Great! Now feed the ${next.name}! 🍽️`);
      }
    } else {
      playSound('wrong');
      setFeedback(`Hmm, ${pendingAnimal.name} doesn't eat ${food.label}. Try again! 🤔`);
    }
  }, [pendingAnimal, fedIds, happyIds, animals, level, gameWon, resetLevelState]);

  const handlePlayAgain = () => {
    setLevel(1);
    setScore(0);
    setGameWon(false);
    resetLevelState();
  };

  if (gameWon) {
    return (
      <div className="game-view pop-in">
        <div className="champion-screen">
          <div style={{ fontSize: '4rem' }}>🦁</div>
          <h2>Animal Friend Hero!</h2>
          <p>You fed all the animals across all {TOTAL_LEVELS} levels!</p>
          <p style={{ fontSize: '1.1rem', color: '#666', marginTop: '1rem' }}>
            Every animal has a favourite food — you know them all! 🐾
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={handlePlayAgain}>Play Again</button>
            <button className="btn" onClick={() => { if (typeof onBack === 'function') onBack(); }}>Main Menu</button>
          </div>
        </div>
      </div>
    );
  }

  const isTwoAnimal = animals.length === 2;

  return (
    <div className="game-view pop-in">
      <div className="game-header">
        <div>Feed the Animals 🦁</div>
        <div>Level {level} / {TOTAL_LEVELS}</div>
        <div>Score: {score}</div>
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${(level / TOTAL_LEVELS) * 100}%` }} />
        </div>
      </div>

      <div className="fa-stage">
        {animals.map((animal) => {
          const isHappy = happyIds.includes(animal.id);
          const isPending = pendingAnimal?.id === animal.id;
          return (
            <div key={animal.id} className={`fa-animal${isHappy ? ' happy' : ''}${isPending && isTwoAnimal ? ' active' : ''}`}>
              <span className="fa-emoji" aria-hidden>{animal.emoji}</span>
              <span className="fa-name">{animal.name}</span>
              <div className="fa-bubble" aria-hidden>{animal.foodEmoji}</div>
              <div className={`fa-speech${isHappy ? ' happy' : ''}`}>
                {isHappy ? 'Yum, thank you! 💛' : `I'm hungry! 🍽️`}
              </div>
            </div>
          );
        })}
      </div>

      <p className="fa-feedback" style={{ color: feedback.includes('Yum') || feedback.includes('Great') ? 'var(--candy-green)' : 'var(--text-muted)' }}>
        {feedback}
      </p>

      <div className="fa-foods">
        {foods.map((food) => (
          <button
            key={food.id}
            className="fa-food"
            onClick={() => handleFeed(food)}
            disabled={!pendingAnimal}
            aria-label={`Feed ${food.label}`}
          >
            <span className="fa-food-emoji" aria-hidden>{food.emoji}</span>
            <span className="fa-food-label">{food.label}</span>
          </button>
        ))}
      </div>

      <div className="detail-back-container">
        <button className="btn" onClick={() => { if (typeof onBack === 'function') onBack(); }}>
          Main Menu
        </button>
      </div>
    </div>
  );
};

export default FeedAnimals;
