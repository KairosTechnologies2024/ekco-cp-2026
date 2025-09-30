import UnlinkedDeviceCard from "../../../components/devices/UnlinkedDeviceCard";
import { useBreadcrumbs } from "../../../store/context/BreadcrumbsContext";
import '../../../styles/components/devices/unlinked-devices.scss';
import { useEffect } from "react";
function UnlikedDevicesPage() {


  const { setBreadcrumbs } = useBreadcrumbs();
    
      useEffect(() => {
        setBreadcrumbs([
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Devices', path: '/dashboard/devices' },
          { label: 'Unlinked', path: '/dashboard/devices/unlinked' }
        ]);
      }, []);



  return (
     <section className="unlinked-devices global-margin">



         <div className="unlinked-devices-container">


<UnlinkedDeviceCard/>
<UnlinkedDeviceCard/>
<UnlinkedDeviceCard/>
<UnlinkedDeviceCard/>
<UnlinkedDeviceCard/>
<UnlinkedDeviceCard/>
<UnlinkedDeviceCard/>
<UnlinkedDeviceCard/>
<UnlinkedDeviceCard/>
<UnlinkedDeviceCard/>
<UnlinkedDeviceCard/>
<UnlinkedDeviceCard/>
<UnlinkedDeviceCard/>
<UnlinkedDeviceCard/>
<UnlinkedDeviceCard/>

         </div>
     </section>
  )
}

export default UnlikedDevicesPage