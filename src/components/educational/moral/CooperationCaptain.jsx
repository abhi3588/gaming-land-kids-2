import { useState } from 'react';
import { playSound } from '../../../utils/sounds';

const SCENARIOS = [
  {
    id: 'cleanup',
    emoji: '🧹',
    situation: 'Toys are scattered all over the floor. What do you do?',
    options: [
      { id: 'team-up', text: 'Clean up together with a friend', correct: true },
      { id: 'leave', text: 'Leave them and walk away', correct: false }
    ],
    lesson: 'Teamwork makes cleaning up fast and fun!'
  },
  {
    id: 'project',
    emoji: '🏗️',
    situation: 'Your class has a big art project. What do you do?',
    options: [
      { id: 'help', text: 'Work with classmates on it', correct: true },
      { id: 'alone', text: 'Refuse and do your own thing', correct: false }
    ],
    lesson: 'Working together builds something amazing!'
  },
  {
    id: 'sports',
    emoji: '⚽',
    situation: 'You\'re playing soccer and a teammate has the ball. What do you do?',
    options: [
      { id: 'support', text: 'Run to help and cheer them on', correct: true },
      { id: 'grab', text: 'Shout and grab the ball away', correct: false }
    ],
    lesson: 'Good teammates help each other win together!'
  },
  {
    id: 'blocks',
    emoji: '🧱',
    situation: 'You and a friend are building a tall tower. What do you do?',
    options: [
      { id: 'build-together', text: 'Take turns adding blocks', correct: true },
      { id: 'push', text: 'Knock their blocks down', correct: false }
    ],
    lesson: 'Cooperating builds the tallest towers!'
  },
  {
    id: 'garden',
    emoji: '🌱',
    situation: 'The school garden needs watering. What do you do?',
    options: [
      { id: 'team', text: 'Share the watering can with friends', correct: true },
      { id: 'hog', text: 'Keep the can all to yourself', correct: false }
    ],
    lesson: 'Sharing the work helps the garden grow!'
  },
  {
    id: 'race',
    emoji: '🏁',
    situation: 'Your team is in a relay race. What do you do?',
    options: [
      { id: 'cheer', text: 'Cheer and pass the baton smoothly', correct: true },
      { id: 'quit', text: 'Quit because you might lose', correct: false }
    ],
    lesson: 'A team wins when everyone tries their best!'
  }
];

const CooperationCaptain = ({ onBack }) => {
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
      setFeedback('Great teamwork! You\'re a Cooperation Captain! 🌟');
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
      setFeedback('That\'s not teamwork. Try again!');
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
          <h2>Cooperation Captain!</h2>
          <p>You made {score} teamwork choices out of {SCENARIOS.length}!</p>
          <p style={{ fontSize: '1.1rem', color: '#666', marginTop: '1rem' }}>
            Cleaning up, building, and playing together gets the job done!
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <button className="btn btn-primary" onClick={handleReset}>
              Play Again
            </button>
            <button className="btn btn-back" onClick={() => { if (typeof onBack === 'function') onBack(); }}>
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
        <div>Cooperation Captain 🏗️</div>
        <div>Challenge {currentScenario + 1} / {SCENARIOS.length}</div>
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
            color: feedback.includes('Great teamwork') ? 'var(--candy-green)' : '#ff6b6b',
            marginBottom: '1rem',
            padding: '1rem',
            background: feedback.includes('Great teamwork') ? 'rgba(29,209,161,0.1)' : 'rgba(255,107,107,0.1)',
            borderRadius: '12px'
          }}>
            {feedback}
            {feedback.includes('Great teamwork') && (
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

export default CooperationCaptain;
