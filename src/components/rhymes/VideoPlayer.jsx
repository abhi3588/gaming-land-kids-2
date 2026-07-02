import { useEffect, useRef } from 'react';
import { playSound } from '../../utils/sounds.js';

export default function VideoPlayer({ rhyme, onBack }) {
  const videoRef = useRef(null);

  useEffect(() => {
    // Optionally auto-play or log
    if (videoRef.current) {
      videoRef.current.play().catch(e => console.log('Auto-play prevented by browser', e));
    }
  }, []);

  const handleBack = () => {
    playSound('pop');
    onBack();
  };

  return (
    <div className="game-view pop-in" style={{ padding: '2rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div className="game-header" style={{ width: '100%', maxWidth: '800px' }}>
        <div>{rhyme.title}</div>
        <div style={{ fontSize: '2rem' }}>{rhyme.icon}</div>
      </div>
      
      <div style={{
        width: '100%',
        maxWidth: '800px',
        backgroundColor: '#000',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-pop)',
        marginTop: '1rem',
        marginBottom: '2rem',
        border: '6px solid var(--color-primary)'
      }}>
        <video 
          ref={videoRef}
          controls 
          style={{ width: '100%', height: 'auto', display: 'block' }}
          src={rhyme.videoUrl}
        >
          Your browser does not support the video tag.
        </video>
      </div>

      <button className="btn btn-primary" onClick={handleBack} style={{ padding: '1rem 2rem', fontSize: '1.2rem' }}>
        ← Back to Rhymes
      </button>
    </div>
  );
}
