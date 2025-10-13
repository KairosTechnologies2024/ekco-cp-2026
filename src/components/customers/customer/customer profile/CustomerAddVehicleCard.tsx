import { useEffect } from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import { useGetTicketsQuery, useGetRisksQuery } from "../../../../utils/api";
import '../../../../styles/components/customers/customer-addvehicle-card.scss';

type CustomerAddVehicleCardProps = {
  userId: string;
};

function CustomerAddVehicleCard({ userId }: CustomerAddVehicleCardProps) {
  const { data: ticketsData, isLoading: ticketsLoading, error: ticketsError } = useGetTicketsQuery();
  const { data: risksData, isLoading: risksLoading, error: risksError } = useGetRisksQuery();

  // Dummy data for demonstration
  const dummyTickets = [
    { id: 1, title: 'App Login Issue', status: 'pending', createdat: '2024-10-01T10:00:00Z', description: 'Customer unable to log in to the mobile app.' },
    { id: 2, title: 'Fuel Cut Not Responding', status: 'resolved', createdat: '2024-09-28T14:30:00Z', description: 'Fuel cut device not responding to commands.' },
    { id: 3, title: 'Location Tracking Error', status: 'pending', createdat: '2024-09-25T09:15:00Z', description: 'Vehicle location not updating in real-time.' },
    { id: 4, title: 'Notification Delay', status: 'resolved', createdat: '2024-09-20T16:45:00Z', description: 'Alerts are delayed by several minutes.' },
    { id: 5, title: 'Device Battery Drain', status: 'pending', createdat: '2024-09-15T11:20:00Z', description: 'Device battery depleting faster than expected.' },
  ];

  const dummyRisks = [
    { id: 1, title: 'Hijacking Risk Alert', status: 'pending', createdat: '2024-10-02T08:00:00Z', description: 'Potential hijacking detected in high-risk area.' },
    { id: 2, title: 'Stolen Vehicle Report', status: 'done', createdat: '2024-09-29T12:00:00Z', description: 'Vehicle reported stolen, tracking initiated.' },
    { id: 3, title: 'Unit Not Updating', status: 'pending', createdat: '2024-09-26T15:30:00Z', description: 'GPS unit has not sent updates for 24 hours.' },
    { id: 4, title: 'False Alarm Triggered', status: 'done', createdat: '2024-09-22T10:45:00Z', description: 'Multiple false alarms from motion sensor.' },
    { id: 5, title: 'Mobile App Connectivity', status: 'pending', createdat: '2024-09-18T13:10:00Z', description: 'App losing connection intermittently.' },
  ];

  // Filter tickets and risks related to the userId and sort by recent, limit to top 10
  const filteredTickets = ticketsData?.tickets
    .filter(ticket => ticket.customer_id === parseInt(userId))
    .sort((a, b) => new Date(b.createdat).getTime() - new Date(a.createdat).getTime())
    .slice(0, 10) || [];

  const filteredRisks = risksData?.risks
    .filter(risk => risk.clientid === userId)
    .sort((a, b) => new Date(b.createdat).getTime() - new Date(a.createdat).getTime())
    .slice(0, 10) || [];

  // Use dummy data if no real data
  const tickets = filteredTickets.length > 0 ? filteredTickets : dummyTickets;
  const risks = filteredRisks.length > 0 ? filteredRisks : dummyRisks;

  // Combine and sort by date, limit to 10
  const combinedItems = [
    ...tickets.map(ticket => ({ ...ticket, type: 'ticket' })),
    ...risks.map(risk => ({ ...risk, type: 'risk' }))
  ].sort((a, b) => new Date(b.createdat).getTime() - new Date(a.createdat).getTime()).slice(0, 10);

  return (
    <div className="customer-add-vehicle-card">
      <div className="customer-add-vehicle-card-container">
        <div className="add-vehicle-card-header">
          <FaExclamationTriangle className='add-vehicle-card-icon' size={30} />
          <h2 className="add-vehicle-card-title">Recent Issues</h2>
        </div>
        <div className="add-vehicle-card-contents">
          {ticketsLoading || risksLoading ? (
            <p>Loading recent issues...</p>
          ) : ticketsError || risksError ? (
            <p>Error loading issues</p>
          ) : (
            <div className="recent-items">
              {combinedItems.length > 0 ? combinedItems.map(item => (
                <div key={`${item.type}-${item.id}`} className={`item-card ${item.type}-card ${item.status}`}>
                  <div className="item-header">
                    <h4>{item.title}</h4>
                    <div className="item-badges">
                      <span className={`item-type ${item.type}`}>{item.type}</span>
                      <span className={`item-status ${item.status}`}>{item.status}</span>
                    </div>
                  </div>
                  <p className="item-date">{new Date(item.createdat).toLocaleDateString()}</p>
                  <p className="item-description">{item.description}</p>
                </div>
              )) : <p>No recent issues found</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CustomerAddVehicleCard;
