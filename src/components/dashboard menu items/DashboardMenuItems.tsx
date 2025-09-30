import { BsFuelPumpFill } from "react-icons/bs";
import { IoIosCut } from "react-icons/io";
import '../../styles/components/dashboard/dashboard-menu-items.scss';

import { LuShieldAlert } from "react-icons/lu";

import { IoShieldCheckmarkOutline } from "react-icons/io5";
import { useLocation } from "react-router-dom";

import { useNavigate } from "react-router-dom";
import { FiCpu } from "react-icons/fi";
import { FaLinkSlash } from "react-icons/fa6";
import { IoGitNetworkOutline } from "react-icons/io5";
import { MdSupportAgent } from "react-icons/md";
import { TiWarningOutline } from "react-icons/ti";

import { Fade } from "react-awesome-reveal";
function DashboardMenuItems() {
   

  const pathname=  useLocation().pathname;
const riskCount = 5;     
const ticketCount = 12;

    const router= useNavigate();
  return (

    <div className="dashboard-menu">
      <div className="dashboard-actions">
      
      
      

   
      
        {pathname === '/dashboard/fuel-cuts' && (
          <>
            <div
              className="dashboard-menu-card"
              onClick={() => router('/dashboard/fuel-cuts/mobilize')}
            >
              <IoShieldCheckmarkOutline size={35} />
              <h3>Deactivate</h3>
              <p>view a list of vehicles where fuel cut has already been applied, and revoke it if no longer needed</p>
            </div>
            <div
              className="dashboard-menu-card"
              onClick={() => router('/dashboard/fuel-cuts/immobilize')}
            >
              <LuShieldAlert size={35} />
              <h3>Activate</h3>
              <p>view a list of vehicles where fuel cut HAS NOT been applied, and apply it if needed</p>
            </div>
          </>
        )}


          {pathname === '/dashboard/devices' && (
          <>
            <div
              className="dashboard-menu-card"
              onClick={() => router('/dashboard/devices/health')}
            >
              <FiCpu size={35} />
              <h3>Device Health</h3>
              <p>displays a detailed list of tracking devices, and provides real-time updates on their status</p>
            </div>
            <div
              className="dashboard-menu-card"
              onClick={() => router('/dashboard/devices/unlinked')}
            >
              <FaLinkSlash size={35} />
              <h3>Unlinked Devices</h3>
              <p>view a list of tracking devices that are not yet or have not been linked to a vehicle</p>
            </div>
            <div
              className="dashboard-menu-card"
              onClick={() => router('/dashboard/devices/linked')}
            >
              <IoGitNetworkOutline size={35} />
              <h3>Linked Devices</h3>
              <p>displays a list of tracking devices that have been linked to a vehicle</p>
            </div>
          </>
        )}



{pathname === '/dashboard/todos' && (
  <>
    <div className="dashboard-menu-card" onClick={() => router('/dashboard/todos/risks')}>
  <div className="icon-badge-wrapper">
    <TiWarningOutline size={35} />
    {riskCount > 0 && <span className="count-badge">{riskCount}</span>}
  </div>
  <h3>Risks</h3>
  <p>View urgent issues logged by you or other controllers</p>
</div>

<div className="dashboard-menu-card" onClick={() => router('/dashboard/todos/tickets')}>
  <div className="icon-badge-wrapper">
    <MdSupportAgent size={35} />
    {ticketCount > 0 && <span className="count-badge">{ticketCount}</span>}
  </div>
  <h3>Tickets</h3>
  <p>View and attend to tickets logged by clients</p>
</div>
  </>
)}






      </div>
    </div>
    

  );
}

export default DashboardMenuItems;