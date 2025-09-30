import '../../../../styles/components/customers/customer-vehicle-location-card.scss';
import CustomerVehicleTop100Alerts from './CustomerVehicleTop100Alerts';
import { useGetAlertsBySerialQuery } from '../../../../utils/api';
import { useState, useEffect } from 'react';
import wsService from '../../../../utils/websocket';

interface CustomerVehileLocationProps {
  serialNumber: string;
}

function CustomerVehileLocation({ serialNumber }: CustomerVehileLocationProps) {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [realtimeAlerts, setRealtimeAlerts] = useState<any[]>([]);

  // Skip API call if serialNumber is empty or undefined
  const { data, isLoading, error } = useGetAlertsBySerialQuery(serialNumber, {
    skip: !serialNumber || serialNumber.trim() === '',
  });

  // WebSocket subscription for real-time alerts
  useEffect(() => {
    if (!serialNumber || serialNumber.trim() === '') return;

    const handleAlertUpdate = (data: any[]) => {
      // Filter alerts for this specific vehicle
      const vehicleAlerts = data.filter((alert: any) => alert.device_serial === serialNumber);

      if (vehicleAlerts.length > 0) {
        setRealtimeAlerts(prev => {
          // Add new alerts to the beginning and keep only latest 100
          const combined = [...vehicleAlerts, ...prev];
          return combined.slice(0, 100);
        });
      }
    };

    // Subscribe to alert updates
    wsService.subscribe('alert_update', handleAlertUpdate);





    // Cleanup on unmount
    return () => {
      wsService.unsubscribe('alert_update', handleAlertUpdate);
    };
  }, [serialNumber]);

  
  
  console.log('wsService:', wsService);

  if (isLoading) return <p>Loading alerts...</p>;
  if (error) throw new Error('Error loading alerts');

  const apiAlerts = data?.alerts || [];
  // Combine API alerts with real-time alerts
  const allAlerts = [...realtimeAlerts, ...apiAlerts];
  console.log('All Alerts Data:', allAlerts);

  // Generate unique alert types dynamically, stripping " !" and " detected" at the end
  const uniqueAlertTypes = Array.from(new Set(allAlerts.map((alert: any) => alert.message || alert.alert.replace(/ !$/g, '').replace(/ detected$/g, '')))).sort();

  // Filter alerts based on selected filter
  const filteredAlerts = selectedFilter === 'all'
    ? allAlerts
    : allAlerts.filter((alert: any) => (alert.message || alert.alert).replace(/ !$/g, '').replace(/ detected$/g, '') === selectedFilter);

  // Sort by timestamp descending (most recent first)
  const sortedAlerts = [...filteredAlerts].sort((a: any, b: any) => Number(b.timestamp || b.time) - Number(a.timestamp || a.time));

  // Cap at 100
  const cappedAlerts = sortedAlerts.slice(0, 100);

  return (
    <div className="customer-vehicle-location-card">
      <div className="customer-vehicle-map-container">
        <div
          className="mapouter"
          style={{
            position: 'relative',
            textAlign: 'right',
            height: '250px',
            width: '600px',
          }}
        >
          <div
            className="gmap_canvas"
            style={{
              overflow: 'hidden',
              backgroundColor: '#d0d3d9',
              height: '250px',
              width: '600px',
              borderRadius: '8px',
            }}
          >
            <iframe
              width={600}
              height={250}
              id="gmap_canvas"
              src="https://maps.google.com/maps?q=2880%20Broadway,%20New%20York&t=&z=13&ie=UTF8&iwloc=&output=embed"
              frameBorder="0"
              scrolling="no"
              marginHeight="0"
              marginWidth="0"
            ></iframe>
            <a href="https://embedgooglemap.net/124/"></a>
            <br />
            <a href="https://www.embedgooglemap.net"></a>
          </div>
        </div>
      </div>

      <div className="customer-vehicle-top-100-container">
        <select
          className="filter-top-100-alerts"
          name="alerts"
          id="alerts"
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
        >
          <option value="all">All Alerts</option>
          {uniqueAlertTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        {cappedAlerts.length > 0 ? (
          cappedAlerts.map((alert: any, index: number) => (
            <CustomerVehicleTop100Alerts
              key={index}
              alert={{
                alert: alert.message || alert.alert,
                time: Number(alert.timestamp || alert.time)
              }}
            />
          ))
        ) : (
          <p>No alerts available</p>
        )}
      </div>
    </div>
  );
}

export default CustomerVehileLocation