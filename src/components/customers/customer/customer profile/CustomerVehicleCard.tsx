
import { FaCar } from "react-icons/fa";
import { GiCarWheel } from "react-icons/gi";
import '../../../../styles/components/customers/customer-vehicle-card.scss';
import { useNavigate } from "react-router-dom";
import { useGetCustomerVehiclesQuery } from "../../../../utils/api";

type CustomerVehicleCardProps = {
  userId: string;
};

function CustomerVehicleCard({ userId }: CustomerVehicleCardProps) {
  const navigate = useNavigate();
  const { data: vehicles, isLoading, error } = useGetCustomerVehiclesQuery(userId);

  if (isLoading) {
    return <div>Loading vehicles...</div>;
  }

  if (error) {
    return <div>Error loading vehicles</div>;
  }


  console.log('Fetched vehicles:', vehicles?.vehicles);

  // Filter out duplicates based on vehicle_model and device_serial
  const uniqueVehicles = vehicles?.vehicles?.filter((vehicle, index, self) =>
    index === self.findIndex(v =>
      v.vehicle_model === vehicle.vehicle_model && v.device_serial === vehicle.device_serial
    )
  ) || [];

  return (
   <div className="customer-vehicle-card">


    <div className="customer-vehicle-card-container">


       <div className="vehicle-card-header">
        <GiCarWheel className="vehicle-card-header-icon" size={50}/>
        <h2 className="vehicle-card-title">Vehicles</h2>
     {/*    <button className="add-vehicle-button">Add Vehicle</button> */}
       </div>


         <div className="vehicle-card-list">
           {uniqueVehicles.length > 0 ? (
             uniqueVehicles.map((vehicle) => (
               <div key={vehicle.id} className="vehicle-card-item">
                 <div className="vehicle-card-item-contents">
                   <FaCar size={25}/>
                 </div>
                 <div className="vehicle-card-item-contents">
                   <p className="vehicle-card-item-car-title">{vehicle.vehicle_model}</p>
                   <p className="vehicle-card-item-detail">{vehicle.vehicle_plate}</p>
                   <p className="vehicle-card-item-detail">{vehicle.device_serial}  (Ekco Fuel Cut)</p>
                   <button className="vehicle-card-item-view-car-item" onClick={() => navigate(`/dashboard/customers/profile/${userId}/vehicle/${vehicle.id}`)}>View</button>
                 </div>
               </div>
             ))
           ) : (
             <p>No vehicles found</p>
           )}
         </div>
    </div>
   </div>
  )
}

export default CustomerVehicleCard