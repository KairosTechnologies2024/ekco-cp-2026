
import { useEffect } from "react";
import { useBreadcrumbs } from "../../store/context/BreadcrumbsContext";
import DashboardMenuItems from "../../components/dashboard menu items/DashboardMenuItems";
function DevicesPage() {


 const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Dashboard', path: '/dashboard' },
      { label: 'Devices', path: '/dashboard/devices' }
    ]);
  }, [setBreadcrumbs]);

  return (
  <>
  
  
<section className="devices global-margin">






    <DashboardMenuItems/>


</section>

  </>
  )
}

export default DevicesPage