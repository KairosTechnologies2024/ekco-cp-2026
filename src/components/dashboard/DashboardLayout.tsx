
import Sidebar from "./Sidebar"
import Navbar from "./Navbar"
import { Outlet } from "react-router-dom"
import { useGetCustomersQuery } from "../../utils/api"
function DashboardLayout() {
  // Prefetch customers data when dashboard loads
  useGetCustomersQuery();

  return (
  <>
  
 {/*      <ChangeTheme/>  */}
<Sidebar/>
<Navbar/>
<Outlet/>
  </>
  )
}

export default DashboardLayout