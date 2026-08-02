import { useState } from 'react';
import { playSound } from '../../../utils/sounds';

// 10 graduated renewable & green energy tasks
const TASKS = [
  {
    emoji: '☀️',
    title: 'Solar Energy',
    question: 'Where should we place solar panels to generate maximum clean electric power?',
    options: [
      { id: 'cave', label: 'Inside a dark cave 🕳️', correct: false },
      { id: 'roof', label: 'On a sunny roof facing the sun 🏡☀️', correct: true },
      { id: 'basement', label: 'In the basement 🚪', correct: false },
      { id: 'underwater', label: 'Deep underwater 🌊', correct: false },
    ],
    fact: 'Solar panels catch photons from sunlight and convert them directly into clean electricity! ☀️⚡'
  },
  {
    emoji: '🌬️',
    title: 'Wind Energy',
    question: 'What spins wind turbine blades to turn clean kinetic energy into electricity?',
    options: [
      { id: 'wind', label: 'Breezy blowing wind 💨', correct: true },
      { id: 'diesel', label: 'Smoky diesel fuel ⛽', correct: false },
      { id: 'coal', label: 'Burning black coal 🪨', correct: false },
      { id: 'batteries', label: 'Heavy plastic batteries 🔋', correct: false },
    ],
    fact: 'Wind turbines generate 100% clean power without any air pollution or greenhouse gas emissions! 🌬️'
  },
  {
    emoji: '💧',
    title: 'Hydro Energy',
    question: 'How do hydroelectric dams make clean green power?',
    options: [
      { id: 'flow', label: 'By capturing fast flowing river water 🌊', correct: true },
      { id: 'boiling', label: 'By boiling saltwater 🧂', correct: false },
      { id: 'burning', label: 'By burning dry leaves 🍂', correct: false },
      { id: 'ice', label: 'By melting ice cubes 🧊', correct: false },
    ],
    fact: 'Hydroelectric power uses the natural gravity and motion of water to spin generators! 💧'
  },
  {
    emoji: '♻️',
    title: 'Recycling Power',
    question: 'What should you do with empty plastic bottles to save energy and protect oceans?',
    options: [
      { id: 'trash', label: 'Throw them in the forest 🌲', correct: false },
      { id: 'bin', label: 'Place them in the blue recycling bin ♻️', correct: true },
      { id: 'burn', label: 'Burn them in a campfire 🔥', correct: false },
      { id: 'river', label: 'Toss them into a river 🏞️', correct: false },
    ],
    fact: 'Recycling 1 plastic bottle saves enough energy to power a lightbulb for 3 hours! ♻️'
  },
  {
    emoji: '🌱',
    title: 'Planting Trees',
    question: 'How do green trees help keep our Earth\'s air clean and cool?',
    options: [
      { id: 'co2', label: 'They absorb carbon dioxide and release fresh oxygen 🍃', correct: true },
      { id: 'smoke', label: 'They release dark smoke 💨', correct: false },
      { id: 'dust', label: 'They blow dust around 🏜️', correct: false },
      { id: 'heat', label: 'They trap extra heat 🌡️', correct: false },
    ],
    fact: 'A single mature tree can absorb 48 pounds of carbon dioxide gas every year! 🌳'
  },
  {
    emoji: '💡',
    title: 'Energy Conservation',
    question: 'What is a smart green habit when you leave a room?',
    options: [
      { id: 'leave', label: 'Leave all lights and TV on 📺', correct: false },
      { id: 'off', label: 'Switch off lights and electronics 💡', correct: true },
      { id: 'fan', label: 'Turn on 3 extra fans 🌀', correct: false },
      { id: 'window', label: 'Leave the heater on with windows open 🪟', correct: false },
    ],
    fact: 'Turning off unused lights conserves power and keeps power plants from overworking! 💡'
  },
  {
    emoji: '🚲',
    title: 'Clean Transport',
    question: 'Which vehicle gets you to school with zero emissions while giving you exercise?',
    options: [
      { id: 'car', label: 'Gasoline car 🚗', correct: false },
      { id: 'bike', label: 'Bicycle 🚲', correct: true },
      { id: 'truck', label: 'Big diesel truck 🚚', correct: false },
      { id: 'jet', label: 'Jet helicopter 🚁', correct: false },
    ],
    fact: 'Bicycles use zero fossil fuel and produce 0% air pollution! 🚲💚'
  },
  {
    emoji: '🔋',
    title: 'Geothermal Heat',
    question: 'Where does geothermal renewable energy get its natural heat energy from?',
    options: [
      { id: 'deep-earth', label: 'Deep underground inside hot Earth rocks 🌋', correct: true },
      { id: 'moon', label: 'From moonlight at night 🌙', correct: false },
      { id: 'clouds', label: 'From rain clouds 🌧️', correct: false },
      { id: 'ocean-waves', label: 'From ocean breezes 🌬️', correct: false },
    ],
    fact: 'Geothermal energy taps natural steam trapped deep underground to power homes 24/7! 🌋'
  },
  {
    emoji: '🧺',
    title: 'Natural Drying',
    question: 'How can we dry wet laundry using green solar and wind power?',
    options: [
      { id: 'line', label: 'Hang clothes on an outdoor clothesline ☀️👔', correct: true },
      { id: 'dryer', label: 'Run an electric dryer twice 🔌', correct: false },
      { id: 'oven', label: 'Bake clothes in the kitchen oven 🍳', correct: false },
      { id: 'fan', label: 'Blow 4 hair dryers at once 💨', correct: false },
    ],
    fact: 'Line-drying clothes saves electricity and uses the natural power of sun & wind! ☀️'
  },
  {
    emoji: '🌏',
    title: 'Eco Hero Master',
    question: 'What is the ultimate goal of adopting clean renewable green energy?',
    options: [
      { id: 'planet', label: 'Protecting Earth, air, wildlife, and future generations 🌍✨', correct: true },
      { id: 'smoke', label: 'Making more smoke in cities 🏭', correct: false },
      { id: 'waste', label: 'Using up all natural resources 🪨', correct: false },
      { id: 'waste2', label: 'Filling landfills faster 🗑️', correct: false },
    ],
    fact: 'You are an official Green Energy Hero! Renewable energy protects our planet\'s future! 🌍🏆'
  }
];

const GreenEnergyHero = ({ onBack }) => {
  const [index, setIndex] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [solved, setSolved] = useState(false);
  const [wrongFlash, setWrongFlash] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const t = TASKS[index];

  const handleOption = (opt) => {
    if (solved) return;
    setSelectedOpt(opt);

    if (opt.correct) {
      playSound('match');
      setSolved(true);
      setWrongFlash(false);
      setScore((s) => s + 1);
    } else {
      playSound('wrong');
      setWrongFlash(true);
      setTimeout(() => {
        setSelectedOpt(null);
      }, 1000);
    }
  };

  const handleNext = () => {
    playSound('pop');
    if (index < TASKS.length - 1) {
      setIndex((i) => i + 1);
      setSelectedOpt(null);
      setSolved(false);
      setWrongFlash(false);
    } else {
      playSound('celebrate');
      setCompleted(true);
    }
  };

  const handleReset = () => {
    playSound('pop');
    setIndex(0);
    setSelectedOpt(null);
    setSolved(false);
    setWrongFlash(false);
    setScore(0);
    setCompleted(false);
  };

  if (completed) {
    return (
      <div className="game-view pop-in">
        <div className="champion-screen">
          <div style={{ fontSize: '4rem' }}>🌱⚡🌍</div>
          <h2>Green Energy Champion!</h2>
          <p>You completed all {TASKS.length} clean energy challenges!</p>
          <p style={{ fontSize: '1.05rem', color: '#666', marginTop: '0.75rem' }}>
            Score: {score} / {TASKS.length} · You are ready to protect planet Earth!
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={handleReset}>Play Again</button>
            <button className="btn btn-back" onClick={() => { if (typeof onBack === 'function') onBack(); }}>Back to Science</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="game-view pop-in">
      <div className="game-header">
        <div>Green Energy Hero 🌱</div>
        <div>Task {index + 1} / {TASKS.length}</div>
        <div>Score: {score}</div>
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${((index + (solved ? 1 : 0)) / TASKS.length) * 100}%` }} />
        </div>
      </div>

      <div style={{ textAlign: 'center', margin: '1.5rem 0' }}>
        <div style={{
          background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
          borderRadius: '24px',
          padding: '1.5rem',
          maxWidth: '460px',
          margin: '0 auto 1.25rem',
          boxShadow: 'var(--shadow-soft)',
          border: '3px solid #81c784'
        }}>
          <div style={{ fontSize: '4.5rem', marginBottom: '0.5rem' }}>{t.emoji}</div>
          <div style={{
            fontSize: '1.3rem',
            fontWeight: '900',
            color: '#2e7d32',
            marginBottom: '0.5rem'
          }}>
            {t.title}
          </div>
          <p style={{ fontSize: '1.05rem', fontWeight: '700', color: '#1b5e20', margin: '0', lineHeight: '1.35' }}>
            {t.question}
          </p>
        </div>

        {wrongFlash && !solved && (
          <div style={{
            color: 'var(--candy-red)',
            background: 'rgba(255,107,107,0.10)',
            borderColor: 'var(--candy-red)',
            padding: '0.75rem 1rem',
            borderRadius: '14px',
            fontWeight: '800',
            maxWidth: '460px',
            margin: '0 auto 1rem',
            border: '2px solid'
          }}>
            Think green! Pick the choice that saves energy and protects nature. Try again! 💡
          </div>
        )}

        {solved && (
          <div style={{
            color: 'var(--candy-green)',
            background: 'rgba(29,209,161,0.12)',
            borderColor: 'var(--candy-green)',
            padding: '0.85rem 1.15rem',
            borderRadius: '16px',
            fontWeight: '800',
            maxWidth: '460px',
            margin: '0 auto 1.25rem',
            border: '2px solid',
            lineHeight: '1.4'
          }}>
            🎉 Excellent Eco Choice!
            <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1b5e20', marginTop: '0.35rem' }}>
              {t.fact}
            </div>
          </div>
        )}
      </div>

      {!solved ? (
        <div className="quiz-options" style={{ maxWidth: '460px', margin: '0 auto' }}>
          {t.options.map((opt) => (
            <button
              key={opt.id}
              className={`quiz-option-btn quiz-text-btn${selectedOpt === opt && !opt.correct ? ' quiz-wrong shake' : ''}`}
              onClick={() => handleOption(opt)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <button className="btn btn-primary" onClick={handleNext}>
            {index < TASKS.length - 1 ? 'Next Clean Task ➡️' : 'See Results 🏆'}
          </button>
        </div>
      )}

      <div className="detail-back-container" style={{ marginTop: '1.5rem' }}>
        <button className="btn btn-back" onClick={() => { if (typeof onBack === 'function') onBack(); }}>
          Back to Science
        </button>
      </div>
    </div>
  );
};

export default GreenEnergyHero;
