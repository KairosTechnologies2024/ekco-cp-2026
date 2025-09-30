
import { IoPersonOutline } from "react-icons/io5";
import '../../../../styles/components/customers/customer-profile-card.scss';
import { useGetCustomerQuery } from '../../../../utils/api';
import { useParams } from 'react-router-dom';

interface User {
  user_id: string;
  email: string;
  user_type: string;
  id: string;
  first_name: string;
  last_name: string;
  id_number: string;
  phone_number: string;
  next_of_kin: string;
  next_of_kin_number: string;
  passport_number: string;
  policy_number: string;
  postal_code: string;
  address_line1: string;
  address_line2: string;
  city: string | null;
  province: string | null;
  client_password: string;
  initiator_name: string;
  is_active: boolean;
  profile_picture: string;
  address1: string | null;
  address2: string | null;
  insurance_number: string | null;
  next_of_kin_name: string | null;
  insurance_name: string | null;
  id_num: string | null;
  next_of_keen_name: string | null;
  next_of_keen_number: string | null;
}

interface Customer {
  user: User;
  databaseLocation?: string;
  firebaseAI?: string;
}

function CustomerProfileCard() {
  const { id } = useParams<{ id: string }>();
  const { data: customer, error, isLoading } = useGetCustomerQuery(id || '');

  const isBlank = (value: string | null | undefined) => !value || value.trim() === '';

  const formatAddress = () => {
    if (!customer) return 'N/A';
    const parts = [customer.user.address_line_1, customer.user.address_line_2, customer.user.city, customer.user.province, customer.user.postal_code];
    const nonBlankParts = parts.filter(part => !isBlank(part));
    if (nonBlankParts.length === 0) {
      return 'N/A';
    }
    return nonBlankParts.join(' ');
  };

  if (isLoading) {
    return <div>Loading customer data...</div>;
  }

  if (error) {
    return <div>Error loading customer data.</div>;
  }

  if (!customer) {
    return <div>No customer data found.</div>;
  }

  console.log('returning customer profile card for:', customer.user);
  return (
    <div className="customer-profile-card">
      <div className="customer-profile-card-container">
        <div className="customer-profile-card-header">
          <IoPersonOutline size={50} className="user-profile-icon" />
          <h2>{`${isBlank(customer.user.first_name) ? 'N/A' : customer.user.first_name} ${isBlank(customer.user.last_name) ? 'N/A' : customer.user.last_name}`}</h2>
        </div>
        <p><span>Email:</span> {isBlank(customer.user.email) ? 'N/A' : customer.user.email}</p>
        <p><span>Phone Number:</span> {isBlank(customer.user.phone_number) ? 'N/A' : customer.user.phone_number.trim()}</p>
        <p><span>ID Number:</span> {isBlank(customer.user.id_number) ? 'N/A' : customer.user.id_number}</p>
        <p><span>Address:</span> {formatAddress()}</p>
        <p><span>Next of Kin:</span> {isBlank(customer.user.next_of_kin_name) ? 'N/A' : customer.user.next_of_kin_name
}</p>
        <p><span>Next of Kin's Number:</span> {isBlank(customer.user.next_of_kin_number) ? 'N/A' : customer.user.next_of_kin_number}</p>
        <p><span>Initiator Name:</span> {isBlank(customer.user.initiator_name) ? 'N/A' : customer.user.initiator_name}</p>
        <p><span>Policy Number:</span> {isBlank(customer.user.policy_number) ? 'N/A' : customer.user.policy_number}</p>
        <p><span>Passport Number:</span> {isBlank(customer.user.passport_number) ? 'N/A' : customer.user.passport_number}</p>
        <p><span>Status:</span> {customer.user.is_active ? "Active" : "Inactive"}</p>
      </div>
    </div>
  );
}

export default CustomerProfileCard;
