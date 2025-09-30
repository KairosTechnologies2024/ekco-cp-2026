import { TfiCut } from "react-icons/tfi";
import '../../styles/components/fuel-cuts/fuel-cut-card.scss';
import { useLocation } from "react-router-dom";
import { FaCarSide } from "react-icons/fa";

function FuelCut() {



  const pathname= useLocation().pathname;
  return (



    <div className="fuel-cut-card">

            

     <div className="fuel-cut-card-col">

   

   


{pathname === '/dashboard/fuel-cuts/mobilize' ? <FaCarSide size={25}/> : <TfiCut size={25}/>  }
   
        
     </div>
     <div className="fuel-cut-card-col">

                <p className="fuel-cut-customer-detail">015 812 0228</p>
                

     </div>
     <div className="fuel-cut-card-col">

                <p className="fuel-cut-customer-detail">Audi RS3 2022</p>
                <p className="fuel-cut-customer-detail">Nhlamulo Magwaza</p>

     </div>
     <div className="fuel-cut-card-col">

              <button className="fuel-cut-button">{pathname  === '/dashboard/fuel-cuts/mobilize' ? 'Deactivate' : 'Activate'  }</button>

     </div>
    </div>
  )
}

export default FuelCut