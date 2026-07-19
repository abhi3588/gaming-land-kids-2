import { useState } from 'react';
import { playSound } from '../../../utils/sounds';

const HELPERS = [
  { id: 'firefighter', emoji: '👨‍🚒', name: 'Firefighter', tool: 'hose' },
  { id: 'doctor', emoji: '👩‍⚕️', name: 'Doctor', tool: 'stethoscope' },
  { id: 'teacher', emoji: '👩‍🏫', name: 'Teacher', tool: 'books' },
  { id: 'gardener', emoji: '🧑‍🌾', name: 'Gardener', tool: 'wateringcan' }
];

const TOOLS = [
  { id: 'hose', emoji: '🧯', label: 'Hose' },
  { id: 'stethoscope', emoji: '🩺', label: 'Stethoscope' },
  { id: 'books', emoji: '📚', label: 'Books' },
  { id: 'wateringcan', emoji: '💧', label: 'Watering Can' }
];

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const HelperMatching = ({ onBack }) => {
  const [deck, setDeck] = useState(() => shuffle(TOOLS));
  const [selected, setSelected] = useState(null); // selected tool id from the deck
  const [assigned, setAssigned] = useState({}); // helperId -> toolId
  const [shakeHelper, setShakeHelper] = useState(null);
  const [completed, setCompleted] = useState(false);

  const matchedCount = Object.keys(assigned).length;

  const handleToolTap = (toolId) => {
    if (assigned[toolId]) return;
    playSound('pop');
    setSelected(selected === toolId ? null : toolId);
  };

  const handleHelperTap = (helper) => {
    if (!selected) return;
    if (assigned[helper.id]) return;

    if (helper.tool === selected) {
      playSound('match');
      const next = { ...assigned, [helper.id]: selected };
      setAssigned(next);
      setDeck((prev) => prev.filter((t) => t.id !== selected));
      setSelected(null);
      if (Object.keys(next).length === HELPERS.length) {
        playSound('celebrate');
        setCompleted(true);
      }
    } else {
      playSound('wrong');
      setShakeHelper(helper.id);
      setTimeout(() => setShakeHelper(null), 500);
    }
  };

  const handleRemove = (helperId) => {
    playSound('pop');
    const toolId = assigned[helperId];
    setAssigned((prev) => {
      const next = { ...prev };
      delete next[helperId];
      return next;
    });
    setDeck((prev) => [...prev, TOOLS.find((t) => t.id === toolId)]);
  };

  const handleReset = () => {
    playSound('pop');
    setDeck(shuffle(TOOLS));
    setSelected(null);
    setAssigned({});
    setShakeHelper(null);
    setCompleted(false);
  };

  if (completed) {
    return (
      <div className="game-view pop-in">
        <div className="champion-screen">
          <div style={{ fontSize: '4rem' }}>🦸</div>
          <h2>Helper Hero!</h2>
          <p>You matched every tool to the right community helper!</p>
          <p style={{ fontSize: '1.1rem', color: '#666', marginTop: '1rem' }}>
            Firefighters, doctors, teachers, and gardeners all work hard to help
            us every day. Every job is important — let's respect them all! 💙
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
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
        <div>Helper Matching 🦸</div>
        <div>Matched {matchedCount} / {HELPERS.length}</div>
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${(matchedCount / HELPERS.length) * 100}%` }} />
        </div>
      </div>

      <p style={{ textAlign: 'center', fontSize: '1.1rem', color: '#666', margin: '0.25rem 0 1rem' }}>
        Tap a tool, then tap the helper who uses it. Every helper is a hero! 💪
      </p>

      {/* Helpers as targets */}
      <div className="hm-helpers">
        {HELPERS.map((helper) => {
          const toolId = assigned[helper.id];
          const tool = toolId ? TOOLS.find((t) => t.id === toolId) : null;
          const isSelectedTarget = selected && !tool;
          return (
            <button
              key={helper.id}
              className={`hm-helper${tool ? ' filled' : ''}${isSelectedTarget ? ' target' : ''}${shakeHelper === helper.id ? ' shake' : ''}`}
              onClick={() => handleHelperTap(helper)}
            >
              <span className="hm-helper-emoji">{helper.emoji}</span>
              <span className="hm-helper-name">{helper.name}</span>
              <span className="hm-helper-slot">
                {tool ? (
                  <span
                    className="hm-tool-placed"
                    onClick={(e) => { e.stopPropagation(); handleRemove(helper.id); }}
                    role="button"
                    aria-label={`Remove ${tool.label}`}
                  >
                    {tool.emoji}
                  </span>
                ) : (
                  <span className="hm-helper-hint">{isSelectedTarget ? 'Tap me!' : '?'}</span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tool deck */}
      <div className="hm-tools">
        {deck.map((tool) => (
          <button
            key={tool.id}
            className={`hm-tool${selected === tool.id ? ' selected' : ''}`}
            onClick={() => handleToolTap(tool.id)}
          >
            <span className="hm-tool-emoji">{tool.emoji}</span>
            <span className="hm-tool-label">{tool.label}</span>
          </button>
        ))}
        {deck.length === 0 && (
          <div className="hm-deck-empty">All tools placed! 🎉</div>
        )}
      </div>

      <div className="detail-back-container">
        <button className="btn btn-back" onClick={() => { if (typeof onBack === 'function') onBack(); }}>
          Back to Moral Education
        </button>
      </div>
    </div>
  );
};

export default HelperMatching;
