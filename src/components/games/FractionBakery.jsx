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

const FRACTION_DATA = [
  { fraction: '1/2', label: 'One Half', sliceEmoji: '🍕🍕', numerator: 1, denominator: 2 },
  { fraction: '1/3', label: 'One Third', sliceEmoji: '🍕', numerator: 1, denominator: 3 },
  { fraction: '2/3', label: 'Two Thirds', sliceEmoji: '🍕🍕', numerator: 2, denominator: 3 },
  { fraction: '1/4', label: 'One Quarter', sliceEmoji: '🍕', numerator: 1, denominator: 4 },
  { fraction: '3/4', label: 'Three Quarters', sliceEmoji: '🍕🍕🍕', numerator: 3, denominator: 4 },
  { fraction: '2/4', label: 'Two Quarters (1/2)', sliceEmoji: '🍕🍕', numerator: 2, denominator: 4 },
  { fraction: '3/5', label: 'Three Fifths', sliceEmoji: '🥧🥧🥧', numerator: 3, denominator: 5 },
  { fraction: '4/5', label: 'Four Fifths', sliceEmoji: '🥧🥧🥧🥧', numerator: 4, denominator: 5 },
  { fraction: '2/6', label: 'Two Sixths (1/3)', sliceEmoji: '🍕🍕', numerator: 2, denominator: 6 },
  { fraction: '3/6', label: 'Three Sixths (1/2)', sliceEmoji: '🍕🍕🍕', numerator: 3, denominator: 6 },
  { fraction: '4/6', label: 'Four Sixths (2/3)', sliceEmoji: '🍕🍕🍕🍕', numerator: 4, denominator: 6 },
  { fraction: '3/8', label: 'Three Eighths', sliceEmoji: '🍰🍰🍰', numerator: 3, denominator: 8 },
  { fraction: '4/8', label: 'Four Eighths (1/2)', sliceEmoji: '🍰🍰🍰🍰', numerator: 4, denominator: 8 },
  { fraction: '5/8', label: 'Five Eighths', sliceEmoji: '🍰🍰🍰🍰🍰', numerator: 5, denominator: 8 },
];

const CUSTOMERS = [
  { name: 'Chef Pig 🐷', orderText: 'order of' },
  { name: 'Bear Barnaby 🐻', orderText: 'wants' },
  { name: 'Fox Felix 🦊', orderText: 'asked for' },
  { name: 'Owl Oliver 🦉', orderText: 'ordered' },
];

const getFractionBakeryLevel = (level) => {
  const prng = createPRNG(level * 419 + 13);
  const customer = CUSTOMERS[(level - 1) % CUSTOMERS.length];

  let target;
  if (level <= 5) {
    // Unit fractions: 1/2, 1/3, 1/4
    const unitPool = FRACTION_DATA.filter(f => f.numerator === 1);
    target = unitPool[(level - 1) % unitPool.length];
  } else if (level <= 12) {
    // Non-unit fractions
    const nonUnit = FRACTION_DATA.filter(f => f.numerator > 1 && f.denominator <= 5);
    target = nonUnit[(level - 6) % nonUnit.length];
  } else {
    // Equivalent and advanced fractions
    const advanced = FRACTION_DATA.filter(f => f.denominator >= 4);
    target = advanced[(level - 13) % advanced.length];
  }

  // Options count: L1-5: 3 options, L6-20: 4 options
  const totalOptions = level <= 5 ? 3 : 4;

  const distractors = FRACTION_DATA.filter(f => f.fraction !== target.fraction);
  for (let i = distractors.length - 1; i > 0; i--) {
    const j = Math.floor(prng() * (i + 1));
    [distractors[i], distractors[j]] = [distractors[j], distractors[i]];
  }

  const options = [target, ...distractors.slice(0, totalOptions - 1)];

  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(prng() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }

  return { customer, target, options };
};

export default function FractionBakery({ onBack }) {
  const [level, setLevel] = useState(1);
  const [data, setData] = useState(() => getFractionBakeryLevel(1));
  const [selected, setSelected] = useState(null);
  const [solved, setSolved] = useState(false);
  const [feedback, setFeedback] = useState('Read the order ticket and serve the correct fraction!');
  const [gameWon, setGameWon] = useState(false);

  const loadLevel = (lvl) => {
    setLevel(lvl);
    setData(getFractionBakeryLevel(lvl));
    setSelected(null);
    setSolved(false);
    setFeedback('Read the order ticket and serve the correct fraction!');
  };

  const handleSelectOption = (opt) => {
    if (solved) return;
    setSelected(opt);

    if (opt.fraction === data.target.fraction) {
      playSound('match');
      setSolved(true);
      setFeedback(`Order complete! ${data.target.fraction} (${data.target.label}) served! 🍕✨`);

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
      setFeedback('Incorrect slice size! Check the numerator and denominator!');
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
        <div>Fraction Bakery 🍕</div>
        <div>Level {level} / {TOTAL_LEVELS}</div>
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${(level / TOTAL_LEVELS) * 100}%` }} />
        </div>
      </div>

      {gameWon ? (
        <div className="champion-screen">
          <div style={{ fontSize: '4.5rem' }}>🍕👨‍🍳🏆</div>
          <h2>Fraction Master Chef!</h2>
          <p>You served every single fraction order ticket in the bakery perfectly!</p>
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

          {/* Bakery order ticket card */}
          <div style={{
            maxWidth: '460px',
            margin: '0 auto 2rem',
            background: 'white',
            borderRadius: '24px',
            padding: '1.5rem',
            boxShadow: 'var(--shadow-soft)',
            textAlign: 'center',
            border: '3px solid var(--candy-orange)'
          }}>
            <div style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Order Ticket #{level}
            </div>
            <h3 style={{ margin: '0.4rem 0 0.8rem', color: '#444', fontSize: '1.3rem' }}>
              {data.customer.name} {data.customer.orderText} <span style={{ color: 'var(--candy-orange)', fontSize: '1.6rem' }}>{data.target.fraction}</span> of a pizza!
            </h3>

            {/* Fraction visual pizza slice representation */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              background: '#fff9e6',
              padding: '1rem',
              borderRadius: '18px',
              border: '2px dashed #ffe082'
            }}>
              <div style={{ fontSize: '2rem' }}>{data.target.sliceEmoji}</div>
              <div style={{ fontWeight: '800', color: '#555', fontSize: '1.1rem' }}>
                ({data.target.numerator} out of {data.target.denominator} slices)
              </div>
            </div>
          </div>

          {/* Responsive options grid */}
          <div className="puzzle-options-grid" style={{ maxWidth: '500px', margin: '0 auto' }}>
            {data.options.map((opt) => {
              const isSelected = selected?.fraction === opt.fraction;
              const isCorrect = opt.fraction === data.target.fraction;
              let stateClass = '';
              if (solved && isCorrect) stateClass = ' quiz-correct';
              if (isSelected && !solved) stateClass = ' quiz-wrong shake';

              return (
                <button
                  key={opt.fraction}
                  className={`quiz-option-btn${stateClass}`}
                  onClick={() => handleSelectOption(opt)}
                  disabled={solved}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0.8rem 1rem',
                    minHeight: '80px'
                  }}
                >
                  <span style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--candy-orange)' }}>{opt.fraction}</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: '800', color: '#555', marginTop: '2px' }}>{opt.label}</span>
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
