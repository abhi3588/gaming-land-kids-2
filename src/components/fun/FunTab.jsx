import { useParams, useNavigate } from 'react-router-dom';
import { funActivities } from '../../kids-data.js';
import { useItemSEO } from '../../utils/useSEO.jsx';

import { getActivityImageUrl } from '../../assets/activityImages.js';
import { playSound } from '../../utils/sounds.js';

export default function FunTab() {
  const { id } = useParams();
  const navigate = useNavigate();
  const activeActivity = funActivities.find((activity) => activity.id === id);

  const handleSelect = (activityId) => {
    playSound('pop');
    navigate('/fun/' + activityId);
  };

  if (id) {
    if (!activeActivity) {
      return (
        <div className="game-view pop-in">
          <div className="page-wrapper">
            <div className="detail-back-container">
              <h2>Activity not found</h2>
              <button className="btn btn-primary" onClick={() => navigate('/fun')}>
                ← Back to Fun
              </button>
            </div>
          </div>
        </div>
      );
    }
    return (
      <ActivityDetail activity={activeActivity} onBack={() => navigate('/fun')} />
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
      <h3>{activity.title}</h3>
      <div className="activity-subtitle">Ages {activity.ageRange} · {activity.time}</div>
      <p className="game-desc">{activity.desc}</p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.6rem', marginTop: '0.6rem' }}>
        <button className="play-btn" onClick={(e) => { e.stopPropagation(); onSelect(activity.id); }}>
          Try This
        </button>
      </div>
    </div>
  );
}

function ActivityDetail({ activity, onBack }) {
  const imgSrc = getActivityImageUrl(activity.id);
  return (
    <>
      <FunSEO />
      <div className="game-view pop-in">
        <div className="page-wrapper">
          <div className="activity-detail-grid">
            <div className={`activity-text-card game-card ${activity.color}`}>
              <div className="activity-text-header">
                <h2>{activity.title}</h2>
                <div className="activity-subtitle">Ages {activity.ageRange} · {activity.time}</div>
              </div>

              <div className="activity-text-content">
                <p className="activity-main-desc">{activity.desc}</p>

                <div className="fun-detail-columns">
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
              </div>

              {/* back button moved below both cards for consistency */}
            </div>

            <div className={`activity-image-card game-card ${activity.color}`}>
              {imgSrc ? (
                <img className="activity-img large" src={imgSrc} alt={activity.title} loading="lazy" />
              ) : (
                <div className="image-placeholder">
                  <span className="game-icon large-emoji">{activity.icon}</span>
                </div>
              )}
            </div>
          </div>

          <div className="detail-back-container">
            <button className="btn btn-primary" onClick={onBack}>
              ← Back to Fun
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function FunSEO() {
  const { id } = useParams();
  const activity = funActivities.find((a) => a.id === id);
  return useItemSEO('fun', activity);
}
