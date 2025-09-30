
import '../../../styles/components/alerts/alert-card.scss';
import { FaCarBattery, FaCarCrash, FaBroadcastTower, FaUserLock } from "react-icons/fa";
import React, { type JSX } from "react";
import { useTheme } from '../../theme/ThemeContext';
import AlertModal from './AlertModal';
import { useState } from 'react';
import { createPortal } from 'react-dom';

type AlertCardProps = {
  id?: string;
  alertType: string;
  time: string;
  vehicle_model: string;
  plate: string;
  isHazard?: boolean;
  onViewed?: (id: string) => void | Promise<void>;
  first_name: string;
  last_name: string;
  id_number: string;
  phone_number: string;
  next_of_kin: string;
  next_of_kin_number: string;
  user_id: string;
  synced: boolean;
};


const AlertCard: React.FC<AlertCardProps> = ({ id, alertType, time, vehicle_model, plate, isHazard,
   first_name, last_name, id_number, phone_number, next_of_kin, next_of_kin_number, user_id, onViewed}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isDarkTheme} = useTheme();


const normalizedAlertType = alertType?.trim().toLowerCase();


console.log('normalizedAlertType:', normalizedAlertType);

const iconMap: Record<string, JSX.Element> = {
  "car battery disconnected": <FaCarBattery size={30} color={isDarkTheme ? 'aqua' : '#319795'} />,
  "smash and grab detected": <FaCarCrash size={30} color="crimson" />,
  "possible remote jamming detected": <FaBroadcastTower size={30} color={isDarkTheme ? 'orange' : '#b16527ff'} />,
  "unauthorized access": <FaUserLock size={30} color={isDarkTheme ? 'gold' : '#0f3054'} />,
  "ignition on": <FaCarBattery size={30} color={isDarkTheme ? 'aqua' : '#319795'} />,
};




const alertData = {
  type: alertType,
  date: time,
  vehicleModel: vehicle_model,
  vehiclePlate: plate,
  customerName: `${first_name} ${last_name}`,
  idNumber: id_number,
  phoneNumber: phone_number,
  nextOfKin: next_of_kin,
  nextOfKinContact: next_of_kin_number,
  userId: user_id
};


  

  return (
    <>
    <div className={`alert-card${isHazard ? (isDarkTheme ? ' hazard-blink' : ' hazard-soft new-alert') : ''}`}>
      <div className="alert-column-1">




       <div className="alert-icon">
    {iconMap[normalizedAlertType] || <FaCarCrash size={30} color="gray" />}
  </div>




        <div className="alert-meta">
        <h3 className={`alert-title${isHazard ? (isDarkTheme ? ' hazard-blink' : ' hazard-soft-title') : ''}`}>
          {alertType}
        </h3>
          <p className="alert-time">{time}</p>
        </div>
      </div>
      <div className="alert-column-2">
        <h3 className="vehicle-name">{vehicle_model}</h3>
      </div>
      <div className="alert-column-3">
        <h3 className="vehicle-plate">{plate}</h3>
      </div>
      <div className="alert-column-4">
       <button
    // Corrected style prop:
    style={isHazard ? { transition: 'none' } : {}}
    className="alert-btn"
    onClick={async () => {
        if (id && onViewed) {
            await onViewed(id);
        }
        setIsModalOpen(true);
    }}
>
    View
</button>
      </div>
    </div>



    
   {createPortal(
        <AlertModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          alertData={alertData}
        />,
        document.body
      )}


      
      </>
  );
};

export default AlertCard;
