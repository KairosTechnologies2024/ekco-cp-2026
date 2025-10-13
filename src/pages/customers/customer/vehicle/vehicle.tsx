import CustomerVehicleDetailsCard from "../../../../components/customers/customer/vehicle/CustomerVehicleDetails";
import CustomerVehileLocation from "../../../../components/customers/customer/vehicle/CustomerVehileLocation";
import CustomerVehicleTop100Alerts from "../../../../components/customers/customer/vehicle/CustomerVehicleTop100Alerts";
import '../../../../styles/components/customers/customer-vehicle-page.scss';

import { useBreadcrumbs } from "../../../../store/context/BreadcrumbsContext";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetCustomerVehiclesQuery, useGetCustomerQuery } from "../../../../utils/api";
import wsService from '../../../../utils/websocket';
import GlobalError from "../../../../components/global error/GlobalError";
function CustomerVehiclePage() {
  const { id: customerId, vehicleId } = useParams<{ id: string; vehicleId: string }>();
  const { setBreadcrumbs } = useBreadcrumbs();
  const { data: vehiclesData, isLoading: vehiclesLoading, error: vehiclesError } = useGetCustomerVehiclesQuery(customerId || '');
  const { data: customerData, isLoading: customerLoading, error: customerError } = useGetCustomerQuery(customerId || '');

  const [vehicle, setVehicle] = useState<{ id: string; make: string; vehicle_model: string; year: string; package: string; device_serial: string } | null>(null);
  const [vehicleLocation, setVehicleLocation] = useState<{ latitude: number; longitude: number; address: string } | null>(null);
  


  let errorMessage = 'Error loading vehicle information...';
  useEffect(() => {
    if (vehiclesData && vehicleId) {
      const foundVehicle = vehiclesData.vehicles.find((v: any) => v.id === vehicleId);
      setVehicle(foundVehicle || null);
    }
  }, [vehiclesData, vehicleId]);

  useEffect(() => {
    if (vehicle && customerData) {
      setBreadcrumbs([
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Customers', path: '/dashboard/customers' },
        { label: 'View', path: '/dashboard/customers/list' },
        { label: `${customerData.user.first_name} ${customerData.user.last_name}`, path: `/dashboard/customers/profile/${customerId}` },
        { label: ` ${vehicle.vehicle_model}`, path: `/dashboard/customers/profile/${customerId}/vehicle/${vehicle.id}` }
      ]);
    }
  }, [vehicle, customerData, customerId, setBreadcrumbs]);

  // WebSocket subscription for vehicle location updates
  useEffect(() => {
    if (!vehicle) return;

    const handleGpsUpdate = (data: any[]) => {
      const gpsEntry = data.find(entry => entry.device_serial === vehicle.device_serial);
      if (gpsEntry) {
        setVehicleLocation({
          latitude: gpsEntry.latitude,
          longitude: gpsEntry.longitude,
          address: gpsEntry.address,
        });
      }
    };

    wsService.subscribe('gps_update', handleGpsUpdate);

    return () => {
      wsService.unsubscribe('gps_update', handleGpsUpdate);
    };
  }, [vehicle]);

  if (vehiclesLoading || customerLoading || vehiclesError || customerError) return <GlobalError errorMessage={errorMessage} />;


  return (
    <GlobalError errorMessage={errorMessage}>
      <section className="customer-vehicle-page global-margin">
        <CustomerVehileLocation serialNumber={vehicle?.device_serial || ''} latitude={vehicleLocation?.latitude} longitude={vehicleLocation?.longitude} vehicleName={`${vehicle?.make ? vehicle.make + ' ' : ''}${vehicle?.vehicle_model}`} />
        <CustomerVehicleDetailsCard vehicle={vehicle} />
        {/* Optionally pass vehicleLocation to components if needed */}
      </section>
    </GlobalError>
  );
}

export default CustomerVehiclePage;
