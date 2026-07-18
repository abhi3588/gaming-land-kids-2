import { useState } from 'react';
import { playSound } from '../../../utils/sounds';

// Each level is an ordered energy chain (sun → plant → ... → top predator).
const LEVELS = [
  {
    title: 'Garden Chain',
    nodes: [
      { id: 'sun', emoji: '☀️', label: 'Sun' },
      { id: 'grass', emoji: '🌱', label: 'Grass' },
      { id: 'rabbit', emoji: '🐰', label: 'Rabbit' },
      { id: 'fox', emoji: '🦊', label: 'Fox' }
    ],
    fact: 'Energy flows from the Sun to plants, then to animals that eat them!'
  },
  {
    title: 'Pond Chain',
    nodes: [
      { id: 'sun', emoji: '☀️', label: 'Sun' },
      { id: 'flower', emoji: '🌸', label: 'Flower' },
      { id: 'bee', emoji: '🐝', label: 'Bee' },
      { id: 'frog', emoji: '🐸', label: 'Frog' }
    ],
    fact: 'Bees drink flower nectar, and frogs love to snack on bees!'
  },
  {
    title: 'Forest Chain',
    nodes: [
      { id: 'sun', emoji: '☀️', label: 'Sun' },
      { id: 'grass', emoji: '🌿', label: 'Grass' },
      { id: 'grasshopper', emoji: '🦗', label: 'Grasshopper' },
      { id: 'frog', emoji: '🐸', label: 'Frog' },
      { id: 'snake', emoji: '🐍', label: 'Snake' }
    ],
    fact: 'Bigger animals eat smaller ones — that is how a food chain grows!'
  }
];

// Fisher–Yates shuffle so the deck order is different each play.
const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const FoodChainConnect = ({ onBack }) => {
  const [levelIndex, setLevelIndex] = useState(0);
  const [deck, setDeck] = useState(() => shuffle(LEVELS[0].nodes));
  const [chain, setChain] = useState([]); // ordered array of node ids placed in slots
  const [checked, setChecked] = useState(false);
  const [slotStatus, setSlotStatus] = useState([]); // 'correct' | 'wrong' per slot
  const [solved, setSolved] = useState(false);

  const level = LEVELS[levelIndex];
  const placedCount = chain.length;

  const resetLevel = (newIndex) => {
    const next = LEVELS[newIndex];
    playSound('pop');
    setLevelIndex(newIndex);
    setDeck(shuffle(next.nodes));
    setChain([]);
    setChecked(false);
    setSlotStatus([]);
    setSolved(false);
  };

  const handleDeckTap = (node) => {
    if (checked || solved) return;
    playSound('pop');
    setChain((prev) => [...prev, node.id]);
    setDeck((prev) => prev.filter((n) => n.id !== node.id));
  };

  // Tap a filled slot to send its card back to the deck (lets kids fix mistakes).
  const handleSlotTap = (index) => {
    if (solved) return;
    if (checked) {
      // Only allow removing slots that were wrong, then re-check fresh.
      if (slotStatus[index] === 'wrong') {
        playSound('pop');
        returnCard(index);
      }
      return;
    }
    playSound('pop');
    returnCard(index);
  };

  const returnCard = (index) => {
    const nodeId = chain[index];
    const node = level.nodes.find((n) => n.id === nodeId);
    setChain((prev) => prev.filter((_, i) => i !== index));
    setDeck((prev) => [...prev, node].sort(() => Math.random() - 0.5));
  };

  const handleCheck = () => {
    if (chain.length !== level.nodes.length) {
      playSound('wrong');
      return;
    }
    const status = chain.map((id, i) => (id === level.nodes[i].id ? 'correct' : 'wrong'));
    setSlotStatus(status);
    setChecked(true);
    const allCorrect = status.every((s) => s === 'correct');
    if (allCorrect) {
      playSound('celebrate');
      setSolved(true);
    } else {
      playSound('wrong');
    }
  };

  const handleNext = () => {
    const next = (levelIndex + 1) % LEVELS.length;
    resetLevel(next);
  };

  // ---- Champion (all levels reviewed) ----
  if (solved && levelIndex === LEVELS.length - 1) {
    return (
      <div className="game-view pop-in">
        <div className="champion-screen">
          <div style={{ fontSize: '4rem' }}>🌞</div>
          <h2>Food Chain Superstar!</h2>
          <p>You built every energy chain from Sun to top predator!</p>
          <p style={{ fontSize: '1.1rem', color: '#666', marginTop: '1rem' }}>
            Every living thing is connected — energy moves from the Sun through
            plants to animals in a big, beautiful circle of life!
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={() => resetLevel(0)}>
              Play Again
            </button>
            <button className="btn" onClick={() => { if (typeof onBack === 'function') onBack(); }}>
              Back to Science
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="game-view pop-in">
      <div className="game-header">
        <div>Food Chain Connect 🌞</div>
        <div>Chain {levelIndex + 1} / {LEVELS.length}</div>
        <div>Placed {placedCount} / {level.nodes.length}</div>
        <div className="progress-container">
          <div
            className="progress-bar"
            style={{ width: `${(placedCount / level.nodes.length) * 100}%` }}
          />
        </div>
      </div>

      <p style={{ textAlign: 'center', fontSize: '1.1rem', color: '#666', margin: '0.25rem 0 1rem' }}>
        Tap the cards to place them in order — from the <b>Sun</b> up to the
        biggest animal! Then tap <b>Check my chain</b>.
      </p>

      {/* The chain with arrows between slots */}
      <div className="fc-board">
        <div className="fc-slots">
          {level.nodes.map((node, i) => {
            const placedId = chain[i];
            const placedNode = placedId ? level.nodes.find((n) => n.id === placedId) : null;
            const status = checked ? slotStatus[i] : null;
            return (
              <div className="fc-slot-wrap" key={i}>
                <button
                  className={`fc-slot${placedNode ? ' filled' : ''}${status ? ' ' + status : ''}`}
                  onClick={() => handleSlotTap(i)}
                  aria-label={placedNode ? `Slot ${i + 1}: ${placedNode.label}` : `Empty slot ${i + 1}`}
                >
                  {placedNode ? (
                    <>
                      <span className="fc-slot-emoji">{placedNode.emoji}</span>
                      <span className="fc-slot-label">{placedNode.label}</span>
                    </>
                  ) : (
                    <span className="fc-slot-num">{i + 1}</span>
                  )}
                </button>
                {i < level.nodes.length - 1 && <span className="fc-arrow">➡️</span>}
              </div>
            );
          })}
        </div>
      </div>

      {checked && !solved && (
        <div className="fc-feedback fc-feedback-wrong">
          Some links are mixed up! 🔁 Tap the red cards to send them back, then try again.
        </div>
      )}

      {/* Pick cards from the shuffled deck */}
      {!solved && (
        <div className="fc-deck">
          {deck.map((node) => (
            <button
              key={node.id}
              className="fc-card"
              onClick={() => handleDeckTap(node)}
              disabled={checked}
            >
              <span className="fc-card-emoji">{node.emoji}</span>
              <span className="fc-card-label">{node.label}</span>
            </button>
          ))}
          {deck.length === 0 && (
            <div className="fc-deck-empty">All cards placed! 👇 Check your chain.</div>
          )}
        </div>
      )}

      {/* Controls */}
      {!solved ? (
        <div className="detail-back-container" style={{ gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            className="btn btn-primary"
            onClick={handleCheck}
            disabled={chain.length !== level.nodes.length}
          >
            Check my chain ✅
          </button>
          <button className="btn" onClick={() => resetLevel(levelIndex)}>
            Shuffle
          </button>
        </div>
      ) : (
        <div className="fc-success">
          <div className="fc-success-badge">🌟 Correct chain! Energy flows this way!</div>
          <p className="fc-fact">{level.fact}</p>
          <div className="detail-back-container" style={{ gap: '0.75rem', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={handleNext}>
              Next Chain ➡️
            </button>
            <button className="btn" onClick={() => { if (typeof onBack === 'function') onBack(); }}>
              Back to Science
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodChainConnect;
