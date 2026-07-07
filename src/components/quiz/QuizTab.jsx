import { useState } from 'react';
import { QUIZ_CATEGORIES, QUIZ_DATA } from './quiz-data.js';
import QuizActivity from './QuizActivity.jsx';
import { playSound } from '../../utils/sounds.js';

export default function QuizTab() {
  const [activeId, setActiveId] = useState(null);

  const handleSelect = (id) => {
    playSound('pop');
    setActiveId(id);
  };

  if (activeId) {
    return (
      <QuizActivity
        quiz={QUIZ_DATA[activeId]}
        onBack={() => setActiveId(null)}
      />
    );
  }

  return (
    <div>
      <div className="section-header">
        <h2>📝 Quiz Corner</h2>
        <p>Pick a quiz and test what you know! 🌟</p>
      </div>

      <div className="educational-grid pop-in" style={{ marginTop: '1rem' }}>
        {QUIZ_CATEGORIES.map((cat) => (
          <QuizCard key={cat.id} category={cat} onSelect={handleSelect} />
        ))}
      </div>
    </div>
  );
}

function QuizCard({ category, onSelect }) {
  return (
    <div
      className={`game-card ${category.color}`}
      onClick={() => onSelect(category.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect(category.id)}
      aria-label={`Start ${category.title} quiz`}
    >
      <span className="game-icon">{category.icon}</span>
      <h2>{category.title}</h2>
      <div className="activity-subtitle">Ages {category.ageRange} · 10 Questions</div>
      <p className="game-desc">{category.desc}</p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.6rem', marginTop: '0.6rem' }}>
        <button
          className="play-btn"
          onClick={(e) => { e.stopPropagation(); onSelect(category.id); }}
        >
          Start Quiz ▶
        </button>
      </div>
    </div>
  );
}
