import { useEffect, useState } from "react";
import { createPortal } from 'react-dom';
import { useBreadcrumbs } from "../../../store/context/BreadcrumbsContext";
import "../../../styles/components/todos/risks.scss";
import { FaPlus, FaEdit, FaCheck, FaTrash } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import RiskModal from "../../../components/todos/risks/RiskModal";
import { Slide } from "react-awesome-reveal";
import { useGetRisksQuery, useAddRiskMutation, useUpdateRiskMutation, useDeleteRiskMutation } from '../../../utils/api';
import wsService from '../../../utils/websocket';

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
  const { data: risksData, isLoading, error, refetch } = useGetRisksQuery();
  const [addRiskMutation] = useAddRiskMutation();
  const [updateRiskMutation] = useUpdateRiskMutation();
  const [deleteRiskMutation] = useDeleteRiskMutation();

  const risks = risksData?.risks.map(r => ({
    id: r.id.toString(),
    title: r.title,
    clientName: r.clientname,
    clientId: r.clientid,
    carModel: r.carmodel,
    registration: r.registration,
    contactNumber: r.contactnumber,
    riskType: r.risktype,
    description: r.description,
    status: r.status as 'pending' | 'done',
    createdAt: r.createdat,
    updatedAt: r.updatedat,
    loggedBy: r.loggedby,
    resolvedBy: r.resolvedby || undefined,
  })) || [];

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



  useEffect(() => {
    setBreadcrumbs([
      { label: 'Dashboard', path: '/dashboard' },
      { label: 'Todos', path: '/dashboard/todos' },
      { label: 'Risks', path: '/dashboard/todos/risks' }
    ]);
  }, []);

  useEffect(() => {
    const handleRisksUpdate = () => {
      refetch();
    };

    wsService.subscribe('all_risks_update', handleRisksUpdate);

    return () => {
      wsService.unsubscribe('all_risks_update', handleRisksUpdate);
    };
  }, []);

  // Handle "Mark as Done" (show popup for resolved by)
  const handleMarkAsDone = (riskId: string) => {
    setCurrentRiskId(riskId);
    setShowResolvedPopup(true); // Show the "Resolved By" popup
  };

  const handleDelete = (riskId: string) => {
    if (window.confirm('Are you sure you want to delete this risk?')) {
      deleteRiskMutation(parseInt(riskId));
    }
  };

  const handleResolvedBySubmit = () => {
    if (resolvedByName.trim() && currentRiskId) {
      updateRiskMutation({
        id: parseInt(currentRiskId),
        data: ({
          status: 'done',
          resolvedBy: resolvedByName,
          updatedAt: new Date().toISOString(),
        } as any)
      });
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
      const apiData = {
        title: riskData.title,
        clientName: riskData.clientName,
        clientId: riskData.clientId,
        carModel: riskData.carModel,
        registration: riskData.registration,
        contactNumber: riskData.contactNumber,
        riskType: riskData.riskType,
        description: riskData.description,
        status: riskData.status,
        updatedAt: new Date().toISOString(),
      };
      updateRiskMutation({ id: parseInt(editingRisk.id), data: apiData as any });
    } else {
      // Add new risk
      const apiData = {
        title: riskData.title,
        clientName: riskData.clientName,
        clientId: riskData.clientId,
        carModel: riskData.carModel,
        registration: riskData.registration,
        contactNumber: riskData.contactNumber,
        riskType: riskData.riskType,
        description: riskData.description,
        status: riskData.status,
        loggedBy: loggedInUser,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      addRiskMutation(apiData as any);
    }
    setIsModalOpen(false);
    setEditingRisk(null);
  };


  const handleEdit = (risk: RiskItem) => {
    setEditingRisk(risk);
    setIsModalOpen(true);
  };
  return (
  
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
        {isLoading && <div>Loading risks...</div>}
        {error && <div>Error loading risks</div>}
        <div className="risks-list">
          {filteredRisks.map((risk) => (
            <div key={risk.id} className={`risk-card ${risk.status}`}>
              <div className="risk-header">
                <h3>{risk.title}  #{risk.id}</h3>
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

      {/* Resolved By Popup (matches tickets modal markup/classes) */}
      {showResolvedPopup && createPortal(
        <div className={`resolved-popup ${popupActive ? 'active' : ''}`}>
          <div className={`popup-content ${popupActive ? 'active' : ''}`}>
            <h3>Resolve Risk</h3>
            <label>Resolved By:</label>
            <input
              type="text"
              value={resolvedByName}
              onChange={(e) => setResolvedByName(e.target.value)}
              placeholder="Enter the name of the person resolving the risk"
            />

            <div className="popup-actions">
              <button onClick={handleResolvedBySubmit} className="submit-btn">Submit</button>
              <button onClick={() => setShowResolvedPopup(false)} className="cancel-btn">Cancel</button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {isModalOpen && (
        <RiskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          risk={editingRisk}
          riskTypes={riskTypes}
          onSubmit={handleSubmit}
        />
      )}
    </div>
 
  );
}

export default TodosRiskPage;
