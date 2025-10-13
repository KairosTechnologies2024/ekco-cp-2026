import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import TrackingMap from '../../components/tracking/TrackingMap';
import { useGetGpsPublicQuery } from '../../utils/api';
import wsService from '../../utils/websocket';

export default function TrackingPage() {
  const [searchParams] = useSearchParams();
  const serial = searchParams.get('serial');
  const expires = searchParams.get('expires');

  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [address, setAddress] = useState<string>('');

  const isExpired = expires ? Date.now() > parseInt(expires) : true;

  // Fetch GPS data
  const { data: gpsData } = useGetGpsPublicQuery(serial || '', { skip: !serial || isExpired });

  // WebSocket subscription for real-time updates
  useEffect(() => {
    if (!serial || isExpired) return;

    wsService.connect();

    const handleGpsUpdate = (data: any[]) => {
      const gpsEntry = data.find(entry => entry.device_serial === serial);
      if (gpsEntry && gpsEntry.latitude !== null && gpsEntry.longitude !== null) {
        setLatitude(gpsEntry.latitude);
        setLongitude(gpsEntry.longitude);
        setAddress(gpsEntry.address || '');
      }
    };

    wsService.subscribe('gps_update', handleGpsUpdate);

    return () => {
      wsService.unsubscribe('gps_update', handleGpsUpdate);
    };
  }, [serial, isExpired]);

  // Set initial data from API
  useEffect(() => {
    if (gpsData?.gps_data?.[0] && !latitude && !longitude) {
      const gps = gpsData.gps_data[0];
      if (gps.latitude !== null && gps.longitude !== null) {
        setLatitude(gps.latitude);
        setLongitude(gps.longitude);
        setAddress(gps.address || '');
      }
    }
  }, [gpsData, latitude, longitude]);

  if (isExpired) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Tracking Link Expired</h2>
        <p>The tracking link has expired and is no longer available.</p>
      </div>
    );
  }

  if (!latitude || !longitude) {
    return <p>Loading vehicle location...</p>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Vehicle Tracking</h2>
      <TrackingMap
        center={{ lat: latitude, lng: longitude }}
        zoom={15}
        serialNumber={serial || ''}
      />
      <p><strong>Address:</strong> {address || 'Loading...'}</p>
    </div>
  );
}
