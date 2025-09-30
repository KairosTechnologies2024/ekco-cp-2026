

import React from 'react';
import '../../styles/components/customers/customer-card.scss';
import { FaEdit } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useCustomers } from '../../store/context/CustomersContext';
import { FaTrash } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setSelectedCustomer } from '../../store/redux/customersSlice';

type Customer = {
  idNumber: string;
  firstName: string;
  lastName: string;
  customerType: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  clientPassword: string;
  email: string;
  initiatorName: string;
  isActive: boolean;
  nextOfKin: string;
  nextOfKinNumber: string;
  passportNumber: string;
  phoneNumber: string;
  policyNumber: string;
  postalCode: string;
  profilePicture: string;
  province: string;
  userId: string;
  id:string;
  databaseLocation: string;
  firebaseAI: string;
};

type CustomerCardProps = {
  customer: Customer;
  showEditButton?: boolean;
  isEditMode?: boolean;
  showDeleteButton?: boolean;
};



  const handleDelete = () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete customer?`
    );
    if (confirmDelete) {
      
      console.log(`Deleted customer`);
    }
  };


function CustomerCard({ customer, showEditButton }: CustomerCardProps) {
  const navigate = useNavigate();
  const {editMode} = useCustomers();
  const dispatch = useDispatch();

  const location = useLocation();
  const isDeletePage = location.pathname.includes('/dashboard/customers/delete');

  const handleDelete = () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete customer ${customer.firstName} ${customer.lastName}?`
    );
    if (confirmDelete) {
      console.log(`Deleted customer ${customer.idNumber}`);
    }
  };
console.log("Customer object in card:", customer);
  return (
    <section className='customer-card' onClick={() => {
      dispatch(setSelectedCustomer(customer));
      navigate(`/dashboard/customers/profile/${customer.userId}`, {
        state: { from: '/dashboard/customers/list', fromLabel: 'View' }
      });
    }}>
   <div className={`customer-card-container ${editMode || isDeletePage ? 'edit-mode' : ''}`}>
        <p className="customer-card-id-number">{customer.idNumber === ''? 'N/A' : customer.idNumber}</p>
        <p className="customer-card-id-name">{customer.firstName === ''? 'N/A' : customer.firstName}</p>
        <p className="customer-card-id-name">{customer.lastName === ''? 'N/A' : customer.lastName}</p>
        <p className="customer-card-id-name">{customer.customerType ===  'regular_customer' ? 'Regular' : 'Fleet'}</p>
     {showEditButton && (
                <button
                    className="edit-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/dashboard/customers/edit/${customer.idNumber}`, {
                        state: { from: '/dashboard/customers/list', fromLabel: 'View' }
                      });
                    }}
                >
                    <FaEdit size={18} />

                </button>
            )}


              {isDeletePage && (
          <button
            className="delete-button"
            onClick={handleDelete}
          >
            <FaTrash size={16} />

          </button>
        )}
      </div>
    </section>
  );
}

export default React.memo(CustomerCard);
