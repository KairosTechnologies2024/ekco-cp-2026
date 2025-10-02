import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { ChangeTheme } from '../theme/ChangeTheme';
import { useEnable2FAMutation, useDisable2FAMutation, useGetUserProfileQuery } from '../../utils/api';
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
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [greetingEmoji, setGreetingEmoji] = useState(() => localStorage.getItem('greetingEmoji') || '👋');

  const user = useSelector((state: any) => state.user.user);
  const [enable2FA, { isLoading }] = useEnable2FAMutation();
  const [disable2FA] = useDisable2FAMutation();

  // Fetch user profile to get twofa_enabled state
  const { data: userProfile, isLoading: isUserProfileLoading, error: userProfileError } = useGetUserProfileQuery(user?.id ?? '', {
    skip: !user?.id,
  });

  useEffect(() => {
    if (userProfile && typeof userProfile.twofa_enabled === 'boolean') {
      setTwoFAEnabled(userProfile.twofa_enabled);
      localStorage.setItem('twoFAEnabled', userProfile.twofa_enabled.toString());
    }
  }, [userProfile]);

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

  const toggleTwoFA = async () => {
    const newState = !twoFAEnabled;
    setTwoFAEnabled(newState);
    localStorage.setItem('twoFAEnabled', newState.toString());

    if (user?.id) {
      try {
        if (newState) {
          await enable2FA({ userId: user.id }).unwrap();
          toast.success('Two-Factor Authentication enabled successfully', { style: { zIndex: 10000000001 } });
        } else {
          await disable2FA({ userId: user.id }).unwrap();
          toast.success('Two-Factor Authentication disabled successfully', { style: { zIndex: 10000000001 } });
        }
      } catch (error) {
        // Revert toggle on failure
        setTwoFAEnabled(!newState);
        localStorage.setItem('twoFAEnabled', (!newState).toString());
        toast.error(`Failed to ${newState ? 'enable' : 'disable'} Two-Factor Authentication`, { style: { zIndex: 10000000001 } });
        console.error('Failed to toggle 2FA:', error);
      }
    }
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
          <div className="change-theme-setting">
            <ChangeTheme />
          </div>
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
