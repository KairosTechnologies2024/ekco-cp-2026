import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useVerifyOtpMutation, useGetUserProfileQuery } from '../../utils/api';
import { setUser } from '../../store/redux/userSlice';
import { MoonLoader } from "react-spinners";
import GreetingSplash from '../GreetingSplash';
import { namesVerification } from '../../utils/namesVerification';
function OtpVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [otp, setOtp] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);
  const [userName, setUserName] = useState('User');
  const [greetingDate, setGreetingDate] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);

  const userId = location.state?.userId;

  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();
  const { data: userProfile, isLoading: isLoadingProfile } = useGetUserProfileQuery(userId || '', {
    skip: !userId || !otpVerified,
  });

  useEffect(() => {
    if (!userId) {
      navigate('/auth');
    }
  }, [userId, navigate]);

  // Handle user profile loading after OTP verification
  useEffect(() => {
    if (otpVerified && userProfile && !isLoadingProfile) {
      dispatch(setUser(userProfile));

      if(userProfile.user_type !== 'admin' && userProfile.user_type !== 'controller') {
        toast.error('Access denied. Admins & Controllers only.');
        return;
      }

      const computedUserName = namesVerification(userProfile.email);

      toast.success('OTP verified successfully!', { duration: 3000 });

      const today = new Date().toDateString();
      setUserName(computedUserName);
      setGreetingDate(today);
      setShowGreeting(true);

      console.log('User Info:', userProfile);
    }
  }, [otpVerified, userProfile, isLoadingProfile, dispatch, navigate]);

  const handleVerifyOtp = () => {
    if (otp.trim() === '' || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    verifyOtp({ userId, token: otp }).unwrap().then((result: { accessToken: string; refreshToken: string; message: string }) => {
      // Set tokens first so the profile query can use the new token
      sessionStorage.setItem('accessToken', result.accessToken);
      sessionStorage.setItem('refreshToken', result.refreshToken);

      // Trigger user profile fetch
      setOtpVerified(true);
    }).catch((err: any) => {
      toast.error(err?.data?.error || 'OTP verification failed');
    });
  };

  if (showGreeting) {
    return <GreetingSplash name={userName} date={greetingDate} onComplete={() => navigate('/dashboard/alerts')} />;
  }

  return (
    <section className="auth">
      <div className="auth-container">
        <div className="auth-header">
          <h1 className="auth-title">OTP Verification</h1>
          <p className="auth-subtitle">Enter the 6-digit OTP sent to your email</p>
        </div>
        <div className="auth-form">
          <div className="auth-form-group">
            <input
              type="text"
              id="otp"
              className="auth-input"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              disabled={isLoading}
              maxLength={6}
            />
          </div>
          <div className="auth-footer">
            <button
              className="auth-button"
              disabled={isLoading}
              onClick={handleVerifyOtp}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {isLoading
                ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '18px' }}>
                    <MoonLoader color={isHovered ? 'white' : 'black'} size={16} />
                  </span>
                : 'Verify OTP'}
            </button>
          </div>
          <div className="auth-footer" style={{ marginTop: '10px', textAlign: 'center' }}>
            <button
              onClick={() => navigate('/auth')}
              className="auth-link"
              style={{ textDecoration: 'underline', color: 'white', fontSize: '0.9rem', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default OtpVerification;
