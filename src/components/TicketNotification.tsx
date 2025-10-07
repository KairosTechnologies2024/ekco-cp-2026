import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import wsService from '../utils/websocket';
import './TicketNotification.scss'; // We'll create this

interface Ticket {
  id: number;
  title: string;
  customername: string;
  // Add other fields if needed
}

const TicketNotification: React.FC = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [maxTicketId, setMaxTicketId] = useState<number | null>(null);
  const [newTicket, setNewTicket] = useState<Ticket | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleTicketsUpdate = (data: Ticket[]) => {
      if (data.length > 0) {
        const newMaxId = Math.max(...data.map(t => t.id));
        if (maxTicketId === null) {
          setMaxTicketId(newMaxId);
        } else if (newMaxId > maxTicketId) {
          const ticket = data.find(t => t.id === newMaxId);
          if (ticket) {
            setNewTicket(ticket);
            setShowPopup(true);
            setMaxTicketId(newMaxId);
            // Auto hide after 5 seconds
            setTimeout(() => {
              setShowPopup(false);
              setNewTicket(null);
            }, 5000);
          }
        }
      }
    };

    wsService.subscribe('all_tickets_update', handleTicketsUpdate);

    // Connect WebSocket
    wsService.connect();

    return () => {
      wsService.unsubscribe('all_tickets_update', handleTicketsUpdate);
    };
  }, [maxTicketId]);

  const handleClick = () => {
    setShowPopup(false);
    navigate('/dashboard/todos/tickets');
  };

  return (
    <>
      {showPopup && newTicket && (
        <div className="ticket-notification" onClick={handleClick}>
          <div className="notification-content">
            <p>New Ticket:</p> {newTicket.title}<br />
            <p>Customer:</p> {newTicket.customername}
          </div>
        </div>
      )}
    </>
  );
};

export default TicketNotification;
