import '../../styles/components/fleet-approvals/fleetapproval-card.scss';
import { useState } from 'react';

type FleetCustomerCardProps = {
  idNumber: string;
  companyName: string;
  approvedStatus: 'Approved' | 'Disapproved' | 'Pending';
};

function FleetCustomerCard({ idNumber, companyName, approvedStatus }: FleetCustomerCardProps) {
  const [status, setStatus] = useState<'Approved' | 'Disapproved' | 'Pending'>(approvedStatus);

  const handleApprove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setStatus('Approved');
  };

  const handleDisapprove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setStatus('Disapproved');
  };

  return (
    <section className='fleet-customer-card'>
      <div className='fleet-customer-card-container'>
     
        <p className='customer-card-id-name'>{companyName}</p>
        <p className='customer-card-status'>
          <span className={`status ${status.toLowerCase()}`}>{status}</span>
        </p>
    



         <div className="fleet-approval-actions">
 <button className='approve-button' onClick={handleApprove} disabled={status === 'Approved'}>
            Approve
          </button>
    
          <button className='approve-button' onClick={handleDisapprove} disabled={status === 'Disapproved'}>
            Disapprove
          </button>
         </div>
         
        
   
      </div>
    </section>
  );
}

export default FleetCustomerCard;
