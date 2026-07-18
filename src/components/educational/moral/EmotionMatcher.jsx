import { useState } from 'react';
import { playSound } from '../../../utils/sounds';

const EMOTIONS = [
  { id: 'happy', emoji: '😊', label: 'Happy' },
  { id: 'sad', emoji: '😢', label: 'Sad' },
  { id: 'surprised', emoji: '😮', label: 'Surprised' },
  { id: 'scared', emoji: '😨', label: 'Scared' }
];

const SCENARIOS = [
  {
    id: 'share',
    emoji: '🧸',
    text: 'You share your favorite toy with a friend.',
    correct: 'happy',
    why: 'Sharing makes us feel happy and kind!'
  },
  {
    id: 'fall',
    emoji: '🤕',
    text: 'A friend falls down and starts to cry.',
    correct: 'sad',
    why: 'We feel sad when a friend is hurt.'
  },
  {
    id: 'boo',
    emoji: '👻',
    text: 'A friend jumps out and shouts BOO!',
    correct: 'surprised',
    why: 'A sudden surprise makes us jump!'
  },
  {
    id: 'dark',
    emoji: '🌙',
    text: 'You are alone in a dark, quiet room.',
    correct: 'scared',
    why: 'Dark and unknown places can feel scary.'
  },
  {
    id: 'balloon',
    emoji: '🎈',
    text: 'Your favorite balloon floats away into the sky.',
    correct: 'sad',
    why: 'Losing something special can make us sad.'
  },
  {
    id: 'gift',
    emoji: '🎁',
    text: 'You open a gift and find your favorite toy inside!',
    correct: 'happy',
    why: 'A happy surprise fills us with joy!'
  },
  {
    id: 'thunder',
    emoji: '⛈️',
    text: 'Loud thunder booms during a storm.',
    correct: 'scared',
    why: 'Big loud noises can feel frightening.'
  },
  {
    id: 'magic',
    emoji: '🎩',
    text: 'A magician pulls a rabbit from an empty hat!',
    correct: 'surprised',
    why: 'Something unexpected makes us surprised!'
  }
];

const EmotionMatcher = ({ onBack }) => {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null); // chosen emotion id
  const [feedback, setFeedback] = useState(''); // '' | 'right' | 'wrong'
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const scenario = SCENARIOS[index];
  const answered = feedback !== '';

  const handleEmotion = (emotion) => {
    if (answered) return;
    setSelected(emotion.id);
    playSound('pop');

    if (emotion.id === scenario.correct) {
      playSound('match');
      setScore((s) => s + 1);
      setFeedback('right');
    } else {
      playSound('wrong');
      setFeedback('wrong');
    }
  };

  const handleNext = () => {
    playSound('pop');
    if (index < SCENARIOS.length - 1) {
      setIndex((i) => i + 1);
      setSelected(null);
      setFeedback('');
    } else {
      playSound('celebrate');
      setCompleted(true);
    }
  };

  const handleReset = () => {
    playSound('pop');
    setIndex(0);
    setSelected(null);
    setFeedback('');
    setScore(0);
    setCompleted(false);
  };

  if (completed) {
    return (
      <div className="game-view pop-in">
        <div className="champion-screen">
          <div style={{ fontSize: '4rem' }}>😊</div>
          <h2>Emotion Expert!</h2>
          <p>You read {score} out of {SCENARIOS.length} feelings correctly!</p>
          <p style={{ fontSize: '1.1rem', color: '#666', marginTop: '1rem' }}>
            Understanding feelings helps us care for friends and ourselves.
            You are growing a big, kind heart! 💗
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
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
        <div>Emotion Matcher 😊</div>
        <div>Story {index + 1} / {SCENARIOS.length}</div>
        <div>Score: {score}</div>
        <div className="progress-container">
          <div
            className="progress-bar"
            style={{ width: `${((index + (answered ? 1 : 0)) / SCENARIOS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Scenario */}
      <div className="em-scenario">
        <div className="em-scenario-emoji">{scenario.emoji}</div>
        <h2 className="em-scenario-text">{scenario.text}</h2>
        <p className="em-prompt">How does your friend feel?</p>
      </div>

      {/* Feedback */}
      {answered && (
        <div className={`em-feedback ${feedback === 'right' ? 'em-right' : 'em-wrong'}`}>
          {feedback === 'right'
            ? 'Exactly! ' + scenario.why
            : `Not quite — they feel ${EMOTIONS.find((e) => e.id === scenario.correct).label}. ${scenario.why}`}
        </div>
      )}

      {/* Emotion face options */}
      <div className="em-faces">
        {EMOTIONS.map((emotion) => {
          const chosen = selected === emotion.id;
          const showCorrect = answered && emotion.id === scenario.correct;
          const showWrong = answered && chosen && !showCorrect;
          return (
            <button
              key={emotion.id}
              className={`em-face${chosen ? ' chosen' : ''}${showCorrect ? ' correct' : ''}${showWrong ? ' wrong shake' : ''}`}
              onClick={() => handleEmotion(emotion)}
              disabled={answered}
            >
              <span className="em-face-emoji">{emotion.emoji}</span>
              <span className="em-face-label">{emotion.label}</span>
            </button>
          );
        })}
      </div>

      {answered && (
        <div className="detail-back-container">
          <button className="btn btn-primary" onClick={handleNext}>
            {index < SCENARIOS.length - 1 ? 'Next Story ➡️' : 'See Score 🏆'}
          </button>
        </div>
      )}
    </div>
  );
};

export default EmotionMatcher;
