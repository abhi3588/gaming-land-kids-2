import { useState } from 'react';
import { playSound } from '../../../utils/sounds';

const SCENARIOS = [
  {
    id: 'toy',
    emoji: '🧸',
    situation: 'Your friend comes over and loves your favorite teddy bear. What do you do?',
    options: [
      { id: 'share', text: 'Let them hold and play with it for a while', correct: true },
      { id: 'hide', text: 'Hide it so they can\'t touch it', correct: false }
    ],
    lesson: 'Sharing a toy makes playtime fun for everyone!'
  },
  {
    id: 'snack',
    emoji: '🍕',
    situation: 'You have a slice of pizza and your sibling has none. What do you do?',
    options: [
      { id: 'share', text: 'Offer to share a piece', correct: true },
      { id: 'keep', text: 'Eat it all by yourself', correct: false }
    ],
    lesson: 'Sharing food shows you care about others!'
  },
  {
    id: 'attention',
    emoji: '👶',
    situation: 'Your baby brother is crying and wants mom\'s attention while you play. What do you do?',
    options: [
      { id: 'help', text: 'Help mom by playing quietly nearby', correct: true },
      { id: 'yell', text: 'Yell to get attention first', correct: false }
    ],
    lesson: 'Sharing attention with family shows love!'
  },
  {
    id: 'crayons',
    emoji: '🖍️',
    situation: 'A friend wants to use your crayons but you\'re using them. What do you do?',
    options: [
      { id: 'take-turns', text: 'Take turns coloring together', correct: true },
      { id: 'refuse', text: 'Say no and keep them all', correct: false }
    ],
    lesson: 'Taking turns is a kind way to share!'
  },
  {
    id: 'book',
    emoji: '📚',
    situation: 'Your cousin wants to read your favorite book. What do you do?',
    options: [
      { id: 'read-together', text: 'Read it together', correct: true },
      { id: 'say-no', text: 'Tell them they can\'t see it', correct: false }
    ],
    lesson: 'Sharing a story doubles the fun!'
  },
  {
    id: 'birthday',
    emoji: '🎂',
    situation: 'You get a birthday cupcake. Your friend looks hungry. What do you do?',
    options: [
      { id: 'share', text: 'Split it so you both taste it', correct: true },
      { id: 'eat-all', text: 'Eat the whole thing quickly', correct: false }
    ],
    lesson: 'Sharing a treat makes everyone smile!'
  }
];

const SharingCaring = ({ onBack }) => {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const handleOption = (option) => {
    if (selectedOption) return;

    setSelectedOption(option);

    if (option.correct) {
      playSound('match');
      setFeedback('So kind! You\'re sharing and caring! 🌟');
      setScore(prev => prev + 1);

      setTimeout(() => {
        if (currentScenario < SCENARIOS.length - 1) {
          setCurrentScenario(prev => prev + 1);
          setSelectedOption(null);
          setFeedback('');
        } else {
          playSound('celebrate');
          setCompleted(true);
        }
      }, 2000);
    } else {
      playSound('wrong');
      setFeedback('That\'s not very sharing. Try again!');
      setTimeout(() => {
        setSelectedOption(null);
        setFeedback('');
      }, 2000);
    }
  };

  const handleReset = () => {
    playSound('pop');
    setCurrentScenario(0);
    setSelectedOption(null);
    setFeedback('');
    setCompleted(false);
    setScore(0);
  };

  if (completed) {
    return (
      <div className="game-view pop-in">
        <div className="champion-screen">
          <div style={{ fontSize: '4rem' }}>🤝</div>
          <h2>Sharing Star!</h2>
          <p>You made {score} kind choices out of {SCENARIOS.length}!</p>
          <p style={{ fontSize: '1.1rem', color: '#666', marginTop: '1rem' }}>
            Sharing toys, snacks, and attention makes the world a happier place!
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <button className="btn btn-primary" onClick={handleReset}>
              Play Again
            </button>
            <button className="btn" onClick={() => { if (typeof onBack === 'function') onBack(); }}>
              Back to Moral Education
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="game-view pop-in">
      <div className="game-header">
        <div>Sharing & Caring 🧸</div>
        <div>Story {currentScenario + 1} / {SCENARIOS.length}</div>
        <div>Score: {score} / {SCENARIOS.length}</div>
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${((currentScenario + 1) / SCENARIOS.length) * 100}%` }} />
        </div>
      </div>

      <div style={{ textAlign: 'center', margin: '2rem 0' }}>
        <div style={{ fontSize: '6rem', marginBottom: '1rem', animation: 'pop-in 0.5s ease' }}>
          {SCENARIOS[currentScenario].emoji}
        </div>
        <h2 style={{ fontSize: '1.4rem', color: 'var(--color-primary)', marginBottom: '1rem', maxWidth: '600px', margin: '0 auto 1rem' }}>
          {SCENARIOS[currentScenario].situation}
        </h2>
        {feedback && (
          <div style={{
            fontSize: '1.1rem',
            fontWeight: 'bold',
            color: feedback.includes('So kind') ? 'var(--candy-green)' : '#ff6b6b',
            marginBottom: '1rem',
            padding: '1rem',
            background: feedback.includes('So kind') ? 'rgba(29,209,161,0.1)' : 'rgba(255,107,107,0.1)',
            borderRadius: '12px'
          }}>
            {feedback}
            {feedback.includes('So kind') && (
              <div style={{ fontSize: '0.95rem', fontWeight: 'normal', marginTop: '0.5rem', color: '#666' }}>
                {SCENARIOS[currentScenario].lesson}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="quiz-options">
        {SCENARIOS[currentScenario].options.map((option) => {
          const isSelected = selectedOption === option;
          const isCorrect = option.correct;

          return (
            <button
              key={option.id}
              className={`quiz-option-btn quiz-text-btn${isSelected && isCorrect ? ' quiz-correct' : isSelected && !isCorrect ? ' quiz-wrong shake' : ''}`}
              onClick={() => handleOption(option)}
              disabled={selectedOption !== null}
            >
              {option.text}
            </button>
          );
        })}
      </div>

      <div className="detail-back-container">
        <button className="btn btn-back" onClick={() => { if (typeof onBack === 'function') onBack(); }}>
          Back to Moral Education
        </button>
      </div>
    </div>
  );
};

export default SharingCaring;
