import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useForgotPasswordMutation } from '../../utils/api';
import { MoonLoader } from "react-spinners";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const [isHovered, setIsHovered] = useState(false);
  const handleSendResetLink = () => {
    if (email.trim() === '' || !email.includes('@') || !email.includes('.')) {
      toast.error('Please enter a valid email address');
      return;
    }
    forgotPassword({ email }).unwrap().then(() => {
      toast.success('Reset link sent to your email');
      // Optionally navigate back to login
      navigate('/auth');
    }).catch(err => {
      toast.error(err?.data?.error || 'Failed to send reset link');
    });
  };

  return (
    <section className="auth">
      <div className="auth-container">
        <div className="auth-header">
          <h1 className="auth-title">Forgot Password</h1>
          <p className="auth-subtitle">Enter your email to receive a reset link</p>
        </div>
        <div className="auth-form">
          <div className="auth-form-group">
            <input
              type="email"
              className="auth-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="auth-footer">
            <button
              className="auth-button"
              disabled={isLoading}
              onClick={handleSendResetLink}
               onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
             {isLoading 
                ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '18px' }}>
                    <MoonLoader color={isHovered ? 'white' : 'black'} size={16} />
                  </span>
                : 'Send Reset Link'}
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

export default ForgotPassword;
