import { QUIZ_CATEGORIES, QUIZ_DATA } from './quiz-data.js';
import QuizActivity from './QuizActivity.jsx';
import { playSound } from '../../utils/sounds.js';
import { useParams, useNavigate } from 'react-router-dom';
import { useItemSEO } from '../../utils/useSEO.jsx';

export default function QuizTab() {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleSelect = (catId) => {
    playSound('pop');
    navigate('/quiz/' + catId);
  };

  if (id) {
    const quiz = QUIZ_DATA[id];
    if (!quiz) {
      return (
        <div>
          <div className="section-header">
            <h2>📝 Quiz Corner</h2>
          </div>
          <p>Quiz not found.</p>
          <button className="play-btn" onClick={() => navigate('/quiz')}>
            ← Back to Quizzes
          </button>
        </div>
      );
    }

    // Merge category meta (desc/ageRange) and ensure id is present for the activity + SEO.
    const category = QUIZ_CATEGORIES.find((c) => c.id === id);
    const quizWithMeta = {
      ...quiz,
      id,
      desc: quiz.desc || category?.desc,
      ageRange: quiz.ageRange || category?.ageRange
    };

    return (
      <div>
        <QuizSEO />
        <QuizActivity quiz={quizWithMeta} onBack={() => navigate('/quiz')} />
      </div>
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
      <h3>{category.title}</h3>
      <div className="activity-subtitle">Ages {category.ageRange} · 20 Questions</div>
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

function QuizSEO() {
  const { id } = useParams();
  const quiz = QUIZ_DATA[id];
  const category = QUIZ_CATEGORIES.find((c) => c.id === id);
  const quizWithId = quiz
    ? { ...quiz, id, desc: quiz.desc || category?.desc, ageRange: quiz.ageRange || category?.ageRange }
    : null;
  return useItemSEO('quiz', quizWithId);
}
