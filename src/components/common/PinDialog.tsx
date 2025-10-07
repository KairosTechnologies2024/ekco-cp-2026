import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { IoMdClose } from 'react-icons/io';
import '../../styles/components/common/pin-dialog.scss';

interface PinDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  pin?: string; // expected pin, default '0011'
}

function PinDialog({ isOpen, onConfirm, onCancel, pin = '0011' }: PinDialogProps) {
  const [isActive, setIsActive] = useState(false);
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => setIsActive(true));
      setValue('');
      setError('');
    } else {
      setIsActive(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (value === pin) {
      onConfirm();
    } else {
      setError('Incorrect PIN.');
    }
  };

  return createPortal(
    <div
      className={`pin-dialog-overlay ${isActive ? 'active' : ''}`}
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div className={`pin-dialog ${isActive ? 'active' : ''}`}>
        <div className="pin-dialog-header">
          <button className="close-button" onClick={onCancel}>
            <IoMdClose size={24} />
          </button>
        </div>
        <div className="pin-dialog-body">
          <p>Enter PIN to confirm permanent deletion</p>
          <input
            type="password"
            inputMode="numeric"
            maxLength={10}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="pin-input"
            placeholder="Enter PIN"
          />
          {error && <p className="pin-error">{error}</p>}
        </div>
        <div className="pin-dialog-actions">
          <button className="cancel-button" onClick={onCancel}>Cancel</button>
          <button className="confirm-button" onClick={handleSubmit}>Confirm PIN</button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default PinDialog;
