import { useState } from 'react';
import { playSound } from '../../../utils/sounds';

// 10 graduated questions about animal sound communication
const QUESTIONS = [
  {
    emoji: '🐶',
    soundText: 'Woof! Woof!',
    name: 'Dog',
    question: 'Who makes the friendly "Woof! Woof!" sound when greeting you?',
    options: [
      { id: 'cat', label: 'Cat 🐱', correct: false },
      { id: 'dog', label: 'Dog 🐶', correct: true },
      { id: 'cow', label: 'Cow 🐮', correct: false },
      { id: 'duck', label: 'Duck 🦆', correct: false },
    ],
    fact: 'Dogs bark to communicate happiness, warnings, or ask to play! 🐶'
  },
  {
    emoji: '🐱',
    soundText: 'Meow! Purr...',
    name: 'Cat',
    question: 'Which fluffy pet purrs softly when feeling cozy and happy?',
    options: [
      { id: 'cat', label: 'Cat 🐱', correct: true },
      { id: 'lion', label: 'Lion 🦁', correct: false },
      { id: 'pig', label: 'Pig 🐷', correct: false },
      { id: 'frog', label: 'Frog 🐸', correct: false },
    ],
    fact: 'Cats purr when they feel safe and comfortable! 🐱'
  },
  {
    emoji: '🐮',
    soundText: 'Moo-ooo!',
    name: 'Cow',
    question: 'Which farm animal says "Moo-ooo" while grazing in green fields?',
    options: [
      { id: 'horse', label: 'Horse 🐴', correct: false },
      { id: 'sheep', label: 'Sheep 🐑', correct: false },
      { id: 'cow', label: 'Cow 🐮', correct: true },
      { id: 'rooster', label: 'Rooster 🐓', correct: false },
    ],
    fact: 'Cows call out "Moo" to talk to their calves and friends in the herd! 🐮'
  },
  {
    emoji: '🐸',
    soundText: 'Ribbit! Croak!',
    name: 'Frog',
    question: 'Which amphibian croaks "Ribbit!" near ponds on rainy evenings?',
    options: [
      { id: 'frog', label: 'Frog 🐸', correct: true },
      { id: 'snake', label: 'Snake 🐍', correct: false },
      { id: 'turtle', label: 'Turtle 🐢', correct: false },
      { id: 'fish', label: 'Fish 🐟', correct: false },
    ],
    fact: 'Frogs croak loudest during rain to sing to each other near water! 🐸'
  },
  {
    emoji: '🦁',
    soundText: 'ROAR!',
    name: 'Lion',
    question: 'Which mighty jungle king utters a powerful "ROAR!" heard miles away?',
    options: [
      { id: 'bear', label: 'Bear 🐻', correct: false },
      { id: 'lion', label: 'Lion 🦁', correct: true },
      { id: 'elephant', label: 'Elephant 🐘', correct: false },
      { id: 'wolf', label: 'Wolf 🐺', correct: false },
    ],
    fact: 'A lion\'s roar can be heard up to 8 kilometers (5 miles) away! 🦁'
  },
  {
    emoji: '🦉',
    soundText: 'Hoot! Hoot!',
    name: 'Owl',
    question: 'Which nocturnal bird hoots "Hoot! Hoot!" in the quiet night forest?',
    options: [
      { id: 'parrot', label: 'Parrot 🦜', correct: false },
      { id: 'owl', label: 'Owl 🦉', correct: true },
      { id: 'eagle', label: 'Eagle 🦅', correct: false },
      { id: 'duck', label: 'Duck 🦆', correct: false },
    ],
    fact: 'Owls hoot at night to mark their home territory in the trees! 🦉'
  },
  {
    emoji: '🐬',
    soundText: 'Click-Click! Whistle!',
    name: 'Dolphin',
    question: 'Which smart marine mammal uses clicking sounds and high whistles to talk underwater?',
    options: [
      { id: 'shark', label: 'Shark 🦈', correct: false },
      { id: 'dolphin', label: 'Dolphin 🐬', correct: true },
      { id: 'crab', label: 'Crab 🦀', correct: false },
      { id: 'octopus', label: 'Octopus 🐙', correct: false },
    ],
    fact: 'Dolphins have unique signature whistles — just like human names! 🐬'
  },
  {
    emoji: '🐝',
    soundText: 'Bzzzz-Bzzzz!',
    name: 'Bee',
    question: 'Which little pollinator buzzes "Bzzzz!" while collecting nectar from flowers?',
    options: [
      { id: 'bee', label: 'Honeybee 🐝', correct: true },
      { id: 'fly', label: 'Butterfly 🦋', correct: false },
      { id: 'ant', label: 'Ant 🐜', correct: false },
      { id: 'ladybug', label: 'Ladybug 🐞', correct: false },
    ],
    fact: 'The buzzing sound comes from a bee flapping its wings 200 times per second! 🐝'
  },
  {
    emoji: '🐘',
    soundText: 'Trumpet! Pawoo!',
    name: 'Elephant',
    question: 'Which giant land mammal trumpets loudly through its long trunk?',
    options: [
      { id: 'rhino', label: 'Rhino 🦏', correct: false },
      { id: 'hippo', label: 'Hippo 🦛', correct: false },
      { id: 'elephant', label: 'Elephant 🐘', correct: true },
      { id: 'giraffe', label: 'Giraffe 🦒', correct: false },
    ],
    fact: 'Elephants also make deep rumble sounds that travel through the ground! 🐘'
  },
  {
    emoji: '🐺',
    soundText: 'Awoo-ooo!',
    name: 'Wolf',
    question: 'Which pack animal howls "Awoo-ooo!" under the glowing full moon?',
    options: [
      { id: 'fox', label: 'Fox 🦊', correct: false },
      { id: 'wolf', label: 'Wolf 🐺', correct: true },
      { id: 'coyote', label: 'Hyena hyena', correct: false },
      { id: 'tiger', label: 'Tiger 🐅', correct: false },
    ],
    fact: 'Wolves howl to assemble their pack and communicate across long distances! 🐺'
  }
];

const AnimalSoundsLab = ({ onBack }) => {
  const [index, setIndex] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [solved, setSolved] = useState(false);
  const [wrongFlash, setWrongFlash] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const q = QUESTIONS[index];

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
    if (index < QUESTIONS.length - 1) {
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
          <div style={{ fontSize: '4rem' }}>🎧🔊</div>
          <h2>Bioacoustic Master!</h2>
          <p>You identified all {QUESTIONS.length} animal communication sounds!</p>
          <p style={{ fontSize: '1.05rem', color: '#666', marginTop: '0.75rem' }}>
            Score: {score} / {QUESTIONS.length} · Every sound helps animals talk and stay safe!
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
        <div>Animal Sounds Lab 🔊</div>
        <div>Sound {index + 1} / {QUESTIONS.length}</div>
        <div>Score: {score}</div>
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${((index + (solved ? 1 : 0)) / QUESTIONS.length) * 100}%` }} />
        </div>
      </div>

      <div style={{ textAlign: 'center', margin: '1.5rem 0' }}>
        <div style={{
          background: 'linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%)',
          borderRadius: '24px',
          padding: '1.5rem',
          maxWidth: '460px',
          margin: '0 auto 1.25rem',
          boxShadow: 'var(--shadow-soft)',
          border: '3px solid #4dd0e1'
        }}>
          <div style={{ fontSize: '4.5rem', marginBottom: '0.5rem' }}>{solved ? q.emoji : '❓'}</div>
          <div style={{
            fontSize: '1.5rem',
            fontWeight: '900',
            color: '#00838f',
            letterSpacing: '0.04em',
            background: 'rgba(255,255,255,0.85)',
            padding: '0.5rem 1rem',
            borderRadius: '16px',
            display: 'inline-block'
          }}>
            "{q.soundText}"
          </div>
          <p style={{ fontSize: '1.05rem', fontWeight: '700', color: '#37474f', marginTop: '0.85rem', lineHeight: '1.35' }}>
            {q.question}
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
            Oops! Listen closely to the sound prompt and try again! 💡
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
            🎉 Correct! It's the {q.name}!
            <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#2e7d32', marginTop: '0.35rem' }}>
              {q.fact}
            </div>
          </div>
        )}
      </div>

      {!solved ? (
        <div className="quiz-options" style={{ maxWidth: '460px', margin: '0 auto' }}>
          {q.options.map((opt) => (
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
            {index < QUESTIONS.length - 1 ? 'Next Animal Sound ➡️' : 'See Results 🏆'}
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

export default AnimalSoundsLab;
