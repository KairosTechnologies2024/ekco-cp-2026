import React from 'react'

import '../../styles/components/devices/device-health-card.scss';
import { GoDotFill } from "react-icons/go";

function DeviceHealthCard() {
  return (
   <div className='device-health-card'>


     <div className="device-health-card-items">

     

          <div className="device-health-card-item">



            <GoDotFill size={20} color='lime' />

          </div>


          <p className="device-health-card-item">

            869518071266341
          </p>
          <p className="device-health-card-item">

            connected
          </p>
          <p className="device-health-card-item">

          4.067000
          </p>
          <p className="device-health-card-item">

         2.6
          </p>
          <p className="device-health-card-item">

     2
          </p>
          <p className="device-health-card-item">

  Anandhan Chetty
          </p>
          <p className="device-health-card-item">

 	7707145113083
          </p>
          <p className="device-health-card-item">

2018 Hyundai H100
          </p>
          <p className="device-health-card-item">

HR46DN GP
          </p>
          <p className="device-health-card-item">

9/3/2025, 7:14:14 AM
          </p>


     </div>
   </div>
  )
}

export default DeviceHealthCard