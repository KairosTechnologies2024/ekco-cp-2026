

import React, { useState } from 'react';
import '../../styles/components/customers/customer-card.scss';
import { FaEdit } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useCustomers } from '../../store/context/CustomersContext';
import { FaTrash } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setSelectedCustomer } from '../../store/redux/customersSlice';
import { useDeleteCustomerMutation } from '../../utils/api';
import ConfirmationDialog from '../common/ConfirmationDialog';
import PinDialog from '../common/PinDialog';
import toast from 'react-hot-toast';

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

function CustomerCard({ customer, showEditButton, showDeleteButton }: CustomerCardProps) {
  const navigate = useNavigate();
  const {editMode} = useCustomers();
  const dispatch = useDispatch();

  const location = useLocation();
  const isDeletePage = location.pathname.includes('/dashboard/customers/delete');

  const [deleteCustomer, { isLoading: isDeleting }] = useDeleteCustomerMutation();
  const [showDialog, setShowDialog] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteCustomer({ userId: customer.userId, customerId: customer.id }).unwrap();
      toast.success(`Customer ${customer.firstName} ${customer.lastName} deleted successfully.`);
    } catch (error) {
      console.error('Failed to delete customer:', error);
      toast.error('Failed to delete customer. Please try again.');
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDialog(true);
  };
console.log("Customer object in card:", customer);
  return (
    <section className='customer-card' onClick={() => {
      if (showDialog) return;
      dispatch(setSelectedCustomer(customer));
      navigate(`/dashboard/customers/profile/${customer.userId}`, {
        state: { from: '/dashboard/customers/list', fromLabel: 'View' }
      });
    }}>
   <div className={`customer-card-container ${editMode || isDeletePage ? 'edit-mode' : ''}`}>
        <p className="customer-card-id-number">{customer?.idNumber === ''? 'N/A' : customer?.idNumber}</p>
        <p className="customer-card-id-name">{customer?.firstName === ''? 'N/A' : customer?.firstName}</p>
        <p className="customer-card-id-name">{customer?.lastName === ''? 'N/A' : customer?.lastName}</p>
        <p className="customer-card-id-name">{customer?.customerType ===  'regular_customer' ? 'Regular' : 'Fleet'}</p>
     {showEditButton && (
                <button
                    className="edit-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/dashboard/customers/edit/${customer.userId}`, {
                        state: { from: '/dashboard/customers/list', fromLabel: 'View' }
                      });
                    }}
                >
                    <FaEdit size={18} />

                </button>
            )}


              {isDeletePage && showDeleteButton && (
          <button
            className="delete-button"
            onClick={handleDeleteClick}
            disabled={isDeleting}
          >
            <FaTrash size={16} />
          </button>
        )}
      </div>
      <ConfirmationDialog
        isOpen={showDialog}
        message={`Are you sure you want to delete customer ${customer.firstName} ${customer.lastName}?`}
        onConfirm={() => {
          setShowDialog(false);
          handleDelete();
        }}
        onCancel={() => setShowDialog(false)}
      />
    </section>
  );
}

export default React.memo(CustomerCard);
