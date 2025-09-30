import { IoIosAdd } from "react-icons/io";
import '../../../../styles/components/customers/customer-addvehicle-card.scss';

function CustomerAddVehicleCard() {
  return (
    


    <div className="customer-add-vehicle-card">


        <div className="customer-add-vehicle-card-container">
         <div className="add-vehicle-card-header">
     <IoIosAdd className='add-vehicle-card-icon' size={50} />

        <h2 className="add-vehicle-card-title">Add Vehicle</h2>
            </div>

            <div className="add-vehicle-card-contents">

                <input type="text" placeholder="Registration Number"/>   
                <input type="text" placeholder="Serial Number"/>   
                <select name="" id="">

                    <option value="ferarri">Ferarri</option>
                    <option value="bmw">BMW</option>

                </select>
                   <button className="add-vehicle-button">Add Vehicle & Delink device</button>
    </div>
    </div>
    </div>
  )
}

export default CustomerAddVehicleCard