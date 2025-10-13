import '../../../../styles/components/customers/customer-vehicle-location-card.scss';
import CustomerVehicleTop100Alerts from './CustomerVehicleTop100Alerts';
import { useGetAlertsBySerialQuery, useGetIgnitionQuery } from '../../../../utils/api';
import { useState, useEffect, useRef } from 'react';
import wsService from '../../../../utils/websocket';
import { Wrapper, Status } from '@googlemaps/react-wrapper';

interface CustomerVehileLocationProps {
  serialNumber: string;
  latitude?: number;
  longitude?: number;
  vehicleName?: string;
}

function Map({ center, zoom, vehicleName, serialNumber, fuelCutStatus, deviceHealthStatus }: { center: any; zoom: number; vehicleName?: string; serialNumber: string; fuelCutStatus: string; deviceHealthStatus: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && (window as any).google) {
      const map = new (window as any).google.maps.Map(ref.current, {
        center,
        zoom,
      });

      const marker = new (window as any).google.maps.Marker({
        position: center,
        map,
      });

      const infoWindow = new (window as any).google.maps.InfoWindow({
        content: `<div style="background-color: black; color: white; padding: 2px 5px; border-radius: 3px; font-size: 12px;">
                    <div><strong>${vehicleName}</strong></div>
                    <div>Serial: ${serialNumber}</div>
                    <div>Fuel Cut Status: ${fuelCutStatus}</div>
                    <div>Device Health: ${deviceHealthStatus}</div>
                  </div><style>.gm-style-iw + div { display: none !important; }</style>`,
      });

      marker.addListener('mouseover', () => {
        infoWindow.open(map, marker);
      });

      marker.addListener('mouseout', () => {
        infoWindow.close();
      });
    }
  }, [center, zoom, vehicleName, serialNumber, fuelCutStatus, deviceHealthStatus]);

  return <div ref={ref} style={{ height: '250px', width: '600px', borderRadius: '8px' }} />;
}

function CustomerVehileLocation({ serialNumber, latitude, longitude, vehicleName }: CustomerVehileLocationProps) {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [realtimeAlerts, setRealtimeAlerts] = useState<any[]>([]);

  // Skip API call if serialNumber is empty or undefined
  const { data, isLoading, error } = useGetAlertsBySerialQuery(serialNumber, {
    skip: !serialNumber || serialNumber.trim() === '',
  });

  const { data: ignitionData } = useGetIgnitionQuery(serialNumber, {
    skip: !serialNumber || serialNumber.trim() === '',
  });

  const fuelCutStatus = ignitionData?.ignition_data?.[0]?.ignition_status || 'Unknown';
  const deviceHealthStatus = 'Good'; // Placeholder, as device health data is not fetched here

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
        <Wrapper apiKey='AIzaSyD8uGqzqokt3i354ZgBZoZb5TywYwhGG_E'>
          <Map center={latitude && longitude ? { lat: latitude, lng: longitude } : { lat: -26.2041, lng: 28.0473 }} zoom={13} vehicleName={vehicleName} serialNumber={serialNumber} fuelCutStatus={fuelCutStatus} deviceHealthStatus={deviceHealthStatus} />
        </Wrapper>
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