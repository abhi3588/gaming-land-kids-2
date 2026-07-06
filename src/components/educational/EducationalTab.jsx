import { useState } from 'react';
import { playSound } from '../../utils/sounds.js';
import ScienceTab from './ScienceTab.jsx';
import MoralTab from './MoralTab.jsx';

export default function EducationalTab() {
  const [activeSubTab, setActiveSubTab] = useState('science');

  const handleSubTab = (tab) => {
    playSound('pop');
    setActiveSubTab(tab);
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

      {/* Sub-tab Content */}
      {activeSubTab === 'science' && <ScienceTab />}
      {activeSubTab === 'moral' && <MoralTab />}
    </div>
  );
}
