import { useEffect, useState } from "react";
import { createPortal } from 'react-dom';
import { useBreadcrumbs } from "../../../store/context/BreadcrumbsContext";
import "../../../styles/components/todos/tickets.scss";
import { FaCheck, FaTrash, FaClock, FaUser } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import { format } from 'date-fns';
import { Slide } from "react-awesome-reveal";
import { useGetTicketsQuery, useUpdateTicketMutation, useDeleteTicketMutation } from "../../../utils/api";
import toast from "react-hot-toast";
import wsService from "../../../utils/websocket";
interface Ticket {
  id: number;
  title: string;
  type: string;
  description: string;
  status: 'pending' | 'resolved';
  createdat: string;
  updatedat: string | null;
  customername: string;
  customeremail: string;
  customerphone: string;
  loggedby: string; // Customer who created the ticket
  resolvedby: string | null; // Support staff who resolved it
  user_id: number;
  customer_id: number;
  user_email: string;
  user_type: string;
  first_name: string;
  last_name: string;
  phone_number: string;
}

function TodosTicketsPage() {
  const { setBreadcrumbs } = useBreadcrumbs();
  const { data: ticketsData, isLoading, isError, refetch } = useGetTicketsQuery();
  const [updateTicket] = useUpdateTicketMutation();
  const [deleteTicket] = useDeleteTicketMutation();

  const [popupActive, setPopupActive] = useState(false);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'resolved'>('all');
  const [showResolvedPopup, setShowResolvedPopup] = useState(false);
  const [resolvedByName, setResolvedByName] = useState('');
  const [currentTicketId, setCurrentTicketId] = useState<number | null>(null);

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Dashboard', path: '/dashboard' },
      { label: 'Todos', path: '/dashboard/todos' },
      { label: 'Tickets', path: '/dashboard/tickets' }
    ]);
  }, [setBreadcrumbs]);

  useEffect(() => {
    if (ticketsData && ticketsData.tickets) {
      setTickets(ticketsData.tickets);
    }
  }, [ticketsData]);

  useEffect(() => {
    const handleTicketsUpdate = () => {
      refetch();
    };

    wsService.subscribe('all_tickets_update', handleTicketsUpdate);

    return () => {
      wsService.unsubscribe('all_tickets_update', handleTicketsUpdate);
    };
  }, [refetch]);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
  };

  const handleMarkAsResolved = (ticketId: number) => {
    setCurrentTicketId(ticketId);
    setShowResolvedPopup(true);

    console.log('show resolved popup', showResolvedPopup);
  };

  const handleResolvedBySubmit = async () => {
    if (resolvedByName.trim() && currentTicketId !== null) {
      const now = new Date().toISOString();
      try {
        await updateTicket({
          id: currentTicketId,
          data: {
            status: 'resolved',
            resolvedby: resolvedByName,
            resolvedat: now,
            updatedat: now,
          },
        }).unwrap();

        toast.success('Ticket updated and marked as resolved');
        setShowResolvedPopup(false);
        setResolvedByName('');
        refetch();
      } catch (error) {
        alert('Failed to update ticket');
      }
    } else {
      alert('Please enter your name');
    }
  };

  const handleDelete = async (ticketId: number) => {
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      try {
        await deleteTicket(ticketId).unwrap();

        toast.success('Ticket deleted successfully');
        refetch();
      } catch (error) {
        alert('Failed to delete ticket');
      }
    }
  };

  const filteredTickets = tickets
    .filter(ticket => (
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.customername.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.type.toLowerCase().includes(searchTerm.toLowerCase())
    ))
    .filter(ticket => filterStatus === 'all' ? true : ticket.status === filterStatus);

  useEffect(() => {
    if (showResolvedPopup) {
      setPopupActive(true);
    } else {
      setPopupActive(false);
    }
  }, [showResolvedPopup]);

  if (isLoading) {
    return <div>Loading tickets...</div>;
  }

  if (isError) {
    return <div>Error loading tickets.</div>;
  }

  return (
    <>
      <Slide direction="right" triggerOnce style={{ zIndex: -99999 }}>
        <section className="tickets global-margin">
          <div className="tickets-header">
            <div className="search-wrapper">
              <IoIosSearch className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search tickets by title, customer name or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="ticket-filter-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'pending' | 'resolved')}
            >
              <option value="all">All Tickets</option>
              <option value="pending">Pending</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          <div className="tickets-list">
            {filteredTickets.map((ticket) => (
              <div key={ticket.id} className={`ticket-card ${ticket.status}`}>
                <div className="ticket-header">
                  <div className="ticket-title">
                    <h3>{ticket.title} #{ticket.id}</h3>
                    <span className={`ticket-status ${ticket.status}`}>
                      {ticket.status}
                    </span>
                  </div>
                  <div className="ticket-meta">
                    <span className="ticket-time">
                      <FaClock /> {formatDate(ticket.createdat)}
                    </span>
                    <span className="ticket-customer">
                      <FaUser /> {ticket.customername}
                    </span>
                  </div>
                </div>

                <div className="ticket-details">
                  <p className="ticket-type"><strong>Type:</strong> {ticket.type}</p>
                  <p className="ticket-description">{ticket.description}</p>
                  <div className="ticket-contact">
                    <p><strong>Email:</strong> {ticket.customeremail}</p>
                    <p><strong>Phone:</strong> {ticket.customerphone}</p>
                  </div>
                </div>

                <div className="ticket-footer">
                  <div className="ticket-info">
                    <p><strong>Logged by:</strong> {ticket.loggedby}</p>
                    {ticket.resolvedby && (
                      <p><strong>Resolved by:</strong> {ticket.resolvedby}</p>
                    )}
                  </div>
                  <div className="ticket-actions">
                    {ticket.status === 'pending' && (
                      <button
                        className="resolve-btn"
                        onClick={() => handleMarkAsResolved(ticket.id)}
                      >
                        <FaCheck /> Resolve
                      </button>
                    )}
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(ticket.id)}
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Resolved By Popup - placed inside .tickets so SCSS .tickets .resolved-popup applies */}
          {showResolvedPopup && createPortal(
            <div className={`resolved-popup ${popupActive ? 'active' : ''}`}>
              <div className={`popup-content ${popupActive ? 'active' : ''}`}>
                <h3>Resolve Ticket</h3>
                <label>Resolved By:</label>
                <input
                  type="text"
                  value={resolvedByName}
                  onChange={(e) => setResolvedByName(e.target.value)}
                  placeholder="Enter your name"
                />
                <div className="popup-actions">
                  <button onClick={handleResolvedBySubmit} className="submit-btn">Submit</button>
                  <button onClick={() => setShowResolvedPopup(false)} className="cancel-btn">Cancel</button>
                </div>
              </div>
            </div>,
            document.body
          )}
        </section>
      </Slide>
    </>
  );
}

export default TodosTicketsPage;
