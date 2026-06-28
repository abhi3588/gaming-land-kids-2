import { useState, useEffect, useCallback } from 'react';

export default function StoryReader({ story, open, onClose, lang = 'en' }) {
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(1);
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    if (open) { setPage(0); setDirection(1); setAnimKey(k => k + 1); }
  }, [open, story?.id]);

  const totalPages = story ? story.scenes.length + 2 : 0; // cover + scenes + moral

  const goNext = useCallback(() => {
    setDirection(1);
    setPage(p => Math.min(p + 1, totalPages - 1));
    setAnimKey(k => k + 1);
  }, [totalPages]);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setPage(p => Math.max(p - 1, 0));
    setAnimKey(k => k + 1);
  }, []);

  const goTo = useCallback((i) => {
    setDirection(i > page ? 1 : -1);
    setPage(i);
    setAnimKey(k => k + 1);
  }, [page]);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === 'ArrowRight') goNext();
      else if (e.key === 'ArrowLeft') goPrev();
      else if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, goNext, goPrev, onClose]);

  if (!open || !story) return null;

  const isCover = page === 0;
  const isMoral = page === totalPages - 1;
  const scene   = (!isCover && !isMoral) ? story.scenes[page - 1] : null;
  const pct     = ((page + 1) / totalPages) * 100;

  return (
    <div className="reader-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="reader-modal" style={{ background: story.gradient }}>

        {/* Progress */}
        <div className="reader-progress-bar">
          <div className="reader-progress-fill" style={{ width: `${pct}%` }} />
        </div>

        {/* Page counter */}
        <div className="reader-page-counter">{page + 1} / {totalPages}</div>

        {/* Close */}
        <button className="reader-close" onClick={onClose} aria-label="Close story">✕</button>

        {/* Body */}
        <div className="reader-body" key={animKey} style={{ animation: 'pop-in 0.35s ease both' }}>
          {isCover  && <CoverPage  story={story} lang={lang} />}
          {scene    && <ScenePage  scene={scene} lang={lang} />}
          {isMoral  && <MoralPage  story={story} lang={lang} />}
        </div>

        {/* Nav */}
        <div className="reader-nav">
          <button className="reader-nav-btn" onClick={goPrev} disabled={page === 0}>
            ← {lang === 'hi' ? 'पीछे' : 'Back'}
          </button>

          <div className="reader-dots">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                className={`reader-dot${i === page ? ' active' : ''}`}
                onClick={() => goTo(i)}
                aria-label={`Go to page ${i + 1}`}
              />
            ))}
          </div>

          {page < totalPages - 1 ? (
            <button className="reader-nav-btn" onClick={goNext}>
              {lang === 'hi' ? 'आगे' : 'Next'} →
            </button>
          ) : (
            <button className="reader-nav-btn" onClick={() => { setPage(0); setAnimKey(k => k + 1); }}>
              🔄 {lang === 'hi' ? 'फिर से' : 'Again'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function CoverPage({ story, lang }) {
  const agesLabel = lang === 'hi' ? `📖 उम्र ${story.ageRange} के लिए एक कहानी` : `📖 A Story for Ages ${story.ageRange}`;
  const tapNextLabel = lang === 'hi' ? '✨ कहानी शुरू करने के लिए आगे पर टैप करें →' : '✨ Tap Next to start the story →';
  return (
    <>
      <div style={{ fontSize: '5rem', marginBottom: '0.75rem', filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.2))' }}>
        {story.emoji}
      </div>
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
        background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)',
        padding: '0.25rem 0.9rem', borderRadius: '999px',
        fontSize: '0.8rem', fontWeight: 700, color: 'white', marginBottom: '1rem',
      }}>
        {agesLabel}
      </span>
      <h2 style={{ fontSize: 'clamp(1.4rem,4vw,2rem)', fontWeight: 700, color: 'white',
        textShadow: '0 2px 8px rgba(0,0,0,0.2)', lineHeight: 1.2, maxWidth: 500 }}>
        {story.title}
      </h2>
      <p style={{ marginTop: '0.4rem', color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>
        {story.subtitle}
      </p>

      {story.coverImage ? (
        <div className="reader-cover-img">
          <img src={story.coverImage} alt={`Illustration for ${story.title}`} />
        </div>
      ) : (
        <div style={{
          marginTop: '1.5rem', fontSize: '6rem',
          filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.15))',
        }}>
          {story.emoji}
        </div>
      )}

      <p style={{ marginTop: '1.5rem', color: 'rgba(255,255,255,0.9)', fontWeight: 600, fontSize: '0.95rem' }}>
        {tapNextLabel}
      </p>
    </>
  );
}

function ScenePage({ scene }) {
  return (
    <>
      <div className="reader-scene-emoji">{scene.emoji}</div>
      {scene.heading && <h3 className="reader-scene-heading">{scene.heading}</h3>}
      <p className="reader-scene-text">{scene.text}</p>
      <div className="reader-sparkles">
        {['✨', '⭐', '💫'].map((s, i) => (
          <span key={i} style={{
            animation: `float-wiggle 1.6s ease-in-out infinite`,
            animationDelay: `${i * 0.3}s`,
          }}>{s}</span>
        ))}
      </div>
    </>
  );
}

function MoralPage({ story, lang }) {
  const moralLabel = lang === 'hi' ? '💛 कहानी की सीख' : '💛 The Moral of the Story';
  const endLabel = lang === 'hi' ? 'समाप्त। बहुत बढ़िया पढ़ा! 🌟' : 'The End. Great job reading! 🌟';
  return (
    <>
      <div style={{ fontSize: '4.5rem', marginBottom: '0.75rem',
        animation: 'bobble 2s ease-in-out infinite' }}>
        {story.moralEmoji}
      </div>
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
        background: 'rgba(255,255,255,0.3)', backdropFilter: 'blur(8px)',
        padding: '0.4rem 1.1rem', borderRadius: '999px',
        fontSize: '0.85rem', fontWeight: 700, color: 'white', marginBottom: '1.25rem',
      }}>
        {moralLabel}
      </span>

      <div className="reader-moral-card">
        <blockquote>"{story.moral}"</blockquote>
      </div>

      <div style={{ marginTop: '2rem', display: 'flex', gap: '0.75rem', fontSize: '2rem' }}>
        {['🎉', '👏', '🌈', '💖'].map((s, i) => (
          <span key={i} style={{
            animation: `float-wiggle 1.4s ease-in-out infinite`,
            animationDelay: `${i * 0.2}s`,
          }}>{s}</span>
        ))}
      </div>

      <p style={{ marginTop: '1.5rem', color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>
        {endLabel}
      </p>
    </>
  );
}
