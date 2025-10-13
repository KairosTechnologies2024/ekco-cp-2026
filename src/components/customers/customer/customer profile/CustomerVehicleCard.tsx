
import { FaCar } from "react-icons/fa";
import { GiCarWheel } from "react-icons/gi";
import '../../../../styles/components/customers/customer-vehicle-card.scss';
import { useNavigate } from "react-router-dom";
import { useGetCustomerVehiclesQuery } from "../../../../utils/api";
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

type CustomerVehicleCardProps = {
  userId: string;
};

function CustomerVehicleCard({ userId }: CustomerVehicleCardProps) {
  const navigate = useNavigate();
  const { data: vehicles, isLoading, error } = useGetCustomerVehiclesQuery(userId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [formData, setFormData] = useState({
    registration: '',
    year: '',
    name: '',
    model: '',
  });

  useEffect(() => {
    if (selectedVehicle) {
      setFormData({
        registration: selectedVehicle.vehicle_plate || '',
        year: selectedVehicle.year || '',
        name: '', // Assuming name is not in API
        model: selectedVehicle.vehicle_model || '',
      });
    }
  }, [selectedVehicle]);

  useEffect(() => {
    if (isModalOpen) {
      setIsVisible(true);
      requestAnimationFrame(() => setIsAnimating(true));
    } else if (!isModalOpen && isAnimating) {
      setIsAnimating(false);
      const timeout = setTimeout(() => {
        setIsVisible(false);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [isModalOpen]);

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
    <>
      <div className="customer-vehicle-card">
        <div className="customer-vehicle-card-container">
          <div className="vehicle-card-header">
            <GiCarWheel className="vehicle-card-header-icon" size={50}/>
            <h2 className="vehicle-card-title">Vehicles</h2>
            {/* <button className="add-vehicle-button">Add Vehicle</button> */}
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
                    <p className="vehicle-card-item-detail">{vehicle.device_serial} (Ekco Fuel Cut)</p>
                    <button className="vehicle-card-item-view-car-item" onClick={() => navigate(`/dashboard/customers/profile/${userId}/vehicle/${vehicle.id}`)}>View</button>
                    <button className="vehicle-card-item-view-car-item" onClick={() => { setSelectedVehicle(vehicle); setIsModalOpen(true); }}>Edit</button>
                  </div>
                </div>
              ))
            ) : (
              <p>No vehicles found</p>
            )}
          </div>
        </div>
      </div>
      {isVisible && ReactDOM.createPortal(
        <div className={`modal-overlay ${isAnimating ? 'open' : ''}`} onClick={() => setIsModalOpen(false)}>
          <div className={`modal-content ${isAnimating ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
            <h2>Edit Vehicle Details</h2>
            <form className="edit-vehicle-form" onSubmit={(e) => {
              e.preventDefault();
              // TODO: Implement update logic here
              alert('Update vehicle details: ' + JSON.stringify(formData));
              setIsModalOpen(false);
            }}>
              <label>
                Update Vehicle Registration
                <input
                  type="text"
                  value={formData.registration}
                  onChange={(e) => setFormData({ ...formData, registration: e.target.value })}
                />
              </label>
              <label>
                Update Vehicle Year
                <input
                  type="text"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                />
              </label>
              <label>
                Update Vehicle Name
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </label>
              <label>
                Update Vehicle Model
                <input
                  type="text"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                />
              </label>
              <div className="modal-buttons">
                <button type="button" className="cancel-button" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="save-button">Save</button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}

export default CustomerVehicleCard