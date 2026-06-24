import { useState } from 'react';
import { stories } from '../../kids-data.js';
import StoryReader from './StoryReader.jsx';

export default function StoriesTab() {
  const [activeStory, setActiveStory] = useState(null);
  const [readerOpen, setReaderOpen]   = useState(false);

  const openStory = (story) => {
    setActiveStory(story);
    setReaderOpen(true);
  };

  return (
    <div>
      <div className="section-header">
        <h2>📖 Bedtime Story Corner</h2>
        <p>Tap a story to read along with pictures! ✨</p>
      </div>

      <div className="stories-grid">
        {stories.map((story, i) => (
          <StoryCard
            key={story.id}
            story={story}
            index={i}
            onOpen={() => openStory(story)}
          />
        ))}
      </div>

      <StoryReader
        story={activeStory}
        open={readerOpen}
        onClose={() => setReaderOpen(false)}
      />
    </div>
  );
}

function StoryCard({ story, onOpen }) {
  return (
    <div className="story-card" onClick={onOpen} role="button" tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onOpen()}
      aria-label={`Read story: ${story.title}`}>

      {/* Cover */}
      <div className="story-cover">
        {story.coverImage ? (
          <div
            className="story-cover-bg"
            style={{ backgroundImage: `url(${story.coverImage})` }}
          />
        ) : (
          <div
            className="story-cover-bg"
            style={{ background: story.gradient }}
          />
        )}
        <div className="story-cover-overlay" />
        <span className="story-emoji-badge">{story.emoji}</span>
        <span className="story-age-badge">Ages {story.ageRange}</span>
      </div>

      {/* Body */}
      <div className="story-body">
        <h3>{story.title}</h3>
        <p className="subtitle">{story.subtitle}</p>

        <div className="story-meta">
          <span>🕐 {story.minutesToRead} min read</span>
          <span>📄 {story.scenes.length} pages</span>
        </div>

        <div className="story-moral">
          <span className="moral-emoji">{story.moralEmoji}</span>
          <div>
            <span className="moral-label">❤️ Moral</span>
            <span className="moral-text">{story.moral}</span>
          </div>
        </div>

        <button className="read-btn" onClick={(e) => { e.stopPropagation(); onOpen(); }}>
          📖 Read Story →
        </button>
      </div>
    </div>
  );
}
