import { useState } from 'react';
import { scienceActivities } from '../../kids-data.js';
import { playSound } from '../../utils/sounds.js';

export default function ScienceTab() {
  const [activeActivityId, setActiveActivityId] = useState(null);
  const activeActivity = scienceActivities.find((activity) => activity.id === activeActivityId);

  const handleSelect = (id) => {
    playSound('pop');
    setActiveActivityId(id);
  };

  if (activeActivity) {
    const ActivityComponent = activeActivity.component;
    return (
      <ActivityComponent onBack={() => setActiveActivityId(null)} />
    );
  }

  return (
    <div>
      <div className="educational-grid pop-in" style={{ marginTop: '1rem' }}>
        {scienceActivities.map((activity) => (
          <ActivityCard key={activity.id} activity={activity} onSelect={handleSelect} />
        ))}
      </div>
    </div>
  );
}

function ActivityCard({ activity, onSelect }) {
  return (
    <div
      className={`game-card ${activity.color}`}
      onClick={() => onSelect(activity.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect(activity.id)}
      aria-label={`Open ${activity.title} activity`}
    >
      <span className="game-icon">{activity.icon}</span>
      <h2>{activity.title}</h2>
      <div className="activity-subtitle">Ages {activity.ageRange}</div>
      <p className="game-desc">{activity.desc}</p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.6rem', marginTop: '0.6rem' }}>
        <button className="play-btn" onClick={(e) => { e.stopPropagation(); onSelect(activity.id); }}>
          Start Learning
        </button>
      </div>
    </div>
  );
}
