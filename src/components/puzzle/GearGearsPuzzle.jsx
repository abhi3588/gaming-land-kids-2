import { useState } from "react";
import { playSound } from "../../utils/sounds";
import { TOTAL_LEVELS, getGearGearsLevel } from "./puzzle-utils";

// ===== Gear Gears Puzzle =====
// Difficulty Tiers across 10 Levels:
// L1-3: Simple 2-gear chain, pick clockwise/counter-clockwise for target gear
// L4-6: 3-gear chain with 1 idle gear, determine direction
// L7-9: 4-gear chain with speed multipliers (small vs big gear speed)
// L10 : 5-gear mesh network puzzle, multi-choice mechanical question

const GearGearsPuzzle = ({ puzzle, onBack }) => {
  const [level, setLevel] = useState(1);
  const [data, setData] = useState(() => getGearGearsLevel(1));
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [solved, setSolved] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [gameWon, setGameWon] = useState(false);
  const [allLevelsComplete, setAllLevelsComplete] = useState(false);

  const loadLevel = (nextLevel) => {
    setLevel(nextLevel);
    setData(getGearGearsLevel(nextLevel));
    setSelectedIdx(null);
    setSolved(false);
    setFeedback("");
  };

  const handleOption = (idx) => {
    if (solved) return;
    setSelectedIdx(idx);

    if (idx === data.correctIndex) {
      playSound("match");
      setSolved(true);
      setFeedback(data.successMsg || "Awesome mechanical thinking! ⚙️🌟");

      if (level >= TOTAL_LEVELS) {
        setTimeout(() => {
          playSound("celebrate");
          setAllLevelsComplete(true);
          setGameWon(true);
        }, 1000);
      } else {
        setTimeout(() => {
          playSound("celebrate");
          loadLevel(level + 1);
        }, 1300);
      }
    } else {
      playSound("wrong");
      setFeedback(data.wrongMsg || "Not quite right! Trace the gear teeth turning each other and try again.");
      setTimeout(() => {
        setSelectedIdx(null);
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
          <h2>{allLevelsComplete ? "Master Engineer! ⚙️" : "Level Complete!"}</h2>
          <p>{puzzle.completionMessage}</p>
          <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
            <button className="btn btn-primary" onClick={handleReset}>Play Again</button>
            <button className="btn btn-back" onClick={() => { if (typeof onBack === "function") onBack(); }}>Main Menu</button>
          </div>
        </div>
      ) : (
        <>
          <div className="gg-board">
            <div className="gg-question">{data.question}</div>

            {/* Gear Train Canvas */}
            <div className="gg-stage">
              <svg className="gg-svg" viewBox="0 0 340 160">
                {data.gears.map((g, i) => (
                  <g key={i} transform={`translate(${g.x}, ${g.y})`}>
                    {/* Rotating Gear Body */}
                    <g className={solved ? (g.dir === "cw" ? "gg-rotate-cw" : "gg-rotate-ccw") : ""}>
                      <circle cx="0" cy="0" r={g.r} fill={g.color} stroke="#37474f" strokeWidth="3" />
                      {/* Teeth accents */}
                      {Array.from({ length: 8 }).map((_, t) => {
                        const angle = (t * 45 * Math.PI) / 180;
                        const tx = Math.cos(angle) * (g.r + 4);
                        const ty = Math.sin(angle) * (g.r + 4);
                        return <circle key={t} cx={tx} cy={ty} r="3" fill="#37474f" />;
                      })}
                      <circle cx="0" cy="0" r={g.r * 0.4} fill="#ffffff" stroke="#37474f" strokeWidth="2" />
                    </g>
                    {/* Label badge */}
                    <text x="0" y="4" textAnchor="middle" fontSize="12" fontWeight="900" fill="#263238">
                      {g.label}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>

          {/* Feedback message */}
          {feedback && (
            <div
              className="gg-feedback"
              style={{
                color: solved ? "var(--candy-green)" : "var(--candy-red)",
                background: solved ? "rgba(29,209,161,0.12)" : "rgba(255,107,107,0.10)",
                borderColor: solved ? "var(--candy-green)" : "var(--candy-red)",
              }}
            >
              {feedback}
            </div>
          )}

          {/* Options grid */}
          <div className="gg-options">
            {data.options.map((opt, idx) => {
              let cls = "gg-option-btn";
              if (selectedIdx === idx && !solved) cls += " gg-wrong shake";
              if (solved && idx === data.correctIndex) cls += " gg-correct";

              return (
                <button
                  key={idx}
                  className={cls}
                  onClick={() => handleOption(idx)}
                  disabled={solved}
                >
                  <span className="gg-opt-emoji">{opt.emoji}</span>
                  <span className="gg-opt-label">{opt.label}</span>
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

export default GearGearsPuzzle;
