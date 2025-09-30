import { useNavigate } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';
import '../../styles/components/404/not-found.scss';

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="not-found">
      <div className="not-found-content">
        <FaExclamationTriangle size={60} className="not-found-icon" />
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you are looking for doesn't exist or has been moved.</p>
        <button 
          className="back-button"
          onClick={() => navigate('/dashboard/alerts')}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default NotFound;