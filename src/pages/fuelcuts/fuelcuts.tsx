import { useEffect } from "react";
import { useBreadcrumbs } from "../../store/context/BreadcrumbsContext";
import DashboardMenuItems from "../../components/dashboard menu items/DashboardMenuItems";

function FuelCutsPage() {

  const { setBreadcrumbs } = useBreadcrumbs();


   useEffect(() => {
          setBreadcrumbs([
            { label: 'Dashboard', path: '/dashboard' },
            { label: 'Fuel Cuts', path: '/dashboard/fuel-cuts' }
          ]);
      }, [setBreadcrumbs]);
  return (
    <section className="fuel-cuts global-margin">



 <DashboardMenuItems/>




      <div className="fuel-cuts-container">




      </div>

   {/*            <div className="fuel-cuts-container">
                <div className="fuel-cuts-header">
                  <div className="fuel-cuts-header-column-1">
                   <input type="text" className="fuel-cuts-search-input" placeholder="Search by vehicle" />
                  </div>


                   <div className="fuel-cuts-lits">
                           
                       
                   </div>
                </div>
</div> */}
    </section>
  )
}

export default FuelCutsPage