import { useEffect, useRef } from 'react';
import { Wrapper } from '@googlemaps/react-wrapper';

interface TrackingMapProps {
  center: { lat: number; lng: number };
  zoom: number;
  vehicleName?: string;
  serialNumber: string;
}

function Map({ center, zoom, vehicleName, serialNumber }: TrackingMapProps) {
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
                    <div><strong>${vehicleName || 'Vehicle'}</strong></div>
                    <div>Serial: ${serialNumber}</div>
                  </div><style>.gm-style-iw + div { display: none !important; }</style>`,
      });

      marker.addListener('mouseover', () => {
        infoWindow.open(map, marker);
      });

      marker.addListener('mouseout', () => {
        infoWindow.close();
      });
    }
  }, [center, zoom, vehicleName, serialNumber]);

  return <div ref={ref} style={{ height: '400px', width: '100%', borderRadius: '8px' }} />;
}

export default function TrackingMap({ center, zoom, vehicleName, serialNumber }: TrackingMapProps) {
  return (
    <Wrapper apiKey='AIzaSyD8uGqzqokt3i354ZgBZoZb5TywYwhGG_E'>
      <Map center={center} zoom={zoom} vehicleName={vehicleName} serialNumber={serialNumber} />
    </Wrapper>
  );
}
