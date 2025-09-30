import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { IoMdClose } from 'react-icons/io';
import '../../styles/components/common/confirmation-dialog.scss';

interface ConfirmationDialogProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmationDialog({ isOpen, message, onConfirm, onCancel }: ConfirmationDialogProps) {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => setIsActive(true));
    } else {
      setIsActive(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className={`confirmation-dialog-overlay ${isActive ? 'active' : ''}`}
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div className={`confirmation-dialog ${isActive ? 'active' : ''}`}>
        <div className="confirmation-dialog-header">
          <button className="close-button" onClick={onCancel}>
            <IoMdClose size={24} />
          </button>
        </div>
        <div className="confirmation-dialog-message">
          <p>{message}</p>
        </div>
        <div className="confirmation-dialog-actions">
          <button className="cancel-button" onClick={onCancel}>Cancel</button>
          <button className="confirm-button" onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default ConfirmationDialog;
