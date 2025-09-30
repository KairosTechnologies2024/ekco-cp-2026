import { useBreadcrumbs } from "../../../store/context/BreadcrumbsContext";
import { useEffect } from "react";
import FuelCut from "../../../components/fuel-cuts/FuelCutCard";
import '../../../styles/components/fuel-cuts/fuel-cuts.scss';
import { IoIosSearch } from "react-icons/io";
function ImmobilizePage() {


      const { setBreadcrumbs } = useBreadcrumbs();
    
      useEffect(() => {
        setBreadcrumbs([
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Fuel Cuts', path: '/dashboard/fuel-cuts' },
          { label: 'Immobilize', path: '/dashboard/fuel-cuts/immobilize' }
        ]);
      }, []);
    
  return (
    <section className="fuel-cuts-list global-margin">
     <div className="customers-search-input-wrapper">
             <input
               type="text"
               className="customers-search-input"
                placeholder="Search by customer or vehicle name"
                                         
             />
             <IoIosSearch className='customers-search-icon' size={20}/>
           </div>

<div className="fuel-cut-list-container">
   

   <FuelCut/>
   <FuelCut/>
   <FuelCut/>
   <FuelCut/>
   <FuelCut/>
   <FuelCut/>
   <FuelCut/>



</div>
  </section>

  )
}

export default ImmobilizePage