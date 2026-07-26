import { useState } from "react";
import { playSound } from "../../utils/sounds";
import { TOTAL_LEVELS, getEmojiCipherLevel } from "./puzzle-utils";

// ===== Emoji Cipher Puzzle =====
// Difficulty tiers:
// L1-3: One emoji = one word (single-word answer), 4 choices
// L4-6: Two-emoji phrase (subject + action/object), 4 choices
// L7-9: Three-emoji sentence, more abstract emojis, 4 choices
// L10 : Hardest — 3-4 emojis, idiomatic/tricky mapping, 4 choices

const EmojiCipherPuzzle = ({ puzzle, onBack }) => {
  const [level, setLevel] = useState(1);
  const [data, setData] = useState(() => getEmojiCipherLevel(1));
  const [selected, setSelected] = useState(null);
  const [solved, setSolved] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [gameWon, setGameWon] = useState(false);
  const [allLevelsComplete, setAllLevelsComplete] = useState(false);

  const loadLevel = (nextLevel) => {
    setLevel(nextLevel);
    setData(getEmojiCipherLevel(nextLevel));
    setSelected(null);
    setSolved(false);
    setFeedback("");
  };

  const handleOption = (idx) => {
    if (solved) return;
    setSelected(idx);

    if (idx === data.correctIndex) {
      playSound("match");
      setSolved(true);
      setFeedback(data.successMsg);

      if (level >= TOTAL_LEVELS) {
        setTimeout(() => {
          playSound("celebrate");
          setAllLevelsComplete(true);
          setGameWon(true);
        }, 900);
      } else {
        setTimeout(() => {
          playSound("celebrate");
          loadLevel(level + 1);
        }, 1200);
      }
    } else {
      playSound("wrong");
      setFeedback(data.wrongMsg);
      setTimeout(() => {
        setSelected(null);
        setFeedback("");
      }, 1300);
    }
  };

  const handleReset = () => {
    playSound("pop");
    setGameWon(false);
    setAllLevelsComplete(false);
    loadLevel(1);
  };

  return (
    <div className="game-view pop-in">
      <div className="game-header">
        <div>{puzzle.title}</div>
        <div>Level {level} / {TOTAL_LEVELS}</div>
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${(level / TOTAL_LEVELS) * 100}%` }} />
        </div>
      </div>

      {gameWon ? (
        <div className="champion-screen">
          <div style={{ fontSize: "4rem" }}>{puzzle.completionEmoji}</div>
          <h2>{allLevelsComplete ? "Cipher Master! 🔤" : "Level Complete!"}</h2>
          <p>{puzzle.completionMessage}</p>
          <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
            <button className="btn btn-primary" onClick={handleReset}>Play Again</button>
            <button className="btn btn-back" onClick={() => { if (typeof onBack === "function") onBack(); }}>Main Menu</button>
          </div>
        </div>
      ) : (
        <>
          {/* Cipher scrolll / decode card */}
          <div className="ec-scroll-card">
            <div className="ec-scroll-label">Decode this message:</div>
            <div className="ec-cipher-row">
              {data.emojiSequence.map((em, i) => (
                <div key={i} className="ec-cipher-chip">{em}</div>
              ))}
            </div>
            {/* Hint legend */}
            {data.legend && (
              <div className="ec-legend">
                {data.legend.map((entry, i) => (
                  <div key={i} className="ec-legend-item">
                    <span>{entry.emoji}</span>
                    <span className="ec-legend-eq">=</span>
                    <span className="ec-legend-word">{entry.word}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Feedback strip */}
          {feedback && (
            <div
              className="ww-feedback"
              style={{
                color: solved ? "var(--candy-green)" : "var(--candy-red)",
                background: solved ? "rgba(29,209,161,0.12)" : "rgba(255,107,107,0.10)",
                borderColor: solved ? "var(--candy-green)" : "var(--candy-red)",
              }}
            >
              {feedback}
            </div>
          )}

          {/* Option grid */}
          <div className="ec-options">
            {data.options.map((opt, idx) => {
              let cls = "ec-option-btn";
              if (selected === idx && !solved) cls += " ec-wrong shake";
              if (solved && idx === data.correctIndex) cls += " ec-correct";
              return (
                <button
                  key={idx}
                  className={cls}
                  onClick={() => handleOption(idx)}
                  disabled={solved}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
            <button className="btn btn-back" onClick={() => { if (typeof onBack === "function") onBack(); }}>
              Main Menu
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default EmojiCipherPuzzle;
