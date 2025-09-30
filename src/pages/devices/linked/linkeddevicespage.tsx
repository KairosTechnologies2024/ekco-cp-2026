import { useBreadcrumbs } from "../../../store/context/BreadcrumbsContext";
import { useEffect } from "react";
import '../../../styles/components/devices/linked-devices.scss';
import LinkedDeviceCard from "../../../components/devices/LinkedDeviceCard";

function LinkedDevicesPage() {

const { setBreadcrumbs } = useBreadcrumbs();
    
      useEffect(() => {
        setBreadcrumbs([
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Devices', path: '/dashboard/devices' },
          { label: 'Linked', path: '/dashboard/devices/linked' }
        ]);
      }, []);



  return (
        <section className='linked-devices global-margin'>


 <div className="linked-devices-container">


    <div className="linked-devices-header">



        <p className="linked-devices-header-item">Serial Number</p>
        <p className="linked-devices-header-item">Customer Name</p>
        <p className="linked-devices-header-item">Customer ID Number</p>
        <p className="linked-devices-header-item">Vehicle</p>
      {/*   <p className="linked-devices-header-item">Unlink</p> */}
    </div>


    <div className="linked-devices-list">

<LinkedDeviceCard/>
<LinkedDeviceCard/>
<LinkedDeviceCard/>
<LinkedDeviceCard/>
<LinkedDeviceCard/>
<LinkedDeviceCard/>
<LinkedDeviceCard/>
<LinkedDeviceCard/>
<LinkedDeviceCard/>
<LinkedDeviceCard/>
<LinkedDeviceCard/>
<LinkedDeviceCard/>
<LinkedDeviceCard/>
<LinkedDeviceCard/>
<LinkedDeviceCard/>
<LinkedDeviceCard/>
<LinkedDeviceCard/>
<LinkedDeviceCard/>
<LinkedDeviceCard/>
<LinkedDeviceCard/>
<LinkedDeviceCard/>
<LinkedDeviceCard/>
<LinkedDeviceCard/>
<LinkedDeviceCard/>

    </div>
 </div>

        </section>
  )
}

export default LinkedDevicesPage