import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useResetPasswordMutation } from '../../utils/api';
import { MoonLoader } from "react-spinners";

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const handleResetPassword = () => {
    if (newPassword.trim() === '' || confirmPassword.trim() === '') {
      toast.error('Please fill in all fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (!token) {
      toast.error('Invalid reset link');
      return;
    }
    resetPassword({ token, newPassword }).unwrap().then(() => {
      toast.success('Password reset successfully');
      navigate('/auth');
    }).catch(err => {
      toast.error(err?.data?.error || 'Failed to reset password');
    });
  };

  if (!token) {
    return (
      <section className="auth">
        <div className="auth-container">
          <div className="auth-header">
            <h1 className="auth-title">Invalid Link</h1>
            <p className="auth-subtitle">The reset link is invalid or expired.</p>
          </div>
          <div className="auth-footer">
            <button
              className="auth-button"
              onClick={() => navigate('/auth')}
               style={{ marginTop: '0.5rem' }}
             
            >
              Back to Login
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="auth">
      <div className="auth-container">
        <div className="auth-header">
          <h1 className="auth-title">Reset Password</h1>
          <p className="auth-subtitle">Enter your new password</p>
        </div>
        <div className="auth-form">
          <div className="auth-form-group">
            <input
              type="password"
              className="auth-input"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={isLoading}
            />
            <input
              type="password"
              className="auth-input"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="auth-footer">
            <button
              className="auth-button"
              disabled={isLoading}
              onClick={handleResetPassword}
            >
              {isLoading ? <MoonLoader color="black" size={16} /> : 'Reset Password'}
            </button>
            <button
              className="auth-button secondary"
              onClick={() => navigate('/auth')}
              disabled={isLoading}

              style={{ marginTop: '0.5rem' }}
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ResetPassword;
