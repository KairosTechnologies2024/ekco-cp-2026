
import "../../../styles/components/customers/register-customer.scss";
import { useBreadcrumbs } from "../../../store/context/BreadcrumbsContext";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetCustomerQuery, useUpdateCustomerMutation } from "../../../utils/api";
import GlobalLoader from "../../../components/global loader/GlobalLoader";
import GlobalError from "../../../components/global error/GlobalError";
import toast from "react-hot-toast";
import { MoonLoader } from "react-spinners";
function EditCustomer() {
 const { setBreadcrumbs } = useBreadcrumbs();
 const { id } = useParams();
 const { data, error, isLoading } = useGetCustomerQuery(id || '');
 const [updateCustomer, { isLoading: isUpdating }] = useUpdateCustomerMutation();
const [isHovered, setIsHovered] = useState(false);
 const [formData, setFormData] = useState({
  firstName: '',
  lastName: '',
  idNumber: '',
  email: '',
  phoneNumber: '',
  nextOfKin: '',
  nextOfKinNumber: '',
  passportNumber: '',
  policyNumber: '',
  postalCode: '',
  address1: '',
  address2: '',
  city: '',
  province: '',
  clientPassword: '',
  initiatorName: '',
 });

 useEffect(() => {
  if (data?.user) {
    const user = data.user;
    setFormData({
      firstName: user.first_name || '',
      lastName: user.last_name || '',
      idNumber: user.id_number || user.id_num || '',
      email: user.email || '',
      phoneNumber: user.phone_number || '',
      nextOfKin: user.next_of_kin || user.next_of_keen_name || '',
      nextOfKinNumber: user.next_of_kin_number || user.next_of_keen_number || '',
      passportNumber: user.passport_number || '',
      policyNumber: user.policy_number || '',
      postalCode: user.postal_code || '',
      address1: user.address_line1 || user.address1 || '',
      address2: user.address_line2 || user.address2 || '',
      city: user.city || '',
      province: user.province || '',
      clientPassword: user.client_password || '',
      initiatorName: user.initiator_name || '',
    });
  }
  }, [data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    const updateData = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      id_number: formData.idNumber,
      email: formData.email,
      phone_number: formData.phoneNumber,
      next_of_kin: formData.nextOfKin,
      next_of_kin_number: formData.nextOfKinNumber,
      passport_number: formData.passportNumber,
      policy_number: formData.policyNumber,
      postal_code: formData.postalCode,
      address_line1: formData.address1,
      address_line2: formData.address2,
      city: formData.city,
      province: formData.province,
      client_password: formData.clientPassword,
      initiator_name: formData.initiatorName,
    };

    try {
      await updateCustomer({
        userId: id,
        customerId: data?.user.id || '',
        data: updateData,
      }).unwrap();
      toast.success('customer updated successfully')
     
    } catch (err) {
      console.error('Update failed:', err);
     toast.error('Failed to update customer')
    }
  };

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Dashboard', path: '/dashboard' },
      { label: 'Customers', path: '/dashboard/customers' },

      { label: 'Edit', path: '/dashboard/customers/edit' },
    ]);
  }, []);

  if (isLoading) {
    return <GlobalLoader />;
  }

  if (error) {
    return <GlobalError errorMessage="Error loading customer data..." />;
  }

  return (
    <section className="register-customer global-margin">
   {/*    <h2 className="register-customer-title">Register New Customer</h2> */}

      <form className="register-customer-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              value={formData.firstName}
              name="firstName"
              placeholder="Enter First Name"
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              value={formData.lastName}
              name="lastName"
              placeholder="Enter Last Name"
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="idNumber">ID Number</label>
            <input
              type="text"
              id="idNumber"
              value={formData.idNumber}
              name="idNumber"
              placeholder="Enter ID Number"
              onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
                   value={'johndoe@gmail.com'}
              name="email"
              placeholder="Enter Email"
          
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              type="tel"
              value={formData.phoneNumber}
              id="phoneNumber"
              name="phoneNumber"
              placeholder="Enter Phone Number"
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="nextOfKin">Next of Kin</label>
            <input
              type="text"
              value={formData.nextOfKin}
              id="nextOfKin"
              name="nextOfKin"
              placeholder="Enter Next of Kin"
              onChange={(e) => setFormData({ ...formData, nextOfKin: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="nextOfKinNumber">Next of Kin Number</label>
            <input
              type="tel"
              id="nextOfKinNumber"
              value={formData.nextOfKinNumber}
              name="nextOfKinNumber"
              placeholder="Enter Next of Kin Number"
              onChange={(e) => setFormData({ ...formData, nextOfKinNumber: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="passportNumber">Passport Number</label>
            <input
              type="text"
              id="passportNumber"
              value={formData.passportNumber}
              name="passportNumber"
              placeholder="Enter Passport Number"
              onChange={(e) => setFormData({ ...formData, passportNumber: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label htmlFor="policyNumber">Policy Number</label>
            <input
              type="text"
              value={formData.policyNumber}
              id="policyNumber"
              name="policyNumber"
              placeholder="Enter Policy Number"
              onChange={(e) => setFormData({ ...formData, policyNumber: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="postalCode">Postal Code</label>
            <input
              type="text"
              id="postalCode"
              value={formData.postalCode}
              name="postalCode"
              placeholder="Enter Postal Code"
              onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="address1">Address Line 1</label>
            <input
              type="text"
              id="address1"
              value={formData.address1}
              name="address1"
              placeholder="Enter Address Line 1"
              onChange={(e) => setFormData({ ...formData, address1: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="address2">Address Line 2</label>
            <input
              type="text"
              id="address2"
              value={formData.address2}
              name="address2"
              placeholder="Enter Address Line 2"
              onChange={(e) => setFormData({ ...formData, address2: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label htmlFor="city">City</label>
            <input
              type="text"
              id="city"
              value={formData.city}
              name="city"
              placeholder="Enter City"
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="province">Province</label>
            <input
              type="text"
              value={formData.province}
              id="province"
              name="province"
              placeholder="Enter Province"
              onChange={(e) => setFormData({ ...formData, province: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="clientPassword">Client Password</label>
            <input
              type="password"
              id="clientPassword"
              value={formData.clientPassword}
              name="clientPassword"
              placeholder="Enter Client Password"
              onChange={(e) => setFormData({ ...formData, clientPassword: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="initiatorName">Initiator Name</label>
            <input
              type="text"
              id="initiatorName"
              value={formData.initiatorName}
              name="initiatorName"
              placeholder="Enter Initiator Name"
              onChange={(e) => setFormData({ ...formData, initiatorName: e.target.value })}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="register-button"
          disabled={isUpdating}
           onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
        >
          {isUpdating
                ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '18px' }}>
                    <MoonLoader color={isHovered ? 'white' : 'black'} size={16} />
                  </span>
                : 'Update Customer'}
        </button>
      </form>
    </section>
  );
}

export default EditCustomer;