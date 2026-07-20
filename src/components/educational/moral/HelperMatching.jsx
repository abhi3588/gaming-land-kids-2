import { useState } from 'react';
import { playSound } from '../../../utils/sounds';

const HELPERS = [
  { id: 'firefighter', emoji: '🧑‍🚒', name: 'Firefighter', tool: 'hose' },
  { id: 'doctor', emoji: '👩‍⚕️', name: 'Doctor', tool: 'stethoscope' },
  { id: 'teacher', emoji: '👩‍🏫', name: 'Teacher', tool: 'books' },
  { id: 'gardener', emoji: '🧑‍🌾', name: 'Gardener', tool: 'wateringcan' },
  { id: 'chef', emoji: '👨‍🍳', name: 'Chef', tool: 'pan' },
  { id: 'pilot', emoji: '🧑‍✈️', name: 'Pilot', tool: 'plane' },
  { id: 'painter', emoji: '🧑‍🎨', name: 'Painter', tool: 'brush' },
  { id: 'builder', emoji: '👷', name: 'Builder', tool: 'hammer' },
  { id: 'police', emoji: '👮', name: 'Police Officer', tool: 'badge' },
  { id: 'dentist', emoji: '🦷', name: 'Dentist', tool: 'toothbrush' },
  { id: 'astronaut', emoji: '🧑‍🚀', name: 'Astronaut', tool: 'rocket' },
  { id: 'mail', emoji: '📮', name: 'Mail Carrier', tool: 'envelope' }
];

const TOOLS = [
  { id: 'hose', emoji: '🧯', label: 'Hose' },
  { id: 'stethoscope', emoji: '🩺', label: 'Stethoscope' },
  { id: 'books', emoji: '📚', label: 'Books' },
  { id: 'wateringcan', emoji: '💧', label: 'Watering Can' },
  { id: 'pan', emoji: '🍳', label: 'Pan' },
  { id: 'plane', emoji: '🛩️', label: 'Plane' },
  { id: 'brush', emoji: '🖌️', label: 'Brush' },
  { id: 'hammer', emoji: '🔨', label: 'Hammer' },
  { id: 'badge', emoji: '🚓', label: 'Badge' },
  { id: 'toothbrush', emoji: '🪥', label: 'Toothbrush' },
  { id: 'rocket', emoji: '🚀', label: 'Rocket' },
  { id: 'envelope', emoji: '✉️', label: 'Envelope' }
];

// 10 graduated rounds. Each round is a fresh matching board of helpers → tools.
//  - Rounds 1–2: 3 helpers
//  - Rounds 3–5: 4–5 helpers
//  - Rounds 6–8: 5 helpers
//  - Rounds 9–10: 6 helpers
// A wrong tool stops the child (plays `wrong`) and lets them try again — no
// advancing until every helper is matched correctly.
const ROUNDS = [
  ['firefighter', 'doctor', 'teacher'],
  ['gardener', 'chef', 'pilot'],
  ['painter', 'builder', 'police', 'dentist'],
  ['astronaut', 'mail', 'firefighter', 'teacher'],
  ['doctor', 'gardener', 'chef', 'pilot', 'painter'],
  ['builder', 'police', 'dentist', 'astronaut', 'mail'],
  ['firefighter', 'doctor', 'teacher', 'gardener', 'chef', 'pilot'],
  ['painter', 'builder', 'police', 'dentist', 'astronaut', 'mail'],
  ['doctor', 'teacher', 'police', 'dentist', 'astronaut', 'mail'],
  ['firefighter', 'gardener', 'chef', 'painter', 'builder', 'pilot']
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
  const [roundIndex, setRoundIndex] = useState(0);
  const [deck, setDeck] = useState(() => {
    const rh = HELPERS.filter((h) => ROUNDS[0].includes(h.id));
    return shuffle(rh.map((h) => TOOLS.find((t) => t.id === h.tool)));
  });
  const [selected, setSelected] = useState(null); // selected tool id from the deck
  const [assigned, setAssigned] = useState({}); // helperId -> toolId
  const [shakeHelper, setShakeHelper] = useState(null);
  const [roundSolved, setRoundSolved] = useState(false);
  const [completed, setCompleted] = useState(false);

  const roundHelpers = HELPERS.filter((h) => ROUNDS[roundIndex].includes(h.id));

  // The board for each round is built in handleNext / handleReset (and seeded
  // above for round 1), so no effect is needed to reset between rounds.

  const matchedCount = Object.keys(assigned).length;

  const handleToolTap = (toolId) => {
    if (assigned[toolId] || roundSolved) return;
    playSound('pop');
    setSelected(selected === toolId ? null : toolId);
  };

  const handleHelperTap = (helper) => {
    if (!selected || roundSolved) return;
    if (assigned[helper.id]) return;

    if (helper.tool === selected) {
      playSound('match');
      const next = { ...assigned, [helper.id]: selected };
      setAssigned(next);
      setDeck((prev) => prev.filter((t) => t.id !== selected));
      setSelected(null);
      if (Object.keys(next).length === roundHelpers.length) {
        playSound('celebrate');
        setRoundSolved(true);
      }
    } else {
      playSound('wrong');
      setShakeHelper(helper.id);
      setTimeout(() => setShakeHelper(null), 500);
    }
  };

  const handleRemove = (helperId) => {
    if (roundSolved) return;
    playSound('pop');
    const toolId = assigned[helperId];
    setAssigned((prev) => {
      const next = { ...prev };
      delete next[helperId];
      return next;
    });
    setDeck((prev) => [...prev, TOOLS.find((t) => t.id === toolId)]);
  };

  const handleNext = () => {
    if (roundIndex < ROUNDS.length - 1) {
      const next = roundIndex + 1;
      setRoundIndex(next);
      const rh = HELPERS.filter((h) => ROUNDS[next].includes(h.id));
      setDeck(shuffle(rh.map((h) => TOOLS.find((t) => t.id === h.tool))));
      setAssigned({});
      setSelected(null);
      setShakeHelper(null);
      setRoundSolved(false);
    } else {
      playSound('celebrate');
      setCompleted(true);
    }
  };

  const handleReset = () => {
    playSound('pop');
    setRoundIndex(0);
    const rh = HELPERS.filter((h) => ROUNDS[0].includes(h.id));
    setDeck(shuffle(rh.map((h) => TOOLS.find((t) => t.id === h.tool))));
    setSelected(null);
    setAssigned({});
    setShakeHelper(null);
    setRoundSolved(false);
    setCompleted(false);
  };

  if (completed) {
    return (
      <div className="game-view pop-in">
        <div className="champion-screen">
          <div style={{ fontSize: '4rem' }}>🦸</div>
          <h2>Helper Hero!</h2>
          <p>You matched every tool across all {ROUNDS.length} rounds — what a hero!</p>
          <p style={{ fontSize: '1.1rem', color: '#666', marginTop: '1rem' }}>
            Firefighters, doctors, teachers, gardeners, and more all work hard to help
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
        <div>Round {roundIndex + 1} / {ROUNDS.length}</div>
        <div>Matched {matchedCount} / {roundHelpers.length}</div>
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${(matchedCount / roundHelpers.length) * 100}%` }} />
        </div>
      </div>

      <p style={{ textAlign: 'center', fontSize: '1.1rem', color: '#666', margin: '0.25rem 0 1rem' }}>
        Tap a tool, then tap the helper who uses it. Every helper is a hero! 💪
      </p>

      {/* Helpers as targets */}
      <div className="hm-helpers">
        {roundHelpers.map((helper) => {
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

      {/* Success / controls */}
      {roundSolved ? (
        <div className="fc-success" style={{ marginTop: '1.5rem' }}>
          <div className="fc-success-badge">🌟 Round complete! Every helper got their tool!</div>
          <div className="detail-back-container" style={{ gap: '0.75rem', flexWrap: 'wrap', marginTop: '1rem' }}>
            <button className="btn btn-primary" onClick={handleNext}>
              {roundIndex < ROUNDS.length - 1 ? 'Next Round ➡️' : 'Finish! 🎉'}
            </button>
            <button className="btn btn-back" onClick={() => { if (typeof onBack === 'function') onBack(); }}>
              Back to Moral Education
            </button>
          </div>
        </div>
      ) : (
        <div className="detail-back-container">
          <button className="btn btn-back" onClick={() => { if (typeof onBack === 'function') onBack(); }}>
            Back to Moral Education
          </button>
        </div>
      )}
    </div>
  );
};

export default HelperMatching;
