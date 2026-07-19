import { useParams, useNavigate } from 'react-router-dom';
import { useItemSEO } from '../../utils/useSEO.jsx';
import { stories, storiesHindi, getPublicAssetUrl } from '../../kids-data.js';
import { playSound } from '../../utils/sounds.js';
import StoryReader from './StoryReader.jsx';

export default function StoriesTab({ lang = 'en' }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const basePath = '/stories' + (lang === 'hi' ? '/hi' : '');
  const list = lang === 'hi' ? storiesHindi : stories;
  const story = id ? list.find((s) => s.id === id) : null;

  const openStory = (s) => {
    playSound('pop');
    navigate(basePath + '/' + s.id);
  };

  const headerTitle = lang === 'hi' ? '📖 सोने के समय की कहानियाँ' : '📖 Bedtime Story Corner';
  const headerSub = lang === 'hi' ? 'तस्वीरों के साथ कहानियाँ पढ़ें! ✨' : 'Tap a story to read along with pictures! ✨';

  // Story reader (route: /stories[/hi]/:id)
  if (id && story) {
    return (
      <>
        <StorySEO lang={lang} />
        <StoryReader
          story={story}
          open={true}
          onClose={() => navigate(basePath)}
          lang={lang}
        />
      </>
    );
  }

  // Story id present but no matching story
  if (id && !story) {
    return (
      <div>
        <div className="section-header">
          <h2>{headerTitle}</h2>
          <p>{headerSub}</p>
        </div>
        <div className="category-container pop-in" style={{ textAlign: 'center', padding: '2rem' }}>
          <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>📚 Story not found</p>
          <div className="detail-back-container">
            <button
              className="btn btn-back"
              onClick={() => navigate(basePath)}
            >
              {lang === 'hi' ? 'कहानियों पर वापस' : 'Back to stories'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // List view (default)
  return (
    <div>
      <div className="section-header">
        <h2>{headerTitle}</h2>
        <p>{headerSub}</p>
      </div>

      <div className="category-container pop-in">
        <div className="category-tabs">
          <button
            className={`category-tab${lang === 'en' ? ' active' : ''}`}
            onClick={() => { playSound('pop'); navigate('/stories'); }}
          >
            📚 Stories (English) · {stories.length}
          </button>
          <button
            className={`category-tab${lang === 'hi' ? ' active' : ''}`}
            onClick={() => { playSound('pop'); navigate('/stories/hi'); }}
          >
            📚 Stories (Hindi) · {storiesHindi.length}
          </button>
        </div>
      </div>

      <div className="stories-grid">
        {list.map((story, i) => (
          <StoryCard
            key={story.id}
            story={story}
            index={i}
            onOpen={() => openStory(story)}
            lang={lang}
          />
        ))}
      </div>
    </div>
  );
}

function StoryCard({ story, onOpen, lang }) {
  const agesLabel = lang === 'hi' ? `उम्र ${story.ageRange}` : `Ages ${story.ageRange}`;
  const minReadLabel = lang === 'hi' ? 'मिनट' : 'min read';
  const pagesLabel = lang === 'hi' ? 'पेज' : 'pages';
  const moralLabel = lang === 'hi' ? '❤️ सीख' : '❤️ Moral';
  const readBtnLabel = lang === 'hi' ? '📖 कहानी पढ़ें →' : '📖 Read Story →';

  return (
    <div className="story-card" onClick={onOpen} role="button" tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onOpen()}
      aria-label={`Read story: ${story.title}`}>

      {/* Cover */}
      <div className="story-cover">
        {story.coverImage ? (
          <div
            className="story-cover-bg"
            style={{ backgroundImage: `url(${getPublicAssetUrl(story.coverImage)})` }}
          />
        ) : (
          <div
            className="story-cover-bg"
            style={{ background: story.gradient }}
          />
        )}
        <div className="story-cover-overlay" />
        <span className="story-emoji-badge">{story.emoji}</span>
        <span className="story-age-badge">{agesLabel}</span>
      </div>

      {/* Body */}
      <div className="story-body">
        <h3>{story.title}</h3>
        <p className="subtitle">{story.subtitle}</p>

        <div className="story-meta">
          <span>🕐 {story.minutesToRead} {minReadLabel}</span>
          <span>📄 {story.scenes.length} {pagesLabel}</span>
        </div>

        <div className="story-moral">
          <span className="moral-emoji">{story.moralEmoji}</span>
          <div>
            <span className="moral-label">{moralLabel}</span>
            <span className="moral-text">{story.moral}</span>
          </div>
        </div>

        <button className="read-btn" onClick={(e) => { e.stopPropagation(); onOpen(); }}>
          {readBtnLabel}
        </button>
      </div>
    </div>
  );
}

// Per-item SEO for the open story reader (returns null when no story matches).
function StorySEO({ lang }) {
  const { id } = useParams();
  const list = lang === 'hi' ? storiesHindi : stories;
  const story = list.find((s) => s.id === id);
  return useItemSEO('story', story, { lang });
}
