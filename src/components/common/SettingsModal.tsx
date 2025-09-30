import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { ChangeTheme } from '../theme/ChangeTheme';
import '../../styles/components/common/settings.scss';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  speechEnabled: boolean;
  onToggleSpeech: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, speechEnabled, onToggleSpeech }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [twoFAEnabled, setTwoFAEnabled] = useState(() => localStorage.getItem('twoFAEnabled') === 'true');
  const [greetingEmoji, setGreetingEmoji] = useState(() => localStorage.getItem('greetingEmoji') || '👋');

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      requestAnimationFrame(() => setIsAnimating(true)); // Start animation after mounting
    } else if (!isOpen && isAnimating) {
      setIsAnimating(false); // Trigger exit animation
      const timeout = setTimeout(() => {
        setIsVisible(false); // Unmount after animation
      }, 300); // Match CSS transition duration
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimating(false);
    const timeout = setTimeout(() => {
      onClose();
      setIsVisible(false);
    }, 300); // Match transition
    return () => clearTimeout(timeout);
  };

  const toggleTwoFA = () => {
    const newState = !twoFAEnabled;
    setTwoFAEnabled(newState);
    localStorage.setItem('twoFAEnabled', newState.toString());
  };

  const handleEmojiChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setGreetingEmoji(value);
    localStorage.setItem('greetingEmoji', value);
  };

  if (!isVisible) return null;

  return ReactDOM.createPortal(
    <div className={`modal-overlay ${isAnimating ? 'open' : ''}`} onClick={handleClose}>
      <div className={`modal-content ${isAnimating ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
        <h2>Settings</h2>

        <div className="setting-item">
          <label>Speech Alerts</label>
          <label className="toggle-switch">
            <input type="checkbox" checked={speechEnabled} onChange={onToggleSpeech} />
            <span className="slider"></span>
          </label>
        </div>

        <div className="setting-item">
          <label>Color Theme</label>
          <ChangeTheme className="change-theme-setting" />
        </div>

        <div className="setting-item">
          <label>Two-Factor Authentication</label>
          <label className="toggle-switch">
            <input type="checkbox" checked={twoFAEnabled} onChange={toggleTwoFA} />
            <span className="slider"></span>
          </label>
        </div>

        <div className="setting-item">
          <label>Greeting Emoji</label>
          <select value={greetingEmoji} onChange={handleEmojiChange}>
            <option value="👋">👋 Wave</option>
            <option value="😀">😀 Smile</option>
            <option value="🌟">🌟 Star</option>
            <option value="🚀">🚀 Rocket</option>
            <option value="💻">💻 Computer</option>
            <option value="🎉">🎉 Party</option>
            <option value="🌈">🌈 Rainbow</option>
          </select>
        </div>

        <button className="close-button" onClick={handleClose}>Close</button>
      </div>
    </div>,
    document.body
  );
};

export default SettingsModal;
