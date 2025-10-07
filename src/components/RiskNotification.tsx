import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import wsService from '../utils/websocket';
import './RiskNotification.scss';

interface Risk {
  id: number;
  title: string;
  clientname: string;
}

const RiskNotification: React.FC = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [newRisk, setNewRisk] = useState<Risk | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleRisksUpdate = (data: Risk[]) => {
      console.log('[RiskNotification] Received risk update:', data);

      if (data.length > 0) {
        const latest = data[0]; // Assuming server sends new risks ordered by createdAt ASC
        setNewRisk(latest);
        setShowPopup(true);

        // Auto-hide after 5 seconds
        setTimeout(() => {
          setShowPopup(false);
          setNewRisk(null);
        }, 5000);
      }
    };

    wsService.subscribe('all_risks_update', handleRisksUpdate);
    wsService.connect();

    return () => {
      wsService.unsubscribe('all_risks_update', handleRisksUpdate);
    };
  }, []);

  const handleClick = () => {
    setShowPopup(false);
    navigate('/dashboard/todos/risks');
  };

  return (
    <>
      {showPopup && newRisk && (
        <div className="risk-notification" onClick={handleClick} role="button" tabIndex={0}>
          <div className="notification-content">
            <p className="label">New Risk</p>
            <p className="title">{newRisk.title}</p>
            <p className="client">Client: {newRisk.clientname}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default RiskNotification;
