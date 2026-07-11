import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { playSound } from '../../utils/sounds.js';
import { useItemSEO } from '../../utils/useSEO.jsx';
import { scienceActivities, moralActivities } from '../../kids-data.js';

export default function EducationalTab({ initialCategory }) {
  const { id, category } = useParams();
  const navigate = useNavigate();
  const [activeSubTab, setActiveSubTab] = useState(initialCategory || 'science');

  // Route-driven category wins; otherwise the prop or internal sub-tab state.
  const activeCategory = category || initialCategory || activeSubTab;

  const handleSubTab = (tab) => {
    playSound('pop');
    setActiveSubTab(tab);
  };

  // ---- Detail route (/educational/science/:id or /educational/moral/:id) ----
  if (id) {
    const cat =
      moralActivities.find((a) => a.id === id)
        ? 'moral'
        : scienceActivities.find((a) => a.id === id)
        ? 'science'
        : category || 'science';
    const list = cat === 'moral' ? moralActivities : scienceActivities;
    const activity = list.find((a) => a.id === id);

    const goBack = () => navigate('/educational');

    return (
      <div>
        <div className="section-header">
          <h2>🧪 Educational Corner</h2>
          <p>Explore science and moral learning activities!</p>
        </div>

        <EduSEO />

        {activity ? (
          (() => {
            const ActivityComponent = activity.component;
            return <ActivityComponent onBack={goBack} />;
          })()
        ) : (
          <div className="section-header" style={{ marginTop: '2rem' }}>
            <h3>Activity not found</h3>
            <p>We couldn't find the activity you were looking for.</p>
            <button className="play-btn" onClick={goBack}>Back to Educational Corner</button>
          </div>
        )}
      </div>
    );
  }

  // ---- List route (/educational) ----
  const list =
    activeCategory === 'moral' ? moralActivities : scienceActivities;

  const handleSelect = (cat, activityId) => {
    playSound('pop');
    navigate('/educational/' + cat + '/' + activityId);
  };

  return (
    <div>
      <div className="section-header">
        <h2>🧪 Educational Corner</h2>
        <p>Explore science and moral learning activities!</p>
      </div>

      {/* Sub-tab Navigation */}
      <div className="category-container pop-in">
        <div className="category-tabs">
          <button
            className={`category-tab${activeSubTab === 'science' ? ' active' : ''}`}
            onClick={() => handleSubTab('science')}
          >
            🔬 Science
          </button>
          <button
            className={`category-tab${activeSubTab === 'moral' ? ' active' : ''}`}
            onClick={() => handleSubTab('moral')}
          >
            💝 Moral Education
          </button>
        </div>
      </div>

      {/* Activity grid for the active sub-tab */}
      <div className="educational-grid pop-in" style={{ marginTop: '1rem' }}>
        {list.map((activity) => (
          <ActivityCard
            key={activity.id}
            activity={activity}
            onSelect={() => handleSelect(activeSubTab, activity.id)}
          />
        ))}
      </div>
    </div>
  );
}

function ActivityCard({ activity, onSelect }) {
  return (
    <div
      className={`game-card ${activity.color}`}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect()}
      aria-label={`Open ${activity.title} activity`}
    >
      <span className="game-icon">{activity.icon}</span>
      <h3>{activity.title}</h3>
      <div className="activity-subtitle">Ages {activity.ageRange}</div>
      <p className="game-desc">{activity.desc}</p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.6rem', marginTop: '0.6rem' }}>
        <button className="play-btn" onClick={(e) => { e.stopPropagation(); onSelect(); }}>
          Start Learning
        </button>
      </div>
    </div>
  );
}

// Per-item SEO for the detail route.
function EduSEO() {
  const { id } = useParams();
  const cat =
    moralActivities.find((a) => a.id === id)
      ? 'moral'
      : scienceActivities.find((a) => a.id === id)
      ? 'science'
      : 'science';
  const list = cat === 'moral' ? moralActivities : scienceActivities;
  const activity = list.find((a) => a.id === id);
  return useItemSEO('educational', activity, { category: cat });
}
