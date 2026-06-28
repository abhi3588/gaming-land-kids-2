import { useState } from 'react';
import { stories as defaultStories } from '../../kids-data.js';
import StoryReader from './StoryReader.jsx';

export default function StoriesTab({ storiesList = defaultStories, lang = 'en' }) {
  const [activeStory, setActiveStory] = useState(null);
  const [readerOpen, setReaderOpen]   = useState(false);

  const openStory = (story) => {
    setActiveStory(story);
    setReaderOpen(true);
  };

  const headerTitle = lang === 'hi' ? '📖 सोने के समय की कहानियाँ' : '📖 Bedtime Story Corner';
  const headerSub = lang === 'hi' ? 'तस्वीरों के साथ कहानियाँ पढ़ें! ✨' : 'Tap a story to read along with pictures! ✨';

  return (
    <div>
      <div className="section-header">
        <h2>{headerTitle}</h2>
        <p>{headerSub}</p>
      </div>

      <div className="stories-grid">
        {storiesList.map((story, i) => (
          <StoryCard
            key={story.id}
            story={story}
            index={i}
            onOpen={() => openStory(story)}
            lang={lang}
          />
        ))}
      </div>

      <StoryReader
        story={activeStory}
        open={readerOpen}
        onClose={() => setReaderOpen(false)}
        lang={lang}
      />
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
