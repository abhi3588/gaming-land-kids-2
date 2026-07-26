import { useState } from "react";
import { playSound } from "../../utils/sounds";
import { TOTAL_LEVELS, getWeatherWizardLevel } from "./puzzle-utils";

// ===== Weather Wizard Puzzle =====
// Difficulty tiers:
// L1-3: single correct item (4 choices, obvious distractors)
// L4-6: pick the BEST outfit combo from 4 options
// L7-9: two-part scenario: weather + activity context, 4 choices
// L10 : hardest compound scenario, 3 clues in prompt, 4 tricky choices

const WeatherWizardPuzzle = ({ puzzle, onBack }) => {
  const [level, setLevel] = useState(1);
  const [data, setData] = useState(() => getWeatherWizardLevel(1));
  const [selected, setSelected] = useState(null);
  const [solved, setSolved] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [gameWon, setGameWon] = useState(false);
  const [allLevelsComplete, setAllLevelsComplete] = useState(false);

  const loadLevel = (nextLevel) => {
    setLevel(nextLevel);
    setData(getWeatherWizardLevel(nextLevel));
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
          <h2>{allLevelsComplete ? "Weather Wizard! 🌦️" : "Level Complete!"}</h2>
          <p>{puzzle.completionMessage}</p>
          <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
            <button className="btn btn-primary" onClick={handleReset}>Play Again</button>
            <button className="btn btn-back" onClick={() => { if (typeof onBack === "function") onBack(); }}>Main Menu</button>
          </div>
        </div>
      ) : (
        <>
          {/* Weather scene card */}
          <div
            className="ww-scene"
            style={{ background: data.skyGradient }}
          >
            <div className="ww-weather-emoji">{data.weatherEmoji}</div>
            <div className="ww-prompt">{data.question}</div>
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
          <div className="ww-options">
            {data.options.map((opt, idx) => {
              let cls = "ww-option-btn";
              if (selected === idx && !solved) cls += " ww-wrong shake";
              if (solved && idx === data.correctIndex) cls += " ww-correct";
              return (
                <button
                  key={idx}
                  className={cls}
                  onClick={() => handleOption(idx)}
                  disabled={solved}
                >
                  <span className="ww-opt-emoji">{opt.emoji}</span>
                  <span className="ww-opt-label">{opt.label}</span>
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

export default WeatherWizardPuzzle;
