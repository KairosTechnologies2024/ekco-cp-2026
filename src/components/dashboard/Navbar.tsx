import '../../styles/components/navbar/navbar.scss';
import { useNavigate } from 'react-router-dom';
import { FaChevronRight } from 'react-icons/fa';
import { useBreadcrumbs } from '../../store/context/BreadcrumbsContext';

function Navbar() {
  const navigate = useNavigate();
  const { breadcrumbs } = useBreadcrumbs();

  return (
    <nav className="navbar">
      <div className="navbar-breadcrumb">
        {breadcrumbs.map((crumb, index) => (
          <span key={crumb.path} className="breadcrumb-item">
            <span
              className={`breadcrumb-label ${index !== breadcrumbs.length - 1 ? 'clickable' : ''}`}
              onClick={() => index !== breadcrumbs.length - 1 && navigate(crumb.path)}
            >
              {crumb.label}
            </span>
            {index < breadcrumbs.length - 1 && (
              <FaChevronRight className="breadcrumb-separator" />
            )}
          </span>
        ))}
      </div>
    </nav>
  );
}

export default Navbar;
