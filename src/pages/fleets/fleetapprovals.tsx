import { useBreadcrumbs } from "../../store/context/BreadcrumbsContext";
import { useEffect, useState, useMemo } from "react";
import { IoIosSearch } from "react-icons/io";
import FleetCustomerCard from "../../components/fleet-customers/FleetCustomerCard";
import '../../styles/components/fleet-approvals/fleetapprovals.scss';

import { Slide } from "react-awesome-reveal";

// Dummy fleet customer data
const DUMMY_FLEET_CUSTOMERS = [
  { idNumber: "FC1234", companyName: "Acme Logistics", approvedStatus: "Pending" },
  { idNumber: "FC5678", companyName: "Beta Transport", approvedStatus: "Approved" },
  { idNumber: "FC9101", companyName: "Cargo Solutions", approvedStatus: "Disapproved" },
  { idNumber: "FC1122", companyName: "Delta Freight", approvedStatus: "Approved" },
  { idNumber: "FC3344", companyName: "Echo Haulage", approvedStatus: "Pending" },
  { idNumber: "FC5566", companyName: "Foxtrot Carriers", approvedStatus: "Disapproved" },
  { idNumber: "FC7788", companyName: "Gamma Movers", approvedStatus: "Approved" },
  { idNumber: "FC9900", companyName: "Helix Transit", approvedStatus: "Pending" },
  { idNumber: "FC1023", companyName: "Indigo Freightlines", approvedStatus: "Approved" },
  { idNumber: "FC2045", companyName: "Jupiter Logistics", approvedStatus: "Disapproved" },
  { idNumber: "FC3067", companyName: "Kappa Express", approvedStatus: "Pending" },
  { idNumber: "FC4089", companyName: "Lambda Shipping", approvedStatus: "Approved" },
  { idNumber: "FC5012", companyName: "Metro Freight", approvedStatus: "Disapproved" },
  { idNumber: "FC6034", companyName: "Nova Transport", approvedStatus: "Pending" },
  { idNumber: "FC7056", companyName: "Omega Carriers", approvedStatus: "Approved" },
  { idNumber: "FC8078", companyName: "Pioneer Haulage", approvedStatus: "Disapproved" },
  { idNumber: "FC9099", companyName: "Quantum Movers", approvedStatus: "Pending" },
  { idNumber: "FC0110", companyName: "Rocket Transit", approvedStatus: "Approved" },
  { idNumber: "FC1221", companyName: "Summit Freight", approvedStatus: "Disapproved" },
  { idNumber: "FC2332", companyName: "Titan Logistics", approvedStatus: "Approved" }
];

function FleetApprovalsPage() {





    const { setBreadcrumbs } = useBreadcrumbs();
    const [search, setSearch] = useState("");
    const [fleetCustomers] = useState(DUMMY_FLEET_CUSTOMERS);

    useEffect(() => {
        setBreadcrumbs([
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Fleet Approvals', path: '/dashboard/fleet-approvals' }
        ]);
    }, [setBreadcrumbs]);

    // Filter customers by companyName or approvedStatus
    const filteredFleetCustomers = useMemo(() => {
        const s = search.trim().toLowerCase();
        if (!s) return fleetCustomers;
        return fleetCustomers.filter(c =>
            c.companyName.toLowerCase().includes(s) ||
            c.approvedStatus.toLowerCase().includes(s)
        );
    }, [search, fleetCustomers]);

    return (
        <section className="fleet-approvals global-margin">
            <Slide direction="right">
            <div className="fleet-approvals-container">
                <div className="fleet-approvals-header">
                    <div className="fleet-approvals-header-1">
                        <div className="fleet-approvals-search-input-wrapper">
                            <input
                                type="text"
                                className="fleet-approvals-search-input"
                                placeholder="Search by company name or approved status"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                            <IoIosSearch className='fleet-approvals-search-icon' size={20} />
                        </div>
                    </div>
                    <div className="fleet-approvals-header-2">
                        <p>COMPANY</p>
                        <p>APPROVED STATUS</p>
                        <p>ACTIONS</p>

                    </div>
                </div>
                <div className="fleet-approvals-list">
                    {filteredFleetCustomers.length === 0 ? (
                        <div className="customers-no-results">
                            No results found for <strong>{search}</strong>
                        </div>
                    ) : (
                        filteredFleetCustomers.map((customer) => (
                            <FleetCustomerCard
                                key={customer.idNumber}
                                idNumber={customer.idNumber}
                                companyName={customer.companyName}
                                approvedStatus={customer.approvedStatus as 'Approved' | 'Disapproved' | 'Pending'}
                            />
                        ))
                    )}
                </div>
            </div>
            </Slide>
        </section>
    )
}

export default FleetApprovalsPage;
   

