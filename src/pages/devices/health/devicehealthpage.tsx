
import DeviceHealthCard from '../../../components/devices/DeviceHealthCard'

import { useEffect } from 'react';
import { useBreadcrumbs } from '../../../store/context/BreadcrumbsContext';
import '../../../styles/components/devices/devices-health.scss';
import { IoIosSearch } from 'react-icons/io';
import { Fade } from 'react-awesome-reveal';

function DeviceHealthPage() {



      const { setBreadcrumbs } = useBreadcrumbs();
    
      useEffect(() => {
        setBreadcrumbs([
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Devices', path: '/dashboard/devices' },
          { label: 'Health', path: '/dashboard/devices/health' }
        ]);
      }, []);


  return (
    <Fade> 
    <section className='devices-health-page global-margin'>


        <div className='device-health-container'>


    <div className="device-health-header">
  <div className="device-health-header-1">



  <div className="devices-search-input-wrapper">
         <input
           type="text"
           className="devices-search-input"
            placeholder="Search by serial number"
                                     
         />
         <IoIosSearch className='devices-search-icon' size={20}/>
       </div>

 <select name="filter-device-health" id="filter-device-health" className='filter-device-health'>
  <option value="all">All</option>
         <option value="connected">Connected</option>
         <option value="disconnected">Disconnected</option>
         <option value="offline">Healthy</option>
         <option value="online">Unhealthy</option>
      

       </select>
      
  </div>

  <div className="device-health-header-2">


    <p>status</p>
    <p>serial number</p>
    <p>battery</p>
    <p>battery voltage</p>
    <p>firmware</p>
    <p>revision</p>
    <p>customer</p>
    <p>id number</p>
    <p>vehicle</p>
    <p>registration</p>
    <p>last ping</p>
  </div>
</div>




<div className="device-health-list">

<DeviceHealthCard/>
<DeviceHealthCard/>
<DeviceHealthCard/>
<DeviceHealthCard/>
<DeviceHealthCard/>
<DeviceHealthCard/>
<DeviceHealthCard/>
<DeviceHealthCard/>
<DeviceHealthCard/>
<DeviceHealthCard/>
<DeviceHealthCard/>
<DeviceHealthCard/>

</div>
            </div>
    </section>
    </Fade>
  )
}

export default DeviceHealthPage