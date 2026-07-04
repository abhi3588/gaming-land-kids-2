import { useState } from 'react';
import { funActivities } from '../../kids-data.js';
import { playSound } from '../../utils/sounds.js';

export default function FunTab() {
  const [activeActivityId, setActiveActivityId] = useState(null);
  const activeActivity = funActivities.find((activity) => activity.id === activeActivityId);

  const handleSelect = (id) => {
    playSound('pop');
    setActiveActivityId(id);
  };

  if (activeActivity) {
    return (
      <ActivityDetail activity={activeActivity} onBack={() => setActiveActivityId(null)} />
    );
  }

  return (
    <div>
      <div className="section-header">
        <h2>Fun Activity Corner</h2>
        <p>Hands-on ideas for creative little learners!</p>
      </div>

      <div className="game-grid rhymes-grid pop-in">
        {funActivities.map((activity) => (
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
      <p className="game-desc">{activity.desc}</p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.6rem', marginTop: '0.8rem' }}>
        <span style={{ fontSize: '0.9rem', color: '#666', fontWeight: 700, alignSelf: 'center' }}>Ages {activity.ageRange}</span>
        <span style={{ fontSize: '0.85rem', color: '#999', alignSelf: 'center' }}>{activity.time}</span>
      </div>
      <button className="play-btn" onClick={(e) => { e.stopPropagation(); onSelect(activity.id); }}>
        Try This
      </button>
    </div>
  );
}

function ActivityDetail({ activity, onBack }) {
  return (
    <div className="game-view pop-in" style={{ padding: '1rem' }}>
      <div className={`game-card ${activity.color}`} style={{ textAlign: 'left', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.8rem', flexWrap: 'wrap' }}>
          <span className="game-icon" style={{ marginBottom: 0 }}>{activity.icon}</span>
          <div>
            <h2 style={{ marginBottom: '0.25rem' }}>{activity.title}</h2>
            <div style={{ fontSize: '0.95rem', color: '#666', fontWeight: 700 }}>
              Ages {activity.ageRange} · {activity.time}
            </div>
          </div>
        </div>

        <p style={{ color: '#666', marginBottom: '1rem' }}>{activity.desc}</p>

        <div className="fun-detail-columns" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <section>
            <h3>Materials</h3>
            <ul>
              {activity.materials.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h3>Steps</h3>
            <ol>
              {activity.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </section>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.25rem' }}>
          <button className="btn-back" onClick={onBack}>
            ← Back to Fun
          </button>
        </div>
      </div>
    </div>
  );
}
