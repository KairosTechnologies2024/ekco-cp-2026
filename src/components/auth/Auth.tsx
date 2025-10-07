
import '../../styles/components/auth/auth.scss';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useLoginMutation, useGetAllAlertsQuery, useGetCustomersQuery } from '../../utils/api';
import { setUser } from '../../store/redux/userSlice';
import { setCustomersData } from '../../store/redux/customersSlice';
import type { RootState } from '../../store/redux';
import { MoonLoader } from "react-spinners";
import GreetingSplash from '../GreetingSplash';
import { namesVerification } from '../../utils/namesVerification';

function Auth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const customers = useSelector((state: RootState) => state.customers.allCustomers);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);
  const [userName, setUserName] = useState('User');
  const [greetingDate, setGreetingDate] = useState('');

  const [login, { isLoading }] = useLoginMutation();

  // Preload alerts and customers
  const { data: alertsData } = useGetAllAlertsQuery();
  const { data: customersData } = useGetCustomersQuery();

  const controllerEmails = {
    'Sanele': 'admin@kairostechnology.co.za',
    'Ndabz': 'ndabenhle@kairostechnology.co.za',
    'Wasim': 'wasim@kairostechnology.co.za',
    'Tasvir': 'tasvirs@kairostechnology.co.za',
    'Blessing': 'blessing@kairostechnology.co.za',
    'Mikhail': 'mikhail@kairostechnology.co.za',
    'Leeroy': 'leeroy@kairostechnology.co.za',
    'Nhlamulo': 'nhlamulo@kairostechnology.co.za',
  };

  // Store preloaded customers data in Redux
  useEffect(() => {
    if (customersData) {
      const mappedRegularCustomers = (customersData.regularCustomers || []).map((c: any) => ({
        idNumber: c.id_number || c.idNum || c.id_num || '',
        firstName: c.first_name || '',
        lastName: c.last_name || '',
        customerType: c.user_type || c.customerType || '',
        addressLine1: c.address_line_1 || '',
        addressLine2: c.address_line_2 || '',
        city: c.city || '',
        clientPassword: c.client_password || '',
        email: c.email || '',
        initiatorName: c.initiator_name || '',
        isActive: c.is_active || false,
        nextOfKin: c.next_of_kin || '',
        nextOfKinNumber: c.next_of_kin_number || '',
        passportNumber: c.passport_number || '',
        phoneNumber: c.phone_number || '',
        policyNumber: c.policy_number || '',
        postalCode: c.postal_code || '',
        profilePicture: c.profile_picture || '',
        province: c.province || '',
        userId: c.user_id || '',
        databaseLocation: c.database_location || '',
        firebaseAI: c.firebase_ai || ''
      }));
      const mappedFleetCustomers = (customersData.fleetCustomers || []).map((c: any) => ({
        idNumber: c.id_number || c.idNum || c.id_num || '',
        firstName: c.first_name || '',
        lastName: c.last_name || '',
        customerType: c.user_type || c.customerType || '',
        addressLine1: c.address_line_1 || '',
        addressLine2: c.address_line_2 || '',
        city: c.city || '',
        clientPassword: c.client_password || '',
        email: c.email || '',
        initiatorName: c.initiator_name || '',
        isActive: c.is_active || false,
        nextOfKin: c.next_of_kin || '',
        nextOfKinNumber: c.next_of_kin_number || '',
        passportNumber: c.passport_number || '',
        phoneNumber: c.phone_number || '',
        policyNumber: c.policy_number || '',
        postalCode: c.postal_code || '',
        profilePicture: c.profile_picture || '',
        province: c.province || '',
        userId: c.user_id || '',
        databaseLocation: c.database_location || '',
        firebaseAI: c.firebase_ai || ''
      }));

      // Combine and filter as in CustomerList
      const combined = [...mappedRegularCustomers, ...mappedFleetCustomers];
      const filtered = combined.filter(customer =>
        customer.idNumber !== '' &&
        customer.firstName !== '' &&
        customer.lastName !== '' &&
        customer.customerType !== ''
      );
      // Remove duplicates by idNumber
      const uniqueCustomers: any[] = [];
      const seenIdNumbers = new Set();
      for (const customer of filtered) {
        if (!seenIdNumbers.has(customer.idNumber)) {
          uniqueCustomers.push(customer);
          seenIdNumbers.add(customer.idNumber);
        }
      }

      dispatch(setCustomersData({
        regularCustomers: uniqueCustomers,
        fleetCustomers: [],
      }));
    }
  }, [customersData, dispatch]);

  const handleLogin = () => {
    //validate fields
    if (email.trim() === '' || password.trim() === '') {
      toast.error('Please fill in all fields');
      return;
    }
    if (!email.includes('@') || !email.includes('.')) {
      toast.error('Please enter a valid email address');
      return;
    }
    login({ email, password }).unwrap().then(result => {
      if (result.otpSent) {
        // OTP sent, navigate to OTP verification
        toast.success('OTP sent to your email!', { duration: 3000 });
        navigate('/otp', { state: { userId: result.userId } });
        return;
      }

      if (!result.user || !result.accessToken || !result.refreshToken) {
        toast.error('Invalid login response');
        return;
      }

      dispatch(setUser(result.user));
      sessionStorage.setItem('accessToken', result.accessToken);
      sessionStorage.setItem('refreshToken', result.refreshToken);

      if(result.user.user_type !== 'admin' && result.user.user_type !== 'controller' && result.user.user_type !== 'super') {
        toast.error('Access denied. Admins & Controllers only.');
        return;
      }

      const userName = namesVerification(result.user.email);

      toast.success('Login successful!', { duration: 3000 });

      const today = new Date().toDateString();
      setUserName(userName);
      setGreetingDate(today);
      setShowGreeting(true);

      console.log('User Info:', result.user);
    }).catch(err => {
      toast.error(err?.data?.error || 'Login failed');
    });
  };

  if (showGreeting) {
    return <GreetingSplash name={userName} date={greetingDate} onComplete={() => navigate('/dashboard/alerts')} />;
  }

  return (
    <section className="auth">
      <div className="auth-container">
        <div className="auth-header">
          <h1 className="auth-title">Ekco Control Panel</h1>
          <p className="auth-subtitle">Please log in to continue</p>
        </div>
        <div className="auth-form">
          <div className="auth-form-group">
            <select
              id="user-select"
              className="auth-input"
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              defaultValue=""
            >
              <option value="" disabled>Select a user</option>
              {Object.entries(controllerEmails).map(([name, email]) => (
                <option key={email} value={email}>
                  {name}
                </option>
              ))}
            </select>
            <input
              type="text"
              id="email"
              className="auth-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
            <input
              type="password"
              id="password"
              className="auth-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="auth-footer">
            <button
              className="auth-button"
              disabled={isLoading}
              onClick={handleLogin}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {isLoading 
                ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '18px' }}>
                    <MoonLoader color={isHovered ? 'white' : 'black'} size={16} />
                  </span>
                : 'Log In'}
            </button>
          </div>
          <div className="auth-footer" style={{ marginTop: '10px', textAlign: 'center' }}>
            <Link to="/forgot-password" className="auth-link" style={{textDecoration:'underline', color: 'white', fontSize: '0.9rem'
            }}>Forgot Password?</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Auth;
