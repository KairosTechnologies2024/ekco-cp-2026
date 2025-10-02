import '../../styles/components/dashboard/sidebar.scss';
import '../../styles/components/common/settings.scss';
import { FaRegBell } from "react-icons/fa";
import { FiUsers } from "react-icons/fi";
import { MdLogout } from "react-icons/md";
import { GoCpu } from "react-icons/go";
import { Link, useLocation } from 'react-router-dom';
import { LuFuel } from "react-icons/lu";
import { FiTruck } from "react-icons/fi";
import { useState, useEffect, useRef } from 'react';
import { GiPaperClip } from "react-icons/gi";
import { useDispatch, useSelector } from 'react-redux';
import { BsFillVolumeUpFill, BsFillVolumeMuteFill } from "react-icons/bs";
import { FiSettings } from "react-icons/fi";
import { logout } from '../../store/redux/userSlice';
import type { RootState } from '../../store/redux';
import ConfirmationDialog from '../common/ConfirmationDialog';
import SettingsModal from '../common/SettingsModal';
import wsService from '../../utils/websocket';
import { setCustomersData, setCustomerCount } from '../../store/redux/customersSlice';
import { setAlerts, type Alert as AlertModel } from '../../store/redux/alertsSlice';
import { useGetCustomersQuery, useGetAllAlertsQuery } from '../../utils/api';
import speechService from '../../utils/speech';
import { namesVerification } from '../../utils/namesVerification';


function Sidebar() {
  const location = useLocation();
  const pathname = location.pathname;

  const dispatch = useDispatch();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(() => {
    // Check if user has previously set speech preference
    const saved = localStorage.getItem('speechEnabled');
    return saved ? JSON.parse(saved) : true; // Default to enabled
  });

  const handleLogout = () => {
    setShowLogoutDialog(true);
  };

  const confirmLogout = () => {
    dispatch(logout());
    localStorage.removeItem('persist:user');
    setShowLogoutDialog(false);
  };

  const cancelLogout = () => {
    setShowLogoutDialog(false);
  };

  const toggleSpeech = () => {
    const newState = !speechEnabled;
    setSpeechEnabled(newState);
    speechService.setEnabled(newState);
    localStorage.setItem('speechEnabled', JSON.stringify(newState));
  };

  const openSettingsModal = () => {
    setShowSettingsModal(true);
  };

  const closeSettingsModal = () => {
    setShowSettingsModal(false);
  };

  // Retrieve user AVATAR and DISPLAY NAME from persisted Redux state in localStorage

  let email = '';
  let avatarLetter = 'U';
  let avatarLetterTwo = 'U';
  let displayName = 'User';
  try {
    const persisted = localStorage.getItem('persist:user');
    if (persisted) {
      const parsed = JSON.parse(persisted);
      const userData = JSON.parse(parsed.user);

      console.log('this is email', userData.email);

      if (userData && userData.email) {
        email = userData.email || '';
        avatarLetter = (email[0]?.toUpperCase() ?? 'U').toString();
        avatarLetterTwo = (email[1]?.toUpperCase() ?? 'U').toString();

        displayName = namesVerification(email);

        if (avatarLetter === 'A') {
          avatarLetter = 'S'; // S for Admin email, which Sanele is using
        }

        if (avatarLetterTwo === 'H') {
          avatarLetterTwo = 'N';
        }
      }
    }
  } catch (e) {
    console.error('Failed to parse persisted user:', e);
    // fallback to default values
  }



  const notifications = {
    alerts: 5,
    customers: 1920,
    fleetApprovals: 8,
    fuelCuts: 15,
    devices: 31,
    todos:112,
    tickets:112,
  };

  // Use counts from Redux store and subscribe to API/WS for global badges
  const customerCount = useSelector((state: RootState) => state.customers.count);
  const alerts = useSelector((state: RootState) => state.alerts.alerts);



  // Calculate unread count based on synced property from API
  const alertsUnreadCount = alerts.reduce((acc, a) => acc + (a.synced ? 0 : 1), 0);

  // Fetch customers and alerts globally (Sidebar is mounted across dashboard routes)
  const { data: customersData } = useGetCustomersQuery(undefined, { pollingInterval: 30000, refetchOnFocus: true, refetchOnReconnect: true });
  const { data: initialAlertsData } = useGetAllAlertsQuery();

  // Keep customers count in sync with API
  useEffect(() => {
    if (customersData) {
      const totalCount = customersData.regularCustomers.length + customersData.fleetCustomers.length;
      dispatch(setCustomerCount(totalCount));
    }
  }, [customersData, dispatch]);

  // Seed alerts from API on mount
  useEffect(() => {
    if (initialAlertsData?.alerts) {
      const filtered = initialAlertsData.alerts.filter(alert => alert.alert !== "Ignition on" && alert.alert !== "Door open");
      const sorted = [...filtered].sort((a, b) => Number(b.time) - Number(a.time));
      const mapped: AlertModel[] = sorted.map((alert: any) => ({
        id: String(alert.row_num as string),
        alertType: alert.alert.replace(/!/g, ''),
        vehicle_model: alert.vehicle_model,
        plate: alert.vehicle_plate,
        time: new Date(parseInt(alert.time) * 1000).toLocaleString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        }),
        first_name: alert.first_name,
        last_name: alert.last_name,
        id_number: alert.id_number,
        phone_number: alert.phone_number,
        next_of_kin: alert.next_of_kin || '',
        next_of_kin_number: alert.next_of_kin_number,
        user_id: alert.user_id,
        synced: alert.synced,
      }));
      dispatch(setAlerts(mapped));
    }
  }, [initialAlertsData, dispatch]);

  // Listen for live alerts via WebSocket and keep global store updated
  useEffect(() => {
    wsService.connect();
    const handleAlert = (alertsData: any[]) => {
      const filtered = alertsData.filter((alert: any) => alert.alert !== "Ignition on" && alert.alert !== "Door open");
      const sorted = [...filtered].sort((a, b) => Number(b.time) - Number(a.time));
      const mapped: AlertModel[] = sorted.map((alert: any) => ({
        id: String(alert.row_num as string),
        alertType: alert.alert.replace(/!/g, ''),
        vehicle_model: alert.vehicle_model,
        plate: alert.vehicle_plate,
        time: new Date(parseInt(alert.time) * 1000).toLocaleString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        }),
        first_name: alert.first_name,
        last_name: alert.last_name,
        id_number: alert.id_number,
        phone_number: alert.phone_number,
        next_of_kin: alert.next_of_kin || '',
        next_of_kin_number: alert.next_of_kin_number,
        user_id: alert.user_id,
        synced: alert.synced,
      }));

      dispatch(setAlerts(mapped));
    };
    wsService.subscribe('all_alerts_update', handleAlert);
    return () => {
      wsService.unsubscribe('all_alerts_update', handleAlert);
    };
  }, [dispatch]);

  // Responsive icon size
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const iconSize = windowWidth <= 760 ? 28 : 20;

  return (
    <aside className='sidebar'>
      <div className="sidebar-header">
        <div className="sidebar-header-content">
          <div className="sidebar-logo-section">
            <h1 className="sidebar-logo">Ekco</h1>
            <p className="sidebar-logo-subtitlte">Control Panel</p>
          </div>
          <div className="sidebar-controls">
            <button
              className="settings-btn"
              onClick={openSettingsModal}
              title="Settings"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <FiSettings size={20} />
            </button>
          </div>
        </div>
      </div>
      
      <nav className='sidebar-nav'>
        <ul>
          <li className={pathname?.includes('/dashboard/alerts') ? "sidebar-item-active" : ""}>
            <Link to="/dashboard/alerts" className={`sidebar-link${pathname?.includes('/dashboard/alerts') ? " active" : ""}`}>
              <div className="sidebar-link-content">
                <FaRegBell size={iconSize}/> 
                <span className="sidebar-link-text">Alerts</span>
                <span className="sidebar-badge warning">{alertsUnreadCount}</span>
              </div>
            </Link>
          </li>

          <li className={pathname?.includes('/dashboard/customers') ? "sidebar-item-active" : undefined}>
            <Link to="/dashboard/customers" className={`sidebar-link${pathname?.includes('/dashboard/customers') ? " active" : ""}`}>
              <div className="sidebar-link-content">
                <FiUsers size={iconSize}/>
                <span className="sidebar-link-text">Customers</span>
                <span className="sidebar-badge info">{customerCount}</span>
              </div>
            </Link>
          </li>

          <li className={pathname?.includes('/dashboard/fleet-approvals') ? "sidebar-item-active" : undefined}>
            <Link to="/dashboard/fleet-approvals" className={`sidebar-link${pathname?.includes('/dashboard/fleet-approvals') ? " active" : ""}`}>
              <div className="sidebar-link-content">
                <FiTruck size={iconSize}/>
                <span className="sidebar-link-text">Fleet Approvals</span>
                {notifications.fleetApprovals > 0 && (
                  <span className="sidebar-badge warning">{notifications.fleetApprovals}</span>
                )}
              </div>
            </Link>
          </li>

          <li className={pathname?.includes('/dashboard/fuel-cuts') ? "sidebar-item-active" : undefined}>
            <Link to="/dashboard/fuel-cuts" className={`sidebar-link${pathname?.includes('/dashboard/fuel-cuts') ? " active" : ""}`}>
              <div className="sidebar-link-content">
                <LuFuel size={iconSize}/>
                <span className="sidebar-link-text">Fuel Cuts</span>
                {notifications.fuelCuts > 0 && (
                  <span className="sidebar-badge warning">{notifications.fuelCuts}</span>
                )}
              </div>
            </Link>
          </li>

          <li className={pathname?.includes('/dashboard/devices') ? "sidebar-item-active" : undefined}>
            <Link to="/dashboard/devices" className={`sidebar-link${pathname?.includes('/dashboard/devices') ? " active" : ""}`}>
              <div className="sidebar-link-content">
                <GoCpu size={iconSize}/>
                <span className="sidebar-link-text">Devices</span>
                {notifications.devices > 0 && (
                  <span className="sidebar-badge critical">{notifications.devices}</span>
                )}
              </div>
            </Link>
          </li>

          <li className={pathname?.includes('/dashboard/todos') ? "sidebar-item-active" : undefined}>
            <Link to="/dashboard/todos" className={`sidebar-link${pathname?.includes('/dashboard/todos') ? " active" : ""}`}>
              <div className="sidebar-link-content">
                <GiPaperClip size={iconSize}/>
                <span className="sidebar-link-text">Todos</span>
                 {notifications.devices > 0 && (
                  <span className="sidebar-badge critical">{notifications.todos}</span>
                )}
              </div>
            </Link>
          </li>

         
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-footer-container">
          <div className="sidebar-user">
            <div className="avatar-tooltip-wrapper">
              <div className="sidebar-user-avatar">{avatarLetter || avatarLetterTwo}</div>
              <span className="sidebar-user-avatar-name">{displayName}</span>
            </div>
          </div>
          <div className="sidebar-logout" onClick={handleLogout} style={{ cursor: 'pointer' }}>
            <MdLogout size={28} className="sidebar-logout-icon" />
          </div>
        </div>
      </div>

      <SettingsModal
        isOpen={showSettingsModal}
        onClose={closeSettingsModal}
        speechEnabled={speechEnabled}
        onToggleSpeech={toggleSpeech}
      />
      <ConfirmationDialog
        isOpen={showLogoutDialog}
        message={`${displayName},  are you sure you want to logout?`}
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
      />
    </aside>
  );
}

export default Sidebar;
