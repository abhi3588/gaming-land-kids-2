import { useState, useCallback } from 'react';
import { playSound } from '../../utils/sounds';

const QuizActivity = ({ quiz, onBack }) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected]   = useState(null);
  const [feedback, setFeedback]   = useState('');
  const [score, setScore]         = useState(0);
  const [completed, setCompleted] = useState(false);

  const question = quiz.questions[currentQ];
  const total    = quiz.questions.length;

  const handleOption = useCallback((option) => {
    if (selected) return;
    setSelected(option);

    if (option === question.answer) {
      playSound('match');
      setFeedback('Correct! 🎉');
      setScore(s => s + 1);
      setTimeout(() => {
        if (currentQ < total - 1) {
          setCurrentQ(q => q + 1);
          setSelected(null);
          setFeedback('');
        } else {
          playSound('celebrate');
          setCompleted(true);
        }
      }, 1200);
    } else {
      playSound('wrong');
      setFeedback(`Oops! The answer is ${question.answer} 😊`);
      setTimeout(() => {
        if (currentQ < total - 1) {
          setCurrentQ(q => q + 1);
          setSelected(null);
          setFeedback('');
        } else {
          playSound('celebrate');
          setCompleted(true);
        }
      }, 1800);
    }
  }, [selected, question, currentQ, total]);

  const handleReset = () => {
    playSound('pop');
    setCurrentQ(0);
    setSelected(null);
    setFeedback('');
    setScore(0);
    setCompleted(false);
  };

  if (completed) {
    const pct = Math.round((score / total) * 100);
    const medal = score === total ? '🥇' : score >= total * 0.7 ? '🥈' : '🥉';
    return (
      <div className="game-view pop-in">
        <div className="champion-screen">
          <div style={{ fontSize: '4rem' }}>{quiz.completionEmoji}</div>
          <h2>{score === total ? 'Perfect Score!' : score >= total * 0.7 ? 'Well Done!' : 'Keep Practising!'}</h2>
          <p style={{ fontSize: '1.15rem', margin: '0.5rem 0 1.5rem' }}>
            You got <strong>{score}</strong> out of <strong>{total}</strong> correct! {medal}
          </p>
          <div className="quiz-score-bar-container">
            <div className="quiz-score-bar" style={{ width: `${pct}%` }} />
          </div>
          <p style={{ fontSize: '1rem', color: '#666', marginTop: '0.75rem' }}>{quiz.completionMessage}</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={handleReset}>Try Again</button>
            <button className="btn" onClick={onBack}>← Back to Quizzes</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="game-view pop-in">
      {/* Header */}
      <div className="game-header">
        <div>{quiz.title}</div>
        <div>Q {currentQ + 1} / {total}</div>
        <div>Score: {score}</div>
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${(currentQ / total) * 100}%` }} />
        </div>
      </div>

      {/* Question area */}
      <div className="quiz-question-area">
        <div className="quiz-big-emoji" key={question.id}>
          {question.emoji}
        </div>
        <h2 className="quiz-question-text">{question.question}</h2>
        {feedback && (
          <p className={`quiz-feedback ${feedback.startsWith('Correct') ? 'quiz-feedback-correct' : 'quiz-feedback-wrong'}`}>
            {feedback}
          </p>
        )}
      </div>

      {/* 4 Options — 2×2 grid */}
      <div className="quiz-options quiz-options-grid">
        {question.options.map((opt) => {
          const isSelected = selected === opt;
          const isCorrect  = opt === question.answer;
          let stateClass   = '';
          if (isSelected && isCorrect)  stateClass = ' quiz-correct';
          if (isSelected && !isCorrect) stateClass = ' quiz-wrong shake';
          if (selected && !isSelected && isCorrect) stateClass = ' quiz-correct'; // reveal correct
          return (
            <button
              key={opt}
              className={`quiz-option-btn quiz-option-text${stateClass}`}
              onClick={() => handleOption(opt)}
              disabled={!!selected}
            >
              {opt}
            </button>
          );
        })}
      </div>

      <div className="detail-back-container">
        <button className="btn btn-back" onClick={onBack}>
          Back to Quizzes
        </button>
      </div>
    </div>
  );
};

export default QuizActivity;
