import React, { useEffect, useState } from 'react';
import { Gauge } from '@kjanat/react-gauge-component';
import '../../../../styles/components/customers/customer-vehicle-details.scss';
import { useGetSpeedQuery, useGetIgnitionQuery, useGetGpsQuery } from '../../../../utils/api';
import wsService from '../../../../utils/websocket';

interface Vehicle {
  id: string;
  make: string;
  vehicle_model: string;
  year: string;
  package: string;
  device_serial: string;
}

interface CustomerVehicleDetailsCardProps {
  vehicle: Vehicle | null;
}

function CustomerVehicleDetailsCard({ vehicle }: CustomerVehicleDetailsCardProps) {
  const [speed, setSpeed] = useState(0);
  const [engineStatus, setEngineStatus] = useState('OFF');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [address, setAddress] = useState<string>('');

  // Flags to track if valid websocket data has been received
  const [wsSpeedReceived, setWsSpeedReceived] = useState(false);
  const [wsIgnitionReceived, setWsIgnitionReceived] = useState(false);
  const [hasValidGpsData, setHasValidGpsData] = useState(false);

  // Fetch speed
  const { data: speedData, refetch: refetchSpeed } = useGetSpeedQuery(vehicle?.device_serial ?? '', { skip: !vehicle });
  // Fetch ignition status
  const { data: ignitionData, refetch: refetchIgnition } = useGetIgnitionQuery(vehicle?.device_serial ?? '', { skip: !vehicle });
  // Fetch GPS data
  const { data: gpsData, refetch: refetchGps } = useGetGpsQuery(vehicle?.device_serial ?? '', { skip: !vehicle });

  // WebSocket subscriptions for real-time updates
  useEffect(() => {
    if (!vehicle) return;

    // Ensure WebSocket is connected
    wsService.connect();

    const handleIgnitionUpdate = (data: any[]) => {
      const ignitionEntry = data.find(entry => entry.device_serial === vehicle.device_serial);
      if (ignitionEntry && ignitionEntry.ignition_status) {
        setEngineStatus(ignitionEntry.ignition_status);
        setWsIgnitionReceived(true);
      }
    };

    const handleSpeedUpdate = (data: any[]) => {
      console.log('WebSocket Speed Update received:', data);
      const speedEntry = data.find(entry => entry.device_serial === vehicle.device_serial);
      console.log('Speed entry for device_serial', vehicle.device_serial, ':', speedEntry);
      if (speedEntry && speedEntry.speed !== undefined && speedEntry.speed !== null) {
        console.log('Updating speed to:', speedEntry.speed);
        setSpeed(speedEntry.speed);
        setWsSpeedReceived(true);
      } else {
        console.log('No valid speed entry found or speed is null/undefined');
      }
    };

 const handleGpsUpdate = (data: any[]) => {
  console.log('WebSocket GPS Update:', data);
  const gpsEntry = data.find(entry => entry.device_serial === vehicle.device_serial);

  if (gpsEntry) {
    // Check if the coordinates are valid before updating
    if (gpsEntry.latitude !== null && gpsEntry.longitude !== null) {
      setLatitude(gpsEntry.latitude);
      setLongitude(gpsEntry.longitude);
      setAddress(gpsEntry.address || '');
      setHasValidGpsData(true); // Flag that we have received valid GPS data
    } else {
      // Do not set the flag or update state with invalid data
      console.warn('WebSocket GPS update received with null coordinates for this vehicle.');
    }
  } else {
    // If no entry is found for the vehicle, do not set the flag
    console.warn('WebSocket GPS update received, but no entry found for this vehicle.');
  }
};

    wsService.subscribe('engine_update', handleIgnitionUpdate);
    wsService.subscribe('speed_update', handleSpeedUpdate);
    wsService.subscribe('gps_update', handleGpsUpdate);

    return () => {
      wsService.unsubscribe('engine_update', handleIgnitionUpdate);
      wsService.unsubscribe('speed_update', handleSpeedUpdate);
      wsService.unsubscribe('gps_update', handleGpsUpdate);
    };
  }, [vehicle]);

  useEffect(() => {
    if (!wsSpeedReceived && speedData?.speed_data?.[0]?.speed !== undefined && speedData.speed_data[0].speed !== null) {
      setSpeed(speedData.speed_data[0].speed);
    }
  }, [speedData, wsSpeedReceived]);

  useEffect(() => {
    if (!wsIgnitionReceived && ignitionData?.ignition_data?.[0]?.ignition_status) {
      setEngineStatus(ignitionData.ignition_data[0].ignition_status);
    }
  }, [ignitionData, wsIgnitionReceived]);

 useEffect(() => {
  console.log('API GPS Data:', gpsData?.gps_data?.[0]);
  console.log('hasValidGpsData:', hasValidGpsData);

  const gps = gpsData?.gps_data?.[0];

  if (
    !hasValidGpsData &&
    gps &&
    gps.latitude !== null &&
    gps.longitude !== null
  ) {
    setLatitude(gps.latitude);
    setLongitude(gps.longitude);
    setAddress(gps.address || '');
  }
}, [gpsData, hasValidGpsData]);

  // Use dummy data for testing if no vehicle
  const dummyVehicle = { id: 'dummy', make: 'Toyota', vehicle_model: 'Corolla', year: '2020', package: 'Basic', device_serial: 'DUMMY123' };
  const effectiveVehicle = vehicle || dummyVehicle;

  // Use dummy GPS data for testing
  const effectiveLatitude = latitude !== null ? latitude : -26.2041;
  const effectiveLongitude = longitude !== null ? longitude : 28.0473;
  const effectiveAddress = address || '123 Main St, Johannesburg, South Africa';

  if (!effectiveVehicle) {
    return <p>Loading vehicle details...</p>;
  }


  console.log('Speed Data:', speedData?.speed_data?.[0]?.speed);
  console.log('Ignition Data:', ignitionData?.ignition_data?.[0]?.ignition_status);
  console.log('GPS Data:', gpsData?.gps_data?.[0]?.latitude);
  return (
    <div className="customer-vehicle-details-card">
      <div className="customer-vehicle-details-card-container">
        <div className="customer-vehicle-details-col">
          <Gauge
            value={speed}
            min={0}
            max={450}
            label="Speed"
            displayType="custom"
            size={350}
            thickness={30}
            customDisplay={(val) => `${val.toFixed(1)} km/h`}
          />
        </div>

        <div className="customer-vehicle-details-col">
          <p>Serial Number: <span>{effectiveVehicle.device_serial}</span></p>
          <p>Ekco Package : <span>Fuel Cut</span></p>
          <p>Immobilisation Type: <span>Fuel Cut</span></p>
          <p>Immobilisation Status: <span>Immobilized</span></p>
        </div>

        <div className="customer-vehicle-details-col">
          <p>Engine : <span style={{ color: engineStatus.toLowerCase() === 'on' ? 'lime' : 'red', textTransform: 'uppercase' }}>{engineStatus}</span></p>
          <p>Latitude: <span>{effectiveLatitude.toFixed(6)}</span></p>
          <p>Longitude: <span>{effectiveLongitude.toFixed(6)}</span></p>
          <p>Address: <span>{effectiveAddress}</span></p>
          <button onClick={() => { refetchGps(); }}>Reload Address</button>
          <button onClick={async () => {
            const expires = Date.now() + 8 * 60 * 60 * 1000; // 8 hours from now
            const trackingUrl = `${window.location.origin}/tracking?serial=${effectiveVehicle.device_serial}&expires=${expires}`;
            if (navigator.share) {
              navigator.share({
                title: 'Vehicle Location',
                text: `Location: ${effectiveAddress}`,
                url: trackingUrl
              });
            } else {
              // Fallback: copy to clipboard
              try {
                await navigator.clipboard.writeText(`${trackingUrl}\nLocation: ${effectiveAddress}`);
                alert('Tracking link copied to clipboard');
              } catch (err) {
                alert('Failed to copy link. Please manually copy: ' + trackingUrl);
              }
            }
          }}>Share Location</button>
        </div>
      </div>
    </div>
  );
}

// Export the component
export default CustomerVehicleDetailsCard;
