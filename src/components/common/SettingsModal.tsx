import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { ChangeTheme } from '../theme/ChangeTheme';
import { useEnable2FAMutation, useDisable2FAMutation, useGetUserProfileQuery, useGetStaffUsersQuery } from '../../utils/api';
import { namesVerification } from '../../utils/namesVerification';
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
  const [greetingEmoji, setGreetingEmoji] = useState('👋');

  const user = useSelector((state: any) => state.user.user);
  const [enable2FA] = useEnable2FAMutation();
  const [disable2FA] = useDisable2FAMutation();
  const { data: staffUsers } = useGetStaffUsersQuery(undefined, { skip: !user?.id });

  // Fetch user profile to get twofa_enabled state
  const { data: userProfile } = useGetUserProfileQuery(user?.id ?? '', {
    skip: !user?.id,
  });

  useEffect(() => {
    if (userProfile && typeof userProfile.twofa_enabled === 'boolean') {
      setTwoFAEnabled(userProfile.twofa_enabled);
      localStorage.setItem('twoFAEnabled', userProfile.twofa_enabled.toString());
    }
  }, [userProfile]);

  // Helper to toggle 2FA for arbitrary staff user (super only)
  const toggleStaffTwoFA = async (targetUserId: string, enable: boolean) => {
    try {
      if (enable) {
        await enable2FA({ userId: targetUserId }).unwrap();
        toast.success('Two-Factor Authentication enabled', { style: { zIndex: 10000000001 } });
      } else {
        await disable2FA({ userId: targetUserId }).unwrap();
        toast.success('Two-Factor Authentication disabled', { style: { zIndex: 10000000001 } });
      }
    } catch (error) {
      toast.error('Failed to update 2FA for user', { style: { zIndex: 10000000001 } });
      console.error('Failed toggling 2FA for user:', error);
    }
  };

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

        {/* Two-Factor section: only visible to super users; super users can toggle for themselves and other staff */}
        {user?.user_type === 'super' && (
          <div className="setting-item two-factor-setting">
            <label>Two-Factor Authentication (Manage users)</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

                <div className="setting-item-container">
                <div>
                  <strong>Your account</strong>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{user?.email}</div>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" checked={twoFAEnabled} onChange={toggleTwoFA} />
                  <span className="slider"></span>
                </label>
              </div>
</div>
           
                <strong>Staff users</strong>
                   <div className="setting-item-container">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
                  {staffUsers && staffUsers.length > 0 ? (
                    // Filter out current user from staff list (their account is managed above)
                    staffUsers
                      .filter((s: any) => String(s.email).toLowerCase() !== String(user?.email).toLowerCase())
                      .map((s: any) => {
                        const displayName = namesVerification(s.email || `${s.first_name || ''}`);
                        return (
                          <div key={s.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                              <div>{displayName}</div>
                              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.email}</div>
                            </div>
                            <label className="toggle-switch">
                              <input type="checkbox" checked={Boolean(s.twofa_enabled)} onChange={(e) => toggleStaffTwoFA(String(s.id), e.target.checked)} />
                              <span className="slider"></span>
                            </label>
                          </div>
                        );
                      })
                  ) : (
                    <div style={{ color: 'var(--text-muted)' }}>No staff users found</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

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
