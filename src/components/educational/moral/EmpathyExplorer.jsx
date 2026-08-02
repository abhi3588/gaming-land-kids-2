import { useState } from 'react';
import { playSound } from '../../../utils/sounds';

// 10 graduated moral scenarios on emotional empathy & feelings awareness
const SCENARIOS = [
  {
    emoji: '😢',
    situation: 'Your classmate drops their ice cream cone and starts crying. How do you show empathy?',
    options: [
      { id: 'comfort', text: 'Walk over, comfort them, and offer to share your treat 🍦', correct: true },
      { id: 'laugh', text: 'Laugh out loud and point at the melted ice cream 😆', correct: false },
      { id: 'run', text: 'Run away quickly without saying anything 🏃', correct: false },
    ],
    lesson: 'Empathy means understanding someone else\'s sadness and offering comfort!'
  },
  {
    emoji: '💔',
    situation: 'A new student is sitting all alone on the playground bench looking shy. What should you do?',
    options: [
      { id: 'ignore', text: 'Ignore them and play only with old friends 🙈', correct: false },
      { id: 'invite', text: 'Smile, say hello, and invite them to join your game 🤝', correct: true },
      { id: 'whisper', text: 'Whisper secrets about them 🤫', correct: false },
    ],
    lesson: 'Including others makes everyone feel welcomed and valued!'
  },
  {
    emoji: '😤',
    situation: 'Your friend accidentally knocks down your tall block tower. You feel very angry! What is the best step?',
    options: [
      { id: 'breath', text: 'Take a deep star breath and say, "It\'s okay, let\'s rebuild together!" 🌬️', correct: true },
      { id: 'kick', text: 'Kick their blocks and yell angrily 🗯️', correct: false },
      { id: 'push', text: 'Push them down 🖐️', correct: false },
    ],
    lesson: 'Managing your anger calmly keeps friendships safe and happy!'
  },
  {
    emoji: '🎨',
    situation: 'Your friend worked hard on a drawing, but it turned out a bit messy. What kind words can you share?',
    options: [
      { id: 'ugly', text: 'Tell them their picture looks silly and bad 👎', correct: false },
      { id: 'praise', text: 'Praise their bright colors and effort: "Great job trying!" 🌟', correct: true },
      { id: 'tear', text: 'Rip up the paper 📄', correct: false },
    ],
    lesson: 'Encouraging words build confidence and joy in others!'
  },
  {
    emoji: '🎁',
    situation: 'You receive a sweater present that is not your favorite color. How do you respond politely?',
    options: [
      { id: 'thanks', text: 'Smile and say "Thank you for thinking of me!" 💝', correct: true },
      { id: 'frown', text: 'Throw it on the floor and complain out loud 😡', correct: false },
      { id: 'hide', text: 'Tell them it\'s terrible 🙈', correct: false },
    ],
    lesson: 'Showing gratitude for thoughtfulness matters more than the item itself!'
  },
  {
    emoji: '🩹',
    situation: 'Your teammate falls on the grass and scrapes their knee during tag. What do you do?',
    options: [
      { id: 'keep-running', text: 'Keep running past them to win the game 🏃', correct: false },
      { id: 'help-up', text: 'Stop playing, help them up, and call a teacher or parent 🩹', correct: true },
      { id: 'tease', text: 'Tease them for falling down 😜', correct: false },
    ],
    lesson: 'Caring for a hurt friend is always more important than winning a game!'
  },
  {
    emoji: '👂',
    situation: 'Your friend is telling a story about their pet, but you want to talk about your toy right now. What do you do?',
    options: [
      { id: 'listen', text: 'Listen attentively without interrupting until they finish 👂', correct: true },
      { id: 'interrupt', text: 'Shout over them to talk about your toy 📢', correct: false },
      { id: 'walk-away', text: 'Walk away while they are mid-sentence 🚶', correct: false },
    ],
    lesson: 'Active listening shows respect and caring for your friend\'s voice!'
  },
  {
    emoji: '🌧️',
    situation: 'Your brother is feeling sad because his soccer match was cancelled by rain. How can you cheer him up?',
    options: [
      { id: 'gloat', text: 'Say "I am glad it rained!" 🌧️', correct: false },
      { id: 'cheer', text: 'Offer to play a fun board game indoors together 🎲', correct: true },
      { id: 'tease', text: 'Tease him about the bad weather ☔', correct: false },
    ],
    lesson: 'Finding indoor fun together lifts a sad friend\'s spirits!'
  },
  {
    emoji: '👥',
    situation: 'Two friends disagree on which game to play at recess. As an empathy hero, what do you suggest?',
    options: [
      { id: 'compromise', text: 'Suggest playing one game first, then switching to the other game! 🤝', correct: true },
      { id: 'fight', text: 'Tell them to fight about it 🥊', correct: false },
      { id: 'side', text: 'Pick a side and exclude the other friend 🚫', correct: false },
    ],
    lesson: 'Compromise and fairness make sure everybody gets to participate!'
  },
  {
    emoji: '🏆',
    situation: 'Your friend wins 1st place in the art contest and you get 2nd place. How do you act?',
    options: [
      { id: 'pout', text: 'Pout and refuse to speak to them 😠', correct: false },
      { id: 'congratulate', text: 'Give them a big high-five and say "Congratulations! You earned it!" ✋🌟', correct: true },
      { id: 'claim', text: 'Claim the judges made a mistake 👎', correct: false },
    ],
    lesson: 'Celebrating other people\'s success is the mark of a true Empathy Hero!'
  }
];

const EmpathyExplorer = ({ onBack }) => {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const scenario = SCENARIOS[currentScenario];

  const handleOption = (option) => {
    if (selectedOption) return;
    setSelectedOption(option);

    if (option.correct) {
      playSound('match');
      setFeedback('Empathy Hero Choice! 🌟');
      setScore((s) => s + 1);

      setTimeout(() => {
        if (currentScenario < SCENARIOS.length - 1) {
          setCurrentScenario((prev) => prev + 1);
          setSelectedOption(null);
          setFeedback('');
        } else {
          playSound('celebrate');
          setCompleted(true);
        }
      }, 2000);
    } else {
      playSound('wrong');
      setFeedback('Think about how they feel. Try again!');
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

  if (completed) {
    return (
      <div className="game-view pop-in">
        <div className="champion-screen">
          <div style={{ fontSize: '4rem' }}>💖🤝✨</div>
          <h2>Empathy Champion!</h2>
          <p>You made {score} empathetic choices out of {SCENARIOS.length}!</p>
          <p style={{ fontSize: '1.05rem', color: '#666', marginTop: '1rem' }}>
            Understanding feelings and spreading warmth makes you a true superhero in daily life!
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
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
        <div>Empathy Explorer 💖</div>
        <div>Story {currentScenario + 1} / {SCENARIOS.length}</div>
        <div>Score: {score} / {SCENARIOS.length}</div>
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${((currentScenario + 1) / SCENARIOS.length) * 100}%` }} />
        </div>
      </div>

      <div style={{ textAlign: 'center', margin: '1.5rem 0' }}>
        <div style={{ fontSize: '5rem', marginBottom: '0.75rem', animation: 'pop-in 0.5s ease' }}>
          {scenario.emoji}
        </div>
        <h2 style={{ fontSize: '1.3rem', color: '#6a1b9a', maxWidth: '540px', margin: '0 auto 1rem', lineHeight: '1.4' }}>
          {scenario.situation}
        </h2>
        {feedback && (
          <div style={{
            fontSize: '1.05rem',
            fontWeight: 'bold',
            color: feedback.includes('Empathy Hero') ? 'var(--candy-green)' : '#ff6b6b',
            marginBottom: '1rem',
            padding: '0.85rem',
            background: feedback.includes('Empathy Hero') ? 'rgba(29,209,161,0.1)' : 'rgba(255,107,107,0.1)',
            borderRadius: '14px',
            maxWidth: '540px',
            margin: '0 auto 1rem'
          }}>
            {feedback}
            {feedback.includes('Empathy Hero') && (
              <div style={{ fontSize: '0.9rem', fontWeight: '600', marginTop: '0.4rem', color: '#4a148c' }}>
                {scenario.lesson}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="quiz-options" style={{ maxWidth: '540px', margin: '0 auto' }}>
        {scenario.options.map((option) => {
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

      <div className="detail-back-container" style={{ marginTop: '1.5rem' }}>
        <button className="btn btn-back" onClick={() => { if (typeof onBack === 'function') onBack(); }}>
          Back to Moral Education
        </button>
      </div>
    </div>
  );
};

export default EmpathyExplorer;
