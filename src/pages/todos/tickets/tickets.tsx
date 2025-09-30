import { useEffect, useState } from "react";
import { useBreadcrumbs } from "../../../store/context/BreadcrumbsContext";
import "../../../styles/components/todos/tickets.scss";
import { FaCheck, FaTrash, FaClock, FaUser } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import { format } from 'date-fns';
import { Slide } from "react-awesome-reveal";


interface Ticket {
  id: string;
  title: string;
  type: string;
  description: string;
  status: 'pending' | 'resolved';
  createdAt: string;
  updatedAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  loggedBy: string; // Customer who created the ticket
  resolvedBy?: string; // Support staff who resolved it
  resolvedAt?: string;
}

function TodosTicketsPage() {
  const [popupActive, setPopupActive] = useState(false);



  
  const ticketTypes = [
    'App Login Issues',
    'Vehicle Not Tracking',
    'Payment Query',
    'Feature Request',
    'Technical Support',
    'Account Management',
    'Other'
  ];

const initialTickets: Ticket[] = [
  {
    id: '1',
    title: 'App Login Failed',
    type: 'App Login Issues',
    description: 'Unable to login to mobile app. Says incorrect password but Im sure its correct.',
    status: 'pending',
    createdAt: '2023-09-05T10:30:00Z',
    updatedAt: '2023-09-05T10:30:00Z',
    customerName: 'John Smith',
    customerEmail: 'john.smith@email.com',
    customerPhone: '0823456789',
    loggedBy: 'John Smith Mobile App'
  },
  {
    id: '2',
    title: 'Vehicle not updating location',
    type: 'Vehicle Not Tracking',
    description: 'My truck has been stationary on the map for over 2 hours.',
    status: 'resolved',
    createdAt: '2023-09-06T08:15:00Z',
    updatedAt: '2023-09-06T08:15:00Z',
    customerName: 'Alice Johnson',
    customerEmail: 'alice.j@email.com',
    customerPhone: '0721234567',
    loggedBy: 'Fleet Admin Portal'
  },
  {
    id: '3',
    title: 'Double charged for subscription',
    type: 'Payment Query',
    description: 'I was charged twice this month. Please refund.',
    status: 'pending',
    createdAt: '2023-09-06T09:00:00Z',
    updatedAt: '2023-09-06T09:15:00Z',
    customerName: 'Lerato Mokoena',
    customerEmail: 'lerato.m@email.com',
    customerPhone: '0749876543',
    loggedBy: 'Customer Portal'
  },
  {
    id: '4',
    title: 'Add dark mode feature',
    type: 'Feature Request',
    description: 'A dark mode option would be great for night driving.',
    status: 'resolved',
    createdAt: '2023-09-07T11:20:00Z',
    updatedAt: '2023-09-08T14:45:00Z',
    customerName: 'Brian Khoza',
    customerEmail: 'brian.k@email.com',
    customerPhone: '0831237890',
    loggedBy: 'Mobile App Feedback'
  },
  {
    id: '5',
    title: 'App crashes on startup',
    type: 'Technical Support',
    description: 'The app crashes immediately when I open it on Android 12.',
    status: 'resolved',
    createdAt: '2023-09-08T07:45:00Z',
    updatedAt: '2023-09-08T07:45:00Z',
    customerName: 'Nomvula Dlamini',
    customerEmail: 'nomvula.d@email.com',
    customerPhone: '0612345678',
    loggedBy: 'Android App'
  },
  {
    id: '6',
    title: 'Change account email',
    type: 'Account Management',
    description: 'I want to update the email linked to my account.',
    status: 'resolved',
    createdAt: '2023-09-08T10:10:00Z',
    updatedAt: '2023-09-09T08:00:00Z',
    customerName: 'George Nkosi',
    customerEmail: 'george.nkosi@email.com',
    customerPhone: '0786543210',
    loggedBy: 'Web Portal'
  },
  {
    id: '7',
    title: 'Fleet vehicle not showing',
    type: 'Vehicle Not Tracking',
    description: 'One of our delivery vehicles is missing from the dashboard.',
    status: 'pending',
    createdAt: '2023-09-09T06:30:00Z',
    updatedAt: '2023-09-09T06:35:00Z',
    customerName: 'Tumi Maseko',
    customerEmail: 'tumi.m@email.com',
    customerPhone: '0733211234',
    loggedBy: 'Fleet Dashboard'
  },
  {
    id: '8',
    title: 'Card declined but funds available',
    type: 'Payment Query',
    description: 'Tried paying for subscription but card was declined.',
    status: 'resolved',
    createdAt: '2023-09-09T12:00:00Z',
    updatedAt: '2023-09-09T12:00:00Z',
    customerName: 'Kabelo Modise',
    customerEmail: 'kabelo.m@email.com',
    customerPhone: '0764321098',
    loggedBy: 'Mobile App'
  },
  {
    id: '9',
    title: 'Allow multiple user logins',
    type: 'Feature Request',
    description: 'We need multiple user support under one account.',
    status: 'resolved',
    createdAt: '2023-09-10T09:40:00Z',
    updatedAt: '2023-09-10T10:00:00Z',
    customerName: 'Susan Jacobs',
    customerEmail: 'susan.j@email.com',
    customerPhone: '0822345678',
    loggedBy: 'Customer Feedback Form'
  },
  {
    id: '10',
    title: 'Password reset not working',
    type: 'App Login Issues',
    description: 'I don’t receive the reset link via email.',
    status: 'resolved',
    createdAt: '2023-09-10T13:25:00Z',
    updatedAt: '2023-09-10T13:25:00Z',
    customerName: 'Ebrahim Patel',
    customerEmail: 'ebrahim.p@email.com',
    customerPhone: '0847654321',
    loggedBy: 'Support Chat'
  },
  {
    id: '11',
    title: 'Incorrect vehicle speed data',
    type: 'Technical Support',
    description: 'Speed data seems inaccurate and inconsistent.',
    status: 'resolved',
    createdAt: '2023-09-11T08:00:00Z',
    updatedAt: '2023-09-11T09:15:00Z',
    customerName: 'Nandi Radebe',
    customerEmail: 'nandi.r@email.com',
    customerPhone: '0621112233',
    loggedBy: 'Web App'
  },
  {
    id: '12',
    title: 'Add biometric login support',
    type: 'Feature Request',
    description: 'Face ID or fingerprint would improve security.',
    status: 'pending',
    createdAt: '2023-09-11T10:10:00Z',
    updatedAt: '2023-09-11T10:10:00Z',
    customerName: 'Chris Daniels',
    customerEmail: 'chris.d@email.com',
    customerPhone: '0719876543',
    loggedBy: 'Mobile App Feedback'
  },
  {
    id: '13',
    title: 'My account is locked',
    type: 'App Login Issues',
    description: 'Too many failed login attempts have locked my account.',
    status: 'resolved',
    createdAt: '2023-09-12T07:30:00Z',
    updatedAt: '2023-09-12T09:00:00Z',
    customerName: 'Fikile Mhlongo',
    customerEmail: 'fikile.m@email.com',
    customerPhone: '0798765432',
    loggedBy: 'Customer Portal'
  },
  {
    id: '14',
    title: 'Need help updating billing info',
    type: 'Account Management',
    description: 'Can’t find the option to update credit card on file.',
    status: 'pending',
    createdAt: '2023-09-12T12:45:00Z',
    updatedAt: '2023-09-12T12:45:00Z',
    customerName: 'Paul White',
    customerEmail: 'paul.w@email.com',
    customerPhone: '0601234567',
    loggedBy: 'Billing Support'
  },
  {
    id: '15',
    title: 'App is slow to respond',
    type: 'Other',
    description: 'The app freezes for a few seconds before loading data.',
    status: 'pending',
    createdAt: '2023-09-13T11:15:00Z',
    updatedAt: '2023-09-13T11:15:00Z',
    customerName: 'Zanele Khumalo',
    customerEmail: 'zanele.k@email.com',
    customerPhone: '0656789123',
    loggedBy: 'Android App'
  }
];



  const { setBreadcrumbs } = useBreadcrumbs();
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'resolved'>('all');
  const [showResolvedPopup, setShowResolvedPopup] = useState(false);
  const [resolvedByName, setResolvedByName] = useState('');
  const [currentTicketId, setCurrentTicketId] = useState<string | null>(null);




  // Dummy initial tickets
  

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Dashboard', path: '/dashboard' },
      { label: 'Todos', path: '/dashboard/todos' },
      { label: 'Tickets', path: '/dashboard/tickets' }
    ]);
  }, [setBreadcrumbs]);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
  };

  const handleMarkAsResolved = (ticketId: string) => {
    setCurrentTicketId(ticketId);
    setShowResolvedPopup(true);
  };

  const handleResolvedBySubmit = () => {
    if (resolvedByName.trim()) {
      const now = new Date().toISOString();
      setTickets(prev =>
        prev.map(ticket =>
          ticket.id === currentTicketId
            ? {
                ...ticket,
                status: 'resolved',
                resolvedBy: resolvedByName,
                resolvedAt: now,
                updatedAt: now
              }
            : ticket
        )
      );
      setShowResolvedPopup(false);
      setResolvedByName('');
    } else {
      alert('Please enter your name');
    }
  };

  const handleDelete = (ticketId: string) => {
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      setTickets(prev => prev.filter(ticket => ticket.id !== ticketId));
    }
  };

  const filteredTickets = tickets
    .filter(ticket => (
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.type.toLowerCase().includes(searchTerm.toLowerCase())
    ))
    .filter(ticket => filterStatus === 'all' ? true : ticket.status === filterStatus);




//console.log("showResolvedPopup", showResolvedPopup, "popupActive", popupActive);

useEffect(() => {
  if (showResolvedPopup) {
    // Allowing the DOM to mount first before adding the class
    setTimeout(() => {
      setPopupActive(true);
    }, 10); // short delay ensures transition works
  } else {
    setPopupActive(false);
  }
}, [showResolvedPopup]);

  return (
    <>
    <Slide direction="right" triggerOnce style={{zIndex:-99999}}>
   
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
                <h3>{ticket.title} #654</h3>
                <span className={`ticket-status ${ticket.status}`}>
                  {ticket.status}
                </span>
              </div>
              <div className="ticket-meta">
                <span className="ticket-time">
                  <FaClock /> {formatDate(ticket.createdAt)}
                </span>
                <span className="ticket-customer">
                  <FaUser /> {ticket.customerName}
                </span>
              </div>
            </div>

            <div className="ticket-details">
              <p className="ticket-type"><strong>Type:</strong> {ticket.type}</p>
              <p className="ticket-description">{ticket.description}</p>
              <div className="ticket-contact">
                <p><strong>Email:</strong> {ticket.customerEmail}</p>
                <p><strong>Phone:</strong> {ticket.customerPhone}</p>
              </div>
            </div>

            <div className="ticket-footer">
              <div className="ticket-info">
                <p><strong>Logged by:</strong> {ticket.loggedBy}</p>
                {ticket.resolvedBy && (
                  <p><strong>Resolved by:</strong> {ticket.resolvedBy} at {formatDate(ticket.resolvedAt!)}</p>
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

     
    </section>
    </Slide>
 {/* Resolved By Popup */}
      {showResolvedPopup && (
        <div className="resolved-popup">
          <div className={`popup-content${popupActive ? ' active' : ''}`}>
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
        </div>
      )}
    </>
  );
}

export default TodosTicketsPage;