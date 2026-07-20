import { useState } from 'react';
import { playSound } from '../../../utils/sounds';

const SCENARIOS = [
  {
    id: 'delicious-meal',
    emoji: '🍛',
    situation: 'Your grandma cooked a delicious lunch for you. What should you do?',
    options: [
      { id: 'thank-grandma', text: 'Thank her and tell her the food is yummy', correct: true },
      { id: 'eat-run', text: 'Eat quickly and run away to play', correct: false }
    ],
    lesson: 'Saying thank you shows appreciation for the love cooked into your meals!'
  },
  {
    id: 'teacher-help',
    emoji: '👩‍🏫',
    situation: 'Your teacher spent extra time helping you understand a hard math sum. What should you say?',
    options: [
      { id: 'close-book', text: 'Close your book and walk away', correct: false },
      { id: 'say-thanks', text: 'Say thank you for explaining it so well', correct: true }
    ],
    lesson: 'Appreciating those who help you learn makes learning even more fun!'
  },
  {
    id: 'received-gift',
    emoji: '🎁',
    situation: 'You received a birthday gift that you already have. What should you do?',
    options: [
      { id: 'appreciate-kindness', text: 'Thank them and appreciate their sweet gesture', correct: true },
      { id: 'complain-have', text: 'Complain that you already have this toy', correct: false }
    ],
    lesson: 'Gratitude is about valuing the kind thought, not just the gift itself!'
  },
  {
    id: 'friend-shared',
    emoji: '🎨',
    situation: 'Your friend shares their favorite coloring book with you. What should you do?',
    options: [
      { id: 'scribble-ignore', text: 'Scribble on it and ignore their rules', correct: false },
      { id: 'thank-take-care', text: 'Thank them and take good care of their book', correct: true }
    ],
    lesson: 'Being grateful for sharing means treating others\' things with care!'
  },
  {
    id: 'dad-cleans',
    emoji: '🧹',
    situation: 'Your dad cleaned up your playroom after a busy day. What should you do?',
    options: [
      { id: 'say-thanks-help', text: 'Say thank you and offer to help next time', correct: true },
      { id: 'complain-move', text: 'Complain that he moved your favorite toys', correct: false }
    ],
    lesson: 'Recognizing the helpful things parents do makes home a happier place!'
  },
  {
    id: 'compliment',
    emoji: '🌸',
    situation: 'Someone tells you that your flower drawing is very beautiful. What should you do?',
    options: [
      { id: 'ignore-run', text: 'Ignore them and look away', correct: false },
      { id: 'smile-thank', text: 'Smile, say thank you, and feel happy', correct: true }
    ],
    lesson: 'Accepting compliments with a warm thank you shows politeness!'
  },
  {
    id: 'bus-driver',
    emoji: '🚌',
    situation: 'The school bus driver gets you home safely every day. What should you do?',
    options: [
      { id: 'thank-driver', text: 'Say thank you when you step off', correct: true },
      { id: 'ignore', text: 'Run off without a word', correct: false }
    ],
    lesson: 'Thanking those who serve us shows a grateful heart!'
  },
  {
    id: 'friend-help-homework',
    emoji: '📖',
    situation: 'A friend explains a tricky word to you. What should you do?',
    options: [
      { id: 'say-thanks', text: 'Thank them for their patience', correct: true },
      { id: 'shrug', text: 'Shrug and say nothing', correct: false }
    ],
    lesson: 'Gratitude for small kindnesses builds strong friendships!'
  },
  {
    id: 'mom-cooks-breakfast',
    emoji: '🍳',
    situation: 'Mom makes your favorite breakfast before work. What should you do?',
    options: [
      { id: 'appreciate', text: 'Hug her and say it was delicious', correct: true },
      { id: 'complain', text: 'Complain it took too long', correct: false }
    ],
    lesson: 'Noticing others\' efforts fills the home with gratitude!'
  },
  {
    id: 'sibling-share',
    emoji: '🧣',
    situation: 'Your sibling lets you wear their favorite jacket. What should you do?',
    options: [
      { id: 'thank-care', text: 'Thank them and return it clean', correct: true },
      { id: 'keep', text: 'Keep it and never give it back', correct: false }
    ],
    lesson: 'Being thankful for sharing keeps siblings close!'
  }
];

const GratitudeGarden = ({ onBack }) => {
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
      setFeedback('Great choice! You\'re showing gratitude! 🌸');
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
      setFeedback('That\'s not showing gratitude. Try again!');
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

  return (
    <div className="game-view pop-in">
      <div className="game-header">
        <div>Gratitude Garden</div>
        <div>Scenario {currentScenario + 1} / {SCENARIOS.length}</div>
        <div>Score: {score} / {SCENARIOS.length}</div>
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${((currentScenario + 1) / SCENARIOS.length) * 100}%` }} />
        </div>
      </div>

      {completed ? (
        <div className="champion-screen">
          <div style={{ fontSize: '4rem' }}>🌻</div>
          <h2>Gratitude Expert!</h2>
          <p>You completed all scenarios and grew a garden of thankfulness!</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <button className="btn btn-primary" onClick={handleReset}>
              Play Again
            </button>
            <button className="btn btn-back" onClick={() => { if (typeof onBack === 'function') onBack(); }}>
              Back to Moral Education
            </button>
          </div>
        </div>
      ) : (
        <>
          <div style={{ textAlign: 'center', margin: '2rem 0' }}>
            <div style={{ 
              fontSize: '6rem', 
              marginBottom: '1rem',
              animation: 'pop-in 0.5s ease'
            }}>
              {SCENARIOS[currentScenario].emoji}
            </div>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
              {SCENARIOS[currentScenario].situation}
            </h2>
            {feedback && (
              <p style={{ 
                fontSize: '1.2rem', 
                fontWeight: 'bold',
                color: feedback.includes('Great') ? 'var(--candy-green)' : '#ff6b6b',
                marginTop: '1rem'
              }}>
                {feedback}
              </p>
            )}
            {selectedOption && selectedOption.correct && (
              <p style={{ fontSize: '1.05rem', color: '#666', marginTop: '0.5rem', fontStyle: 'italic' }}>
                {SCENARIOS[currentScenario].lesson}
              </p>
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
                  <span>{option.text}</span>
                </button>
              );
            })}
          </div>

          <div className="detail-back-container">
            <button className="btn btn-back" onClick={() => { if (typeof onBack === 'function') onBack(); }}>
              Back to Moral Education
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default GratitudeGarden;
