import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { IoMdClose } from 'react-icons/io';
import '../../../styles/components/todos/risk-modal.scss';

interface RiskModalProps {
  isOpen: boolean;
  onClose: () => void;
  risk: RiskItem | null;
  riskTypes: string[];
  onSubmit: (riskData: Omit<RiskItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

function RiskModal({ isOpen, onClose, risk, riskTypes, onSubmit }: RiskModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    clientName: '',
    clientId: '',
    carModel: '',
    registration: '',
    contactNumber: '',
    riskType: '',
    description: '',
    status: 'pending' as const
  });

  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => setIsActive(true));
      if (risk) {
        setFormData({
          title: risk.title,
          clientName: risk.clientName,
          clientId: risk.clientId,
          carModel: risk.carModel,
          registration: risk.registration,
          contactNumber: risk.contactNumber,
          riskType: risk.riskType,
          description: risk.description,
          status: risk.status
        });
      }
    } else {
      setIsActive(false);
    }
  }, [isOpen, risk]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  return createPortal(
    <div 
      className={`risk-modal-overlay ${isActive ? 'active' : ''}`}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={`risk-modal ${isActive ? 'active' : ''}`}>
        <div className="risk-modal-header">
          <h2>{risk ? 'Edit Risk' : 'Add New Risk'}</h2>
          <button className="close-button" onClick={onClose}>
            <IoMdClose size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="risk-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="clientName">Client Name</label>
              <input
                type="text"
                id="clientName"
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="clientId">Client ID</label>
              <input
                type="text"
                id="clientId"
                name="clientId"
                value={formData.clientId}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="carModel">Vehicle Model</label>
              <input
                type="text"
                id="carModel"
                name="carModel"
                value={formData.carModel}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="registration">Registration</label>
              <input
                type="text"
                id="registration"
                name="registration"
                value={formData.registration}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="contactNumber">Contact Number</label>
              <input
                type="tel"
                id="contactNumber"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="riskType">Risk Type</label>
              <select
                id="riskType"
                name="riskType"
                value={formData.riskType}
                onChange={handleChange}
                required
              >
                <option value="">Select Risk Type</option>
                {riskTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
            />
          </div>

          <button type="submit" className="submit-button">
            {risk ? 'Update Risk' : 'Add Risk'}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
}

export default RiskModal;