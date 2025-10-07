
import "../../../styles/components/customers/register-customer.scss";
import { useBreadcrumbs } from "../../../store/context/BreadcrumbsContext";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRegisterCustomerMutation } from "../../../utils/api";
import toast from "react-hot-toast";
import { MoonLoader } from "react-spinners";
import type { RootState } from "../../../store/redux";
function RegisterCustomer() {
  const { setBreadcrumbs } = useBreadcrumbs();
  const user = useSelector((state: RootState) => state.user.user);
  const [registerCustomer, { isLoading }] = useRegisterCustomerMutation();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    idNumber: '',
    address1: '',
    address2: '',
    city: '',
    postalCode: '',
    province: '',
    password: '',
    clientPassword: '',
    initiatorName: '',
    nextOfKin: '',
    nextOfKinNumber: '',
    passportNumber: '',
    policyNumber: '',
    profilePicture: '',
    isActive: true,
  });

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Dashboard', path: '/dashboard' },
      { label: 'Customers', path: '/dashboard/customers' },
      { label: 'Register', path: '/dashboard/customers/register' },
    ]);
  }, [setBreadcrumbs]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let finalValue: any = value;
    if ((e.target as HTMLInputElement).type === 'checkbox') {
      finalValue = (e.target as HTMLInputElement).checked;
    } else if (name === 'isActive') {
      finalValue = value === 'Active';
    }
    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

  
    if (!user) {
      toast.error('User not authenticated');
      return;
    }

    const payload = {
      //user_id: user.id,
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      phone_number: formData.phoneNumber,
      id_number: formData.idNumber,
      address_line1: formData.address1,
      address_line2: formData.address2,
      city: formData.city,
      postal_code: formData.postalCode,
      province: formData.province,
      password: formData.password,
      client_password: formData.clientPassword,
      initiator_name: formData.initiatorName,
      next_of_kin: formData.nextOfKin,
      next_of_kin_number: formData.nextOfKinNumber,
      passport_number: formData.passportNumber,
      policy_number: formData.policyNumber,
      profile_picture: formData.profilePicture,
      is_active: formData.isActive,
    };
  console.log('registration data', payload)
    try {
    await registerCustomer(payload).unwrap();


     
      toast.success('Customer registered successfully');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        idNumber: '',
        address1: '',
        address2: '',
        city: '',
        postalCode: '',
        province: '',
        password: '',
        clientPassword: '',
        initiatorName: '',
        nextOfKin: '',
        nextOfKinNumber: '',
        passportNumber: '',
        policyNumber: '',
        profilePicture: '',
        isActive: true,
      });
    } catch (error) {
      toast.error('Failed to register customer');
    }
  };

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
              name="firstName"
              placeholder="Enter First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              placeholder="Enter Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="idNumber">ID Number</label>
            <input
              type="text"
              id="idNumber"
              name="idNumber"
              placeholder="Enter ID Number"
              value={formData.idNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              placeholder="Enter Phone Number"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="nextOfKin">Next of Kin</label>
            <input
              type="text"
              id="nextOfKin"
              name="nextOfKin"
              placeholder="Enter Next of Kin"
              value={formData.nextOfKin}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="nextOfKinNumber">Next of Kin Number</label>
            <input
              type="tel"
              id="nextOfKinNumber"
              name="nextOfKinNumber"
              placeholder="Enter Next of Kin Number"
              value={formData.nextOfKinNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="passportNumber">Passport Number</label>
            <input
              type="text"
              id="passportNumber"
              name="passportNumber"
              placeholder="Enter Passport Number"
              value={formData.passportNumber}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="policyNumber">Policy Number</label>
            <input
              type="text"
              id="policyNumber"
              name="policyNumber"
              placeholder="Enter Policy Number"
              value={formData.policyNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="postalCode">Postal Code</label>
            <input
              type="text"
              id="postalCode"
              name="postalCode"
              placeholder="Enter Postal Code"
              value={formData.postalCode}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="address1">Address Line 1</label>
            <input
              type="text"
              id="address1"
              name="address1"
              placeholder="Enter Address Line 1"
              value={formData.address1}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="address2">Address Line 2</label>
            <input
              type="text"
              id="address2"
              name="address2"
              placeholder="Enter Address Line 2"
              value={formData.address2}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="city">City</label>
            <input
              type="text"
              id="city"
              name="city"
              placeholder="Enter City"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="province">Province</label>
            <input
              type="text"
              id="province"
              name="province"
              placeholder="Enter Province"
              value={formData.province}
              onChange={handleChange}
              required
            />
          </div>




          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="text"
              id="password"
              name="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="clientPassword">Client Password</label>
            <input
              type="text"
              id="clientPassword"
              name="clientPassword"
              placeholder="Enter Client Password"
              value={formData.clientPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="initiatorName">Initiator Name</label>
            <input
              type="text"
              id="initiatorName"
              name="initiatorName"
              placeholder="Enter Initiator Name"
              value={formData.initiatorName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="profilePicture">Profile Picture URL</label>
            <input
              type="text"
              id="profilePicture"
              name="profilePicture"
              placeholder="Enter Profile Picture URL"
              value={formData.profilePicture}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="isActive">Is Active</label>
            <select
              id="isActive"
              name="isActive"
              value={formData.isActive ? 'Active' : 'Inactive'}
              onChange={handleChange}
              required
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="register-button"
          disabled={isLoading}
        >
          {isLoading ? (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '18px' }}>
              <MoonLoader color="white" size={16} />
            </span>
          ) : (
            'Register Customer'
          )}
        </button>
      </form>
    </section>
  );
}

export default RegisterCustomer;