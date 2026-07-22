import { useState } from 'react';
import { playSound } from '../../utils/sounds.js';

const TOTAL_LEVELS = 20;

const createPRNG = (seed) => {
  let s = seed;
  return () => {
    const x = Math.sin(s++) * 10000;
    return x - Math.floor(x);
  };
};

const EMOTIONS_POOL = [
  { id: 'happy', emoji: '😊', label: 'Happy' },
  { id: 'sad', emoji: '😢', label: 'Sad' },
  { id: 'surprised', emoji: '😲', label: 'Surprised' },
  { id: 'sleepy', emoji: '😴', label: 'Sleepy' },
  { id: 'angry', emoji: '😡', label: 'Angry' },
  { id: 'excited', emoji: '🤩', label: 'Excited' },
  { id: 'scared', emoji: '😨', label: 'Scared' },
  { id: 'proud', emoji: '🦁', label: 'Proud' },
];

const SCENARIOS = [
  { character: 'Bella Bunny 🐰', story: 'received a giant delicious birthday cake!', correct: 'happy' },
  { character: 'Toby Puppy 🐶', story: 'lost his favorite squeaky ball in the tall grass!', correct: 'sad' },
  { character: 'Pip Penguin 🐧', story: 'saw a shiny gift box suddenly pop open!', correct: 'surprised' },
  { character: 'Oliver Owl 🦉', story: 'stayed up all night counting stars in the sky!', correct: 'sleepy' },
  { character: 'Barnaby Bear 🐻', story: 'had his fresh honey pot bumped over!', correct: 'angry' },
  { character: 'Felix Fox 🦊', story: 'is going on a big magical amusement park trip!', correct: 'excited' },
  { character: 'Sammy Squirrel 🐿️', story: 'heard a sudden loud thunderstorm clap!', correct: 'scared' },
  { character: 'Penny Pig 🐷', story: 'won 1st place and a golden ribbon in the race!', correct: 'proud' },
  { character: 'Leo Lion 🦁', story: 'got a warm fuzzy hug from a best friend!', correct: 'happy' },
  { character: 'Milo Monkey 🐒', story: 'dropped his sweet yellow banana in the mud!', correct: 'sad' },
  { character: 'Daisy Duck 🦆', story: 'found a secret door hidden behind the bush!', correct: 'surprised' },
  { character: 'Kiki Kitty 🐱', story: 'curled up in a soft warm blanket after sunset!', correct: 'sleepy' },
  { character: 'Robbie Rabbit 🐰', story: 'built a towering castle of rainbow blocks!', correct: 'proud' },
  { character: 'Gideon Giraffe 🦒', story: 'saw a big spooky shadow in the dark forest!', correct: 'scared' },
  { character: 'Zoe Zebra 🦓', story: 'got a brand new set of bright painting crayons!', correct: 'excited' },
  { character: 'Chester Cheetah 🐆', story: 'had his cozy sunny nap interrupted!', correct: 'angry' },
  { character: 'Cleo Cat 🐈', story: 'chased a colorful butterfly all afternoon!', correct: 'happy' },
  { character: 'Paddy Panda 🐼', story: 'spilled his delicious morning milk cup!', correct: 'sad' },
  { character: 'Wally Elephant 🐘', story: 'saw a tiny mouse do a silly backflip!', correct: 'surprised' },
  { character: 'Buster Dog 🐕', story: 'learned a brand-new trick all by himself!', correct: 'proud' },
];

const getEmotionExpressLevel = (level) => {
  const prng = createPRNG(level * 107 + 19);
  const scenario = SCENARIOS[(level - 1) % SCENARIOS.length];
  const correctObj = EMOTIONS_POOL.find(e => e.id === scenario.correct);

  // Distractors count: L1-5: 2 choices total, L6-12: 3 choices, L13-20: 4 choices
  const totalChoices = level <= 5 ? 2 : level <= 12 ? 3 : 4;

  const distractors = EMOTIONS_POOL.filter(e => e.id !== scenario.correct);
  // Shuffle distractors with PRNG
  for (let i = distractors.length - 1; i > 0; i--) {
    const j = Math.floor(prng() * (i + 1));
    [distractors[i], distractors[j]] = [distractors[j], distractors[i]];
  }

  const chosenDistractors = distractors.slice(0, totalChoices - 1);
  const options = [correctObj, ...chosenDistractors];

  // Shuffle final options
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(prng() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }

  return { scenario, correctObj, options };
};

export default function EmotionExpress({ onBack }) {
  const [level, setLevel] = useState(1);
  const [data, setData] = useState(() => getEmotionExpressLevel(1));
  const [selected, setSelected] = useState(null);
  const [solved, setSolved] = useState(false);
  const [feedback, setFeedback] = useState('Read the story and pick how your friend feels!');
  const [gameWon, setGameWon] = useState(false);

  const loadLevel = (lvl) => {
    setLevel(lvl);
    setData(getEmotionExpressLevel(lvl));
    setSelected(null);
    setSolved(false);
    setFeedback('Read the story and pick how your friend feels!');
  };

  const handleSelectOption = (opt) => {
    if (solved) return;
    setSelected(opt);

    if (opt.id === data.correctObj.id) {
      playSound('match');
      setSolved(true);
      setFeedback(`Yes! ${data.scenario.character} feels ${opt.label}! ${opt.emoji}`);

      if (level >= TOTAL_LEVELS) {
        playSound('celebrate');
        setGameWon(true);
      } else {
        setTimeout(() => {
          playSound('celebrate');
          loadLevel(level + 1);
        }, 1200);
      }
    } else {
      playSound('wrong');
      setFeedback(`Not quite — try another emotion for ${data.scenario.character}!`);
      setTimeout(() => setSelected(null), 1000);
    }
  };

  const handleReset = () => {
    playSound('pop');
    setGameWon(false);
    loadLevel(1);
  };

  return (
    <div className="game-view pop-in">
      <div className="game-header">
        <h2 style={{ margin: 0, fontSize: 'inherit', fontWeight: 'inherit' }}>Emotion Express 😊</h2>
        <div>Level {level} / {TOTAL_LEVELS}</div>
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${(level / TOTAL_LEVELS) * 100}%` }} />
        </div>
      </div>

      {gameWon ? (
        <div className="champion-screen">
          <div style={{ fontSize: '4.5rem' }}>😊🌟🏆</div>
          <h2>Emotion Express Champion!</h2>
          <p>You helped all your animal friends express their emotions perfectly!</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
            <button className="btn btn-primary" onClick={handleReset}>Play Again</button>
            <button className="btn btn-back" onClick={() => { if (typeof onBack === 'function') onBack(); }}>Main Menu</button>
          </div>
        </div>
      ) : (
        <>
          <div style={{
            textAlign: 'center',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            color: solved ? 'var(--candy-green)' : selected ? 'var(--candy-red)' : '#666',
            background: solved ? 'rgba(29,209,161,0.12)' : 'rgba(108, 92, 231, 0.08)',
            padding: '0.75rem 1rem',
            borderRadius: '14px',
            maxWidth: '520px',
            margin: '0 auto 1.5rem'
          }}>
            {feedback}
          </div>

          {/* Scenario card display */}
          <div style={{
            maxWidth: '460px',
            margin: '0 auto 2rem',
            background: 'white',
            borderRadius: '24px',
            padding: '1.5rem',
            boxShadow: 'var(--shadow-soft)',
            textAlign: 'center',
            border: '3px solid var(--candy-pink)'
          }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>
              {data.scenario.character.split(' ')[1] || '🐶'}
            </div>
            <h3 style={{ margin: '0 0 0.5rem', color: 'var(--candy-purple)', fontSize: '1.4rem' }}>
              {data.scenario.character}
            </h3>
            <p style={{ fontSize: '1.15rem', color: '#444', fontWeight: '600', margin: 0, lineHeight: 1.4 }}>
              "{data.scenario.story}"
            </p>
          </div>

          {/* Responsive 2x2 option grid */}
          <div className="puzzle-options-grid" style={{ maxWidth: '500px', margin: '0 auto' }}>
            {data.options.map((opt) => {
              const isSelected = selected?.id === opt.id;
              const isCorrect = opt.id === data.correctObj.id;
              let stateClass = '';
              if (solved && isCorrect) stateClass = ' quiz-correct';
              if (isSelected && !solved) stateClass = ' quiz-wrong shake';

              return (
                <button
                  key={opt.id}
                  className={`quiz-option-btn${stateClass}`}
                  onClick={() => handleSelectOption(opt)}
                  disabled={solved}
                  aria-label={`${opt.label} ${opt.emoji}`}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0.8rem 1rem',
                    minHeight: '80px'
                  }}
                >
                  <span style={{ fontSize: '2.4rem', lineHeight: '1' }}>{opt.emoji}</span>
                  <span style={{ fontSize: '1rem', fontWeight: '800', marginTop: '4px', color: '#444' }}>{opt.label}</span>
                </button>
              );
            })}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button className="btn btn-back" onClick={() => { if (typeof onBack === 'function') onBack(); }}>Main Menu</button>
          </div>
        </>
      )}
    </div>
  );
}
