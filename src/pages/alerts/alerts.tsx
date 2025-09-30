import React, { useState, useEffect, useRef } from 'react';

import '../../styles/components/alerts/alerts.scss';
import { Fade } from "react-awesome-reveal";
import { LiaBroomSolid } from "react-icons/lia";
import AlertCard from '../../components/dashboard/alerts/AlertCard';
import { useBreadcrumbs } from '../../store/context/BreadcrumbsContext';
import toast from 'react-hot-toast';
import wsService from '../../utils/websocket';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store/redux';
import { setAlerts, updateAlertSynced } from '../../store/redux/alertsSlice';
import type { Alert } from '../../store/redux/alertsSlice';
import { useGetAllAlertsQuery, useMarkAlertSyncedMutation } from '../../utils/api';
import GlobalLoader from '../../components/global loader/GlobalLoader';
import speechService from '../../utils/speech';
import alertSound from '../../assets/alert.wav';
import GlobalError from '../../components/global error/GlobalError';

const alertTypes = [
  "Car Battery Disconnected",
  "Smash & Grab",
  "Remote Jamming",
  "Unauthorized Access"
];

function AlertsPage() {

  const [selectedType, setSelectedType] = useState('All');
  const toastedAlertIdsRef = useRef<Set<string>>(new Set()); // tracks alerts already toasted (session only)
  const newAlertIdsRef = useRef<Set<string>>(new Set());
  const toastQueueRef = useRef<Alert[]>([]);
  const isProcessingRef = useRef(false);
  const audioEnabledRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const TOAST_DURATION = 4000;
  const TOAST_GAP = 250;
  const errorMessage = "Unauthorized or failed to load alerts. Please try again later.";

  const processToastQueue = () => {
    if (isProcessingRef.current) return;
    const next = toastQueueRef.current.shift();
    if (!next) return;
    isProcessingRef.current = true;
    toast.error(`${next.alertType} for ${next.vehicle_model}`, {
      duration: TOAST_DURATION,
      style: {
        background: '#d32f2f',
        color: '#fff',
        fontWeight: 'bold'
      }
    });
    setTimeout(() => {
      isProcessingRef.current = false;
      processToastQueue();
    }, TOAST_DURATION + TOAST_GAP);
  };

  const enqueueToasts = (items: Alert[]) => {
    if (!items.length) return;

    // Filter out synced alerts and alerts already toasted, and only take the latest (last) alert
    const toastableAlerts = items.filter(alert => !alert.synced && !toastedAlertIdsRef.current.has(alert.id)).slice(-1);

    if (!toastableAlerts.length) return;

    // Play alert sound for new alerts if audio is enabled
    if (audioEnabledRef.current && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(err => console.error('Audio play failed:', err));
    }

    toastQueueRef.current.push(...toastableAlerts);
    processToastQueue();

    // Mark alerts as toasted to prevent re-toasting
    toastableAlerts.forEach(alert => toastedAlertIdsRef.current.add(alert.id));

    // Also speak the alerts if speech is enabled
    if (speechService.getEnabled()) {
      toastableAlerts.forEach((alert, index) => {
        // Add a small delay between speeches to avoid overlap
        setTimeout(() => {
          speechService.speakAlert({
            alertType: alert.alertType,
            vehicleModel: alert.vehicle_model,
            plate: alert.plate,
            customerName: `${alert.first_name} ${alert.last_name}`,
            time: alert.time
          }).catch(error => {
            console.error('Speech synthesis failed:', error);
          });
        }, index * 2000); // 2 second delay between alerts
      });
    }
  };
  const alerts = useSelector((state: RootState) => state.alerts.alerts);
  const dispatch = useDispatch();
  const { setBreadcrumbs } = useBreadcrumbs();
  const { data: allAlertsData, error, isLoading } = useGetAllAlertsQuery();
  const [markAlertSynced] = useMarkAlertSyncedMutation();

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Dashboard', path: '/dashboard' },
      { label: 'Alerts', path: '/dashboard/alerts' }
    ]);
  }, [setBreadcrumbs]);

  useEffect(() => {
    // Preload the alert sound
    audioRef.current = new Audio(alertSound);
    audioRef.current.load();

    // Enable audio on first user interaction
    const enableAudio = () => {
      audioEnabledRef.current = true;
      document.removeEventListener('click', enableAudio);
    };
    document.addEventListener('click', enableAudio);

    return () => {
      document.removeEventListener('click', enableAudio);
    };
  }, []);

  useEffect(() => {
    if (allAlertsData?.alerts) {
      const filteredAlerts = allAlertsData.alerts.filter(alert => alert.alert !== "Ignition on" && alert.alert !== "Door open");
      const sorted = [...filteredAlerts].sort((a, b) => Number(b.time) - Number(a.time));
      const mappedAlerts: Alert[] = sorted.map(alert => ({
        id: String(alert.id),
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
      dispatch(setAlerts(mappedAlerts));

      // Do not auto-mark as read; only mark on explicit view or broom
      // No hazard on initial load
      newAlertIdsRef.current = new Set();
    }
  }, [allAlertsData, dispatch]);

  useEffect(() => {
    wsService.connect();

    const handleAlert = (alertsData: any[]) => {
      const filteredAlerts = alertsData.filter(alert => alert.alert !== "Ignition on" && alert.alert !== "Door open");
      const sorted = [...filteredAlerts].sort((a, b) => Number(b.time) - Number(a.time));
      const mappedAlerts: Alert[] = sorted.map(alert => ({
        id: String(alert.id),
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

      // Compute new alerts against current list to highlight hazards
      const prevIds = new Set(alerts.map(a => a.id));
      const newInList = mappedAlerts.filter(a => !prevIds.has(a.id));
      newAlertIdsRef.current = new Set(newInList.map(a => a.id));

      // Update list (newest first)
      dispatch(setAlerts(mappedAlerts));

      // Enqueue toasts for new alerts (only non-synced ones, latest only)
      enqueueToasts(newInList);
    };

    wsService.subscribe('all_alerts_update', handleAlert);

    return () => {
      wsService.unsubscribe('all_alerts_update', handleAlert);
      wsService.disconnect();
    };
  }, [dispatch, alerts]);

  const filteredAlerts = selectedType === 'All'
    ? alerts
    : alerts.filter(alert => alert.alertType === selectedType);

  return (
    <section className="alerts global-margin">
      <div className="alerts-clear-notifications" onClick={async () => {
        try {
          // Mark all current alerts as synced
          await Promise.all(alerts.map(alert =>
            markAlertSynced(alert?.id || '').unwrap()
          ));
          // Update Redux state to reflect synced status
          alerts.forEach(alert => {
            dispatch(updateAlertSynced({ id: alert?.id || '', synced: true }));
          });
          toast.success('Marked all current alerts as read');
        } catch (error) {
          console.error('Failed to mark alerts as synced:', error);
          toast.error('Failed to mark alerts as read');
        }
      }}>
        <LiaBroomSolid className="alerts-icon" size={30} title='mark all alerts as read' />
      </div>

      <div className="alerts-container">
        <div className="alerts-header">
          <div className="alerts-header-column-1">
            <div className="alerts-title">Critical Alerts <span>Top 200</span></div>
            <select
              className="alerts-filter-select"
              value={selectedType}
              onChange={e => setSelectedType(e.target.value)}
            >
              <option value="All">All Alert Types</option>
              {alertTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div className="alerts-header-column-2">
            <h3>ALERT TYPE</h3>
            <h3>VEHICLE</h3>
            <h3>NO. PLATE</h3>
            <h3></h3>
          </div>
        </div>

        <div className="alerts-list">
          {isLoading ? (
            <GlobalLoader />
          ) : error ? (
          <GlobalError errorMessage={errorMessage}/>
          ) : alerts.length === 0 ? (
            <div className="alerts-no-alerts">
              No alerts yet
            </div>
          ) : (
            <Fade>
              {filteredAlerts.map((alert, i) => (
                <AlertCard key={alert.id || i} {...alert}
                  isHazard={!alert.synced}
                  onViewed={async (id) => {
                    try {
                      await markAlertSynced(id).unwrap();
                      dispatch(updateAlertSynced({ id, synced: true }));
                    } catch (error) {
                      console.error('Failed to mark alert as synced:', error);
                    }
                  }}
                />
              ))}
            </Fade>
          )}
        </div>
      </div>
    </section>
  );
}

export default AlertsPage;
