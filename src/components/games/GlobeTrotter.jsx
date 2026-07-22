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

const TRIVIA_DATA = [
  // Animals & Habitats (1-5)
  { type: 'habitat', question: 'Where do wild Kangaroos 🦘 live?', emoji: '🦘', correct: 'Australia 🇦🇺', distractors: ['Canada 🇨🇦', 'Japan 🇯🇵', 'Egypt 🇪🇬'] },
  { type: 'habitat', question: 'Where do wild Giant Pandas 🐼 live?', emoji: '🐼', correct: 'China 🇨🇳', distractors: ['France 🇫🇷', 'Brazil 🇧🇷', 'Australia 🇦🇺'] },
  { type: 'habitat', question: 'Where do wild Emperor Penguins 🐧 live?', emoji: '🐧', correct: 'Antarctica ❄️', distractors: ['India 🇮🇳', 'Egypt 🇪🇬', 'Italy 🇮🇹'] },
  { type: 'habitat', question: 'Where do wild Savanna Lions 🦁 live?', emoji: '🦁', correct: 'Africa 🌍', distractors: ['United Kingdom 🇬🇧', 'Japan 🇯🇵', 'Canada 🇨🇦'] },
  { type: 'habitat', question: 'Where do wild Bald Eagles 🦅 live?', emoji: '🦅', correct: 'North America 🇺🇸', distractors: ['Antarctica ❄️', 'Egypt 🇪🇬', 'China 🇨🇳'] },

  // Landmarks (6-12)
  { type: 'landmark', question: 'In which country are the Great Pyramids 🔺?', emoji: '🔺', correct: 'Egypt 🇪🇬', distractors: ['France 🇫🇷', 'Australia 🇦🇺', 'Japan 🇯🇵'] },
  { type: 'landmark', question: 'In which city is the Eiffel Tower 🗼 located?', emoji: '🗼', correct: 'Paris, France 🇫🇷', distractors: ['London, UK 🇬🇧', 'Tokyo, Japan 🇯🇵', 'Rome, Italy 🇮🇹'] },
  { type: 'landmark', question: 'In which country is the Taj Mahal 🕌 located?', emoji: '🕌', correct: 'India 🇮🇳', distractors: ['Brazil 🇧🇷', 'Canada 🇨🇦', 'Egypt 🇪🇬'] },
  { type: 'landmark', question: 'In which city is the Statue of Liberty 🗽 located?', emoji: '🗽', correct: 'New York, USA 🇺🇸', distractors: ['Paris, France 🇫🇷', 'Sydney, Australia 🇦🇺', 'Tokyo, Japan 🇯🇵'] },
  { type: 'landmark', question: 'In which country is the Great Wall 🧱 located?', emoji: '🧱', correct: 'China 🇨🇳', distractors: ['Italy 🇮🇹', 'India 🇮🇳', 'United Kingdom 🇬🇧'] },
  { type: 'landmark', question: 'In which city is the ancient Colosseum 🏛️?', emoji: '🏛️', correct: 'Rome, Italy 🇮🇹', distractors: ['Cairo, Egypt 🇪🇬', 'Paris, France 🇫🇷', 'Beijing, China 🇨🇳'] },
  { type: 'landmark', question: 'In which city is Big Ben 🕰️ located?', emoji: '🕰️', correct: 'London, UK 🇬🇧', distractors: ['Washington, USA 🇺🇸', 'Ottawa, Canada 🇨🇦', 'Tokyo, Japan 🇯🇵'] },

  // Capitals & Flags (13-20)
  { type: 'capital', question: 'What is the capital city of Japan 🗾?', emoji: '🗾', correct: 'Tokyo 🇯🇵', distractors: ['Beijing 🇨🇳', 'Seoul 🇰🇷', 'Bangkok 🇹🇭'] },
  { type: 'capital', question: 'What is the capital city of France 🥐?', emoji: '🥐', correct: 'Paris 🇫🇷', distractors: ['Berlin 🇩🇪', 'Madrid 🇪🇸', 'Rome 🇮🇹'] },
  { type: 'capital', question: 'What is the capital city of India 🪷?', emoji: '🪷', correct: 'New Delhi 🇮🇳', distractors: ['Mumbai 🇮🇳', 'Tokyo 🇯🇵', 'London 🇬🇧'] },
  { type: 'capital', question: 'What is the capital city of Australia 🦘?', emoji: '🦘', correct: 'Canberra 🇦🇺', distractors: ['Sydney 🇦🇺', 'Melbourne 🇦🇺', 'Auckland 🇳🇿'] },
  { type: 'capital', question: 'What is the capital city of Canada 🍁?', emoji: '🍁', correct: 'Ottawa 🇨🇦', distractors: ['Toronto 🇨🇦', 'Vancouver 🇨🇦', 'New York 🇺🇸'] },
  { type: 'capital', question: 'What is the capital city of Brazil ⚽?', emoji: '⚽', correct: 'Brasilia 🇧🇷', distractors: ['Rio de Janeiro 🇧🇷', 'Buenos Aires 🇦🇷', 'Madrid 🇪🇸'] },
  { type: 'capital', question: 'What is the capital city of Italy 🍕?', emoji: '🍕', correct: 'Rome 🇮🇹', distractors: ['Venice 🇮🇹', 'Milan 🇮🇹', 'Paris 🇫🇷'] },
  { type: 'capital', question: 'What is the capital city of the United Kingdom ☕?', emoji: '☕', correct: 'London 🇬🇧', distractors: ['Edinburgh 🏴󠁧󠁢󠁳󠁣󠁴󠁿', 'Dublin 🇮🇪', 'Washington 🇺🇸'] },
];

const getGlobeTrotterLevel = (level) => {
  const prng = createPRNG(level * 607 + 29);
  const trivia = TRIVIA_DATA[(level - 1) % TRIVIA_DATA.length];

  // Options count: L1-5: 3 options, L6-20: 4 options
  const totalOptions = level <= 5 ? 3 : 4;

  const chosenDistractors = trivia.distractors.slice(0, totalOptions - 1);
  const options = [trivia.correct, ...chosenDistractors];

  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(prng() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }

  return { trivia, options };
};

export default function GlobeTrotter({ onBack }) {
  const [level, setLevel] = useState(1);
  const [data, setData] = useState(() => getGlobeTrotterLevel(1));
  const [selected, setSelected] = useState(null);
  const [solved, setSolved] = useState(false);
  const [feedback, setFeedback] = useState('Explore the world and answer the geography question!');
  const [gameWon, setGameWon] = useState(false);

  const loadLevel = (lvl) => {
    setLevel(lvl);
    setData(getGlobeTrotterLevel(lvl));
    setSelected(null);
    setSolved(false);
    setFeedback('Explore the world and answer the geography question!');
  };

  const handleSelectOption = (opt) => {
    if (solved) return;
    setSelected(opt);

    if (opt === data.trivia.correct) {
      playSound('match');
      setSolved(true);
      setFeedback(`Passport Stamped! Correct answer: ${opt}! 🌍✈️`);

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
      setFeedback('Not quite! Check your world map and try again!');
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
        <div>Globe Trotter 🌍</div>
        <div>Level {level} / {TOTAL_LEVELS}</div>
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${(level / TOTAL_LEVELS) * 100}%` }} />
        </div>
      </div>

      {gameWon ? (
        <div className="champion-screen">
          <div style={{ fontSize: '4.5rem' }}>🌍✈️🏆</div>
          <h2>World Globe Trotter Champion!</h2>
          <p>You collected every passport stamp and conquered the world map!</p>
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

          {/* Passport & trivia question card */}
          <div style={{
            maxWidth: '460px',
            margin: '0 auto 2rem',
            background: 'white',
            borderRadius: '24px',
            padding: '1.5rem',
            boxShadow: 'var(--shadow-soft)',
            textAlign: 'center',
            border: '3px solid var(--candy-teal)'
          }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '0.4rem' }}>
              {data.trivia.emoji}
            </div>
            <h3 style={{ margin: '0 0 0.5rem', color: 'var(--candy-purple)', fontSize: '1.35rem', lineHeight: 1.3 }}>
              {data.trivia.question}
            </h3>
          </div>

          {/* Responsive 2x2 options grid */}
          <div className="puzzle-options-grid" style={{ maxWidth: '500px', margin: '0 auto' }}>
            {data.options.map((opt) => {
              const isSelected = selected === opt;
              const isCorrect = opt === data.trivia.correct;
              let stateClass = '';
              if (solved && isCorrect) stateClass = ' quiz-correct';
              if (isSelected && !solved) stateClass = ' quiz-wrong shake';

              return (
                <button
                  key={opt}
                  className={`quiz-option-btn${stateClass}`}
                  onClick={() => handleSelectOption(opt)}
                  disabled={solved}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0.85rem 1rem',
                    fontSize: '1.1rem',
                    fontWeight: '800',
                    minHeight: '64px'
                  }}
                >
                  {opt}
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
