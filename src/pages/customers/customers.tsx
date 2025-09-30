import '../../styles/components/customers/customers.scss';
import { FaPeopleGroup } from "react-icons/fa6";
import { FaRegPenToSquare } from "react-icons/fa6";
import { FaTrash, FaUserEdit } from "react-icons/fa";
import { Fade } from "react-awesome-reveal";
import { useNavigate } from 'react-router-dom';
import { useCustomers } from '../../store/context/CustomersContext';
import { useBreadcrumbs } from '../../store/context/BreadcrumbsContext';
import { useEffect } from 'react';
function CustomersPage() {
  const router = useNavigate();
 const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Dashboard', path: '/dashboard' },
      { label: 'Customers', path: '/dashboard/customers' }
    ]);
  }, [setBreadcrumbs]);

   const { editMode, setEditMode, isDeleteMode, setIsDeleteMode } = useCustomers();
  return (
         <Fade>
    <section className="customers global-margin">
 
      <div className="customers-menu">
        <div className="customers-actions">
          <div className="menu-card" onClick={() => 
            
            {
            router('/dashboard/customers/list')
             setEditMode(false)
            }
          }
            >
            <FaPeopleGroup size={40} />
            <h3>View</h3>
            <p>View and manage the customer database</p>
          </div>
          <div className="menu-card" onClick={() => router('/dashboard/customers/register')}>
            <FaRegPenToSquare size={40} />
            <h3>Register</h3>
            <p>Add a new customer to the system</p>
          </div>
          <div className="menu-card" onClick={() => {
            
            router('/dashboard/customers/edit')
             setEditMode(true);
             }
            
            }>
            <FaUserEdit size={40} />
            <h3>Edit </h3>
            <p>Modify existing customer information</p>
          </div>
          <div className="menu-card" onClick={() => 
          {
          router('/dashboard/customers/delete')
            setIsDeleteMode(true);
           } 
            }>
            <FaTrash size={40} />
            <h3>Delete</h3>
            <p>Remove customer from the system</p>
          </div>
        </div>
      </div>
     
    </section>
     </Fade>
  )
}

export default CustomersPage