import { FaBell } from "react-icons/fa";
import { useBreadcrumbs } from '../../../../store/context/BreadcrumbsContext';
import '../../../../styles/components/customers/customer-top-100-alert-card.scss';


function CustomerVehicleTop100Alerts({ alert }) {
  const { breadcrumbs } = useBreadcrumbs();
  const vehicleName = breadcrumbs.length > 0 ? breadcrumbs[breadcrumbs.length - 1].label : 'n/a';

  console.log('Alert Data:', alert);
  return (
    <div className="customer-top-100-vehicle-alerts-card">
      
        <div  className="top-100-alert-card">
          <div className="top-100-alert-card-icon">
            <FaBell />
          </div>
          <div className="top-100-alert-card-details">
            <h3 className="top-100-alert-title">{alert?.alert}</h3>
            <p className="top-100-alert-vehicle">{vehicleName}</p>
            <p className="top-100-alert-time">{(() => {
              const date = new Date(Number(alert?.time) * 1000);
              const day = date.getDate();
              const ordinal = day % 10 === 1 && day !== 11 ? 'st' : day % 10 === 2 && day !== 12 ? 'nd' : day % 10 === 3 && day !== 13 ? 'rd' : 'th';
              const formattedDate = date.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              }).replace(/\d+/, day + ordinal);
              const formattedTime = date.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              });
              return `${formattedDate}, ${formattedTime}`;
            })()}</p>
          </div>
        </div>
  
    </div>
  );
}

export default CustomerVehicleTop100Alerts;
