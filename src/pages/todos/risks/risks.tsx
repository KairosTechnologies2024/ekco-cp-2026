import { useEffect, useState } from "react";
import { useBreadcrumbs } from "../../../store/context/BreadcrumbsContext";
import "../../../styles/components/todos/risks.scss";
import { FaPlus, FaEdit, FaCheck, FaTrash } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import RiskModal from "../../../components/todos/risks/RiskModal";
import { Slide } from "react-awesome-reveal";

interface RiskItem {
  id: string;
  title: string;
  clientName: string;
  clientId: string;
  carModel: string;
  registration: string;
  contactNumber: string;
  riskType: string;
  description: string;
  status: 'pending' | 'done';
  createdAt: string;
  updatedAt: string;
  loggedBy: string; // Logged by field
  resolvedBy?: string; // Resolved by field
}

function TodosRiskPage() {
  const [popupActive, setPopupActive] = useState(false);

const riskTypes = [
    'Hijacking Risk',
    'Stolen Vehicle',
    'Unit Not Updating',
    'False Alerts',
    'Mobile App Query',
    'Fuel Cut Not Responding',
    'Other'
  ];

  const { setBreadcrumbs } = useBreadcrumbs();
  
  // Dummy logged in user
  const loggedInUser = 'Wasim Shabally';

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRisk, setEditingRisk] = useState<RiskItem | null>(null);
  const [resolvedByName, setResolvedByName] = useState('');
  const [showResolvedPopup, setShowResolvedPopup] = useState(false);
  const [currentRiskId, setCurrentRiskId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (showResolvedPopup) {
      const timer = setTimeout(() => setPopupActive(true), 10);
      return () => clearTimeout(timer);
    } else {
      setPopupActive(false);
    }
  }, [showResolvedPopup]);

  const initialRisks: RiskItem[] = [
    {
      id: '1',
      title: 'Possible Vehicle Theft',
      clientName: 'John Smith',
      clientId: '880301584208',
      carModel: '2022 Toyota Fortuner',
      registration: 'FH54YPGP',
      contactNumber: '0823456789',
      riskType: 'Hijacking Risk',
      description: 'Customer reported suspicious activity around vehicle. Multiple attempts to jam remote.',
      status: 'pending',
      createdAt: '2023-09-04T08:00:00Z',
      updatedAt: '2023-09-04T08:00:00Z',
      loggedBy: loggedInUser, // Logged by the current user
    },
    {
      id: '2',
      title: 'Unit Not Responding',
      clientName: 'Sarah Johnson',
      clientId: '920715362514',
      carModel: '2021 VW Golf GTI',
      registration: 'DRT546GP',
      contactNumber: '0761234567',
      riskType: 'Unit Not Updating',
      description: 'GPS unit not updating location for past 6 hours. No response from ping attempts.',
      status: 'pending',
      createdAt: '2023-09-03T15:30:00Z',
      updatedAt: '2023-09-03T15:30:00Z',
      loggedBy: loggedInUser,
    },
    {
      id: '3',
      title: 'Resolved: Fuel Cut Issue',
      clientName: 'Michael Brown',
      clientId: '850812459632',
      carModel: '2020 Ford Ranger',
      registration: 'CT789WC',
      contactNumber: '0832145698',
      riskType: 'Fuel Cut Not Responding',
      description: 'Fuel cut command was not executing. Issue resolved after unit reset.',
      status: 'done',
      createdAt: '2023-09-02T10:15:00Z',
      updatedAt: '2023-09-02T14:20:00Z',
      loggedBy: loggedInUser,
      resolvedBy: 'Alice Smith', // Resolved by Alice
    },
    // Add more dummy data as needed
  ];

  const [risks, setRisks] = useState<RiskItem[]>(initialRisks);

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Dashboard', path: '/dashboard' },
      { label: 'Todos', path: '/dashboard/todos' },
      { label: 'Risks', path: '/dashboard/todos/risks' }
    ]);
  }, []);

  // Handle "Mark as Done" (show popup for resolved by)
  const handleMarkAsDone = (riskId: string) => {
    setCurrentRiskId(riskId);
    setShowResolvedPopup(true); // Show the "Resolved By" popup
  };

  const handleDelete = (riskId: string) => {
    if (window.confirm('Are you sure you want to delete this risk?')) {
      setRisks(prev => prev.filter(risk => risk.id !== riskId));
    }
  };

  const handleResolvedBySubmit = () => {
    if (resolvedByName.trim()) {
      setRisks(prev =>
        prev.map(risk =>
          risk.id === currentRiskId
            ? { ...risk, status: 'done', resolvedBy: resolvedByName, updatedAt: new Date().toISOString() }
            : risk
        )
      );
      setShowResolvedPopup(false); // Close the modal
      setResolvedByName(''); // Clear input
    } else {
      alert('Please enter a name');
    }
  };

  const filteredRisks = risks.filter(risk => 
    risk.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    risk.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    risk.clientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    risk.registration.toLowerCase().includes(searchTerm.toLowerCase())
  );


  // Add handleSubmit function to handle both adding and editing risks
  const handleSubmit = (riskData: Omit<RiskItem, 'id' | 'createdAt' | 'updatedAt' | 'loggedBy'>) => {
    if (editingRisk) {
      // Update existing risk
      setRisks(prev => prev.map(risk => 
        risk.id === editingRisk.id 
          ? { 
              ...risk,
              ...riskData,
              updatedAt: new Date().toISOString()
            }
          : risk
      ));
    } else {
      // Add new risk
      const newRisk: RiskItem = {
        ...riskData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        loggedBy: loggedInUser,
        status: 'pending'
      };
      setRisks(prev => [...prev, newRisk]);
    }
    setIsModalOpen(false);
    setEditingRisk(null);
  };


  const handleEdit = (risk: RiskItem) => {
    setEditingRisk(risk);
    setIsModalOpen(true);
  };
  return (
    <Slide direction="right">
    <div className="risks-page global-margin">
      <div className="risks-header">
        <div className="search-wrapper">
          <IoIosSearch className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search risks by title, client name, ID or registration..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="add-risk-btn" onClick={() => setIsModalOpen(true)}>
          <FaPlus /> Add New Risk
        </button>
      </div>

      <div className="risks-container">
        <div className="risks-list">
          {filteredRisks.map((risk) => (
            <div key={risk.id} className={`risk-card ${risk.status}`}>
              <div className="risk-header">
                <h3>{risk.title}</h3>
                <span className={`risk-status ${risk.status}`}>
                  {risk.status}
                </span>
              </div>

              <div className="risk-details">
                <div className="risk-info">
                  <p><strong>Client:</strong> {risk.clientName}</p>
                  <p><strong>ID:</strong> {risk.clientId}</p>
                  <p><strong>Vehicle:</strong> {risk.carModel}</p>
                  <p><strong>Registration:</strong> {risk.registration}</p>
                  <p><strong>Contact:</strong> {risk.contactNumber}</p>
                  <p><strong>Risk Type:</strong> {risk.riskType}</p>
                </div>
                <p className="risk-description">{risk.description}</p>
              </div>

              <div className="risk-actions">
                <button 
        className="edit-btn"
        onClick={() => handleEdit(risk)}
      >
        <FaEdit /> Edit
      </button>
                <button 
                  className="complete-btn"
                  onClick={() => handleMarkAsDone(risk.id)}
                >
                  <FaCheck /> Mark as Done
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(risk.id)}
                >
                  <FaTrash /> Delete
                </button>
              </div>

              <div className="risk-footer">
                <p><strong>Logged By:</strong> {risk.loggedBy}</p>
                {risk.resolvedBy && <p><strong>Resolved By:</strong> {risk.resolvedBy}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Resolved By Popup */}
      {showResolvedPopup && (
        <div className="resolved-popup">
          <div className={`popup-content${popupActive ? ' active' : ''}`}>
            <h3>Resolve Risk</h3>
            <label>Resolved By:</label>
            <input
              type="text"
              value={resolvedByName}
              onChange={(e) => setResolvedByName(e.target.value)}
              placeholder="Enter the name of the person resolving the risk"
            />

            <div className="resolved-button-group">
              <button onClick={handleResolvedBySubmit} className="submit-btn">Submit</button>
              <button onClick={() => setShowResolvedPopup(false)} className="cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <RiskModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          risk={editingRisk}
          riskTypes={riskTypes}
          onSubmit={() => {}}
        />
      )}
    </div>
    </Slide>
  );
}

export default TodosRiskPage;
