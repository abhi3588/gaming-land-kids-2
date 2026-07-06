import { useState } from 'react';
import { playSound } from '../../../utils/sounds';

const WEATHER_SCENARIOS = [
  {
    id: 'sunny',
    weather: '☀️ Sunny',
    question: 'What should you wear on a sunny day?',
    options: [
      { id: 'sunglasses', emoji: '🕶️', name: 'Sunglasses', correct: true },
      { id: 'umbrella', emoji: '☂️', name: 'Umbrella', correct: false },
      { id: 'coat', emoji: '🧥', name: 'Coat', correct: false }
    ]
  },
  {
    id: 'rainy',
    weather: '🌧️ Rainy',
    question: 'What do you need when it rains?',
    options: [
      { id: 'umbrella', emoji: '☂️', name: 'Umbrella', correct: true },
      { id: 'sunglasses', emoji: '🕶️', name: 'Sunglasses', correct: false },
      { id: 'sunscreen', emoji: '🧴', name: 'Sunscreen', correct: false }
    ]
  },
  {
    id: 'cloudy',
    weather: '☁️ Cloudy',
    question: 'What should you wear on a cloudy day?',
    options: [
      { id: 'jacket', emoji: '🧥', name: 'Light Jacket', correct: true },
      { id: 'swimsuit', emoji: '👙', name: 'Swimsuit', correct: false },
      { id: 'shorts', emoji: '🩳', name: 'Shorts', correct: false }
    ]
  },
  {
    id: 'snowy',
    weather: '❄️ Snowy',
    question: 'What keeps you warm in the snow?',
    options: [
      { id: 'coat', emoji: '🧥', name: 'Warm Coat', correct: true },
      { id: 'tshirt', emoji: '👕', name: 'T-Shirt', correct: false },
      { id: 'sandals', emoji: '👡', name: 'Sandals', correct: false }
    ]
  },
  {
    id: 'windy',
    weather: '💨 Windy',
    question: 'What protects you on a windy day?',
    options: [
      { id: 'hat', emoji: '🧢', name: 'Hat', correct: true },
      { id: 'sunglasses', emoji: '🕶️', name: 'Sunglasses', correct: false },
      { id: 'swimsuit', emoji: '👙', name: 'Swimsuit', correct: false }
    ]
  }
];

const WeatherWatcher = ({ onBack }) => {
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
      setFeedback('Great job! 🎉');
      setScore(prev => prev + 1);
      
      setTimeout(() => {
        if (currentScenario < WEATHER_SCENARIOS.length - 1) {
          setCurrentScenario(prev => prev + 1);
          setSelectedOption(null);
          setFeedback('');
        } else {
          playSound('celebrate');
          setCompleted(true);
        }
      }, 1500);
    } else {
      playSound('wrong');
      setFeedback('Try again! Think about the weather.');
      setTimeout(() => {
        setSelectedOption(null);
        setFeedback('');
      }, 1500);
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
        <div>Weather Watcher</div>
        <div>Scenario {currentScenario + 1} / {WEATHER_SCENARIOS.length}</div>
        <div>Score: {score} / {WEATHER_SCENARIOS.length}</div>
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${((currentScenario + 1) / WEATHER_SCENARIOS.length) * 100}%` }} />
        </div>
      </div>

      {completed ? (
        <div className="champion-screen">
          <div style={{ fontSize: '4rem' }}>🌤️</div>
          <h2>Weather Expert!</h2>
          <p>You got {score} out of {WEATHER_SCENARIOS.length} correct!</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <button className="btn btn-primary" onClick={handleReset}>
              Play Again
            </button>
            <button className="btn"  onClick={() => { if (typeof onBack === 'function') onBack(); }}>
              Back to Science
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
              {WEATHER_SCENARIOS[currentScenario].weather}
            </div>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
              {WEATHER_SCENARIOS[currentScenario].question}
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
          </div>

          <div className="quiz-options">
            {WEATHER_SCENARIOS[currentScenario].options.map((option) => {
              const isSelected = selectedOption === option;
              const isCorrect = option.correct;
              
              return (
                <button
                  key={option.id}
                  className={`quiz-option-btn${isSelected && isCorrect ? ' quiz-correct' : isSelected && !isCorrect ? ' quiz-wrong shake' : ''}`}
                  onClick={() => handleOption(option)}
                  disabled={selectedOption !== null}
                >
                  <span className="quiz-emoji">{option.emoji}</span>
                  <span>{option.name}</span>
                </button>
              );
            })}
          </div>

          <div className="detail-back-container">
            <button className="btn btn-back" onClick={() => { if (typeof onBack === 'function') onBack(); }}>
              Back to Science
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default WeatherWatcher;
