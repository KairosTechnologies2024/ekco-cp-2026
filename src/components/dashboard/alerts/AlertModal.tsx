import React, { useEffect, useState, type JSX } from 'react';
import { FaBatteryEmpty, FaCar, FaUser, FaPhone, FaUserFriends, FaCarBattery, FaCarCrash, FaBroadcastTower, FaUserLock } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import '../../../styles/components/alerts/alert-modal.scss';
import { PiBatteryLowFill } from "react-icons/pi";
import { MdOutlineSettingsRemote } from "react-icons/md";
import { GiGrab } from "react-icons/gi";

import { MdOutlineAccessTime } from "react-icons/md";
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  alertData: {
    type: string;
    date: string;
    vehicleModel: string;
    vehiclePlate: string;
    customerName: string;
    idNumber: string;
    phoneNumber: string;
    nextOfKin: string;
    nextOfKinContact: string;
    userId?: string;
  };
}




const AlertModal: React.FC<AlertModalProps> = ({ isOpen, onClose, alertData }) => {

  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => {
        setIsActive(true);
      });
    } else {
      setIsActive(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsActive(false);
      setTimeout(onClose, 300); // Match transition duration
    }
  };

  const normalizedAlertType = alertData.type.trim().toLowerCase();

  const iconMap: Record<string, JSX.Element> = {
    "car battery disconnected": <PiBatteryLowFill className="alert-icon"   />,
    "smash and grab detected": <GiGrab className="alert-icon"   size={25} />,
    "possible remote jamming detected": <MdOutlineSettingsRemote className="alert-icon" size={25} />,
    "unauthorized access": <FaUserLock className="alert-icon"   />,
    "ignition on": <FaCarBattery className="alert-icon"  />,
  };

  const AlertIcon = iconMap[normalizedAlertType] || <FaBatteryEmpty className="alert-icon" size={30} color="gray" />;

  console.log("Alert Data in Modal:", alertData);

  return (
    <div 
      className={`alert-modal-overlay ${isActive ? 'active' : ''}`}
      onClick={handleOverlayClick}
    >
      <div className={`alert-modal ${isActive ? 'active' : ''}`}>
        <div className="alert-modal-header">
          <h2>Alert Details</h2>
          <button 
            className="close-button" 
            onClick={() => {
              setIsActive(false);
              setTimeout(onClose, 300);
            }}
          >
            <IoMdClose size={24} />
          </button>
        </div>

        <div className="alert-modal-content">
          <div className="alert-section alert-type">
            {AlertIcon}
            <div>
              <h3>Alert Type</h3>
              <p>{alertData.type}</p>
            </div>
          </div>

          <div className="alert-section">
                 <MdOutlineAccessTime className="alert-icon" size={25} />
            <div>
           
              <h3>Date & Time</h3>
              <p>{alertData.date}</p>
            </div>
          </div>

          <div className="alert-section">
            <FaCar className="alert-icon" />
            <div>
              <h3>Vehicle Information</h3>
              <p>{alertData.vehicleModel}</p>
              <p>{alertData.vehiclePlate}</p>
            </div>
          </div>

          <div className="alert-section">
            <FaUser className="alert-icon" />
            <div>
              <h3>Customer Details</h3>
              <p>{alertData.customerName}</p>
              <p>ID: {alertData.idNumber}</p>
            </div>
          </div>

          <div className="alert-section">
            <FaPhone className="alert-icon" />
            <div>
              <h3>Contact Information</h3>
              <p>{alertData.phoneNumber}</p>
            </div>
          </div>

          <div className="alert-section">
            <FaUserFriends className="alert-icon" />
            <div>
              <h3>Next of Kin</h3>
              <p>{alertData.nextOfKin}</p>
              <p>{alertData.nextOfKinContact}</p>
            </div>
          </div>


          <div className="alert-modal-footer">
          <button 
            className="profile-button"

            onClick={()=> navigate(`/dashboard/customers/profile/${alertData.userId}`)}
        
          >
            Go to Profile
          </button>
        </div>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;
