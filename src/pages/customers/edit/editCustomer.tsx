
import "../../../styles/components/customers/register-customer.scss";
import { useBreadcrumbs } from "../../../store/context/BreadcrumbsContext";
import { useEffect } from "react";
function EditCustomer() {
 const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Dashboard', path: '/dashboard' },
      { label: 'Customers', path: '/dashboard/customers' },
   
      { label: 'Edit', path: '/dashboard/customers/edit' },
    ]);
  }, []);

  return (
    <section className="register-customer global-margin">
   {/*    <h2 className="register-customer-title">Register New Customer</h2> */}
      
      <form className="register-customer-form" onSubmit={(e) => {
        e.preventDefault();
    
      }}>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              value={'John'}
              name="firstName"
              placeholder="Enter First Name"
        
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
                   value={'Doe'}
              name="lastName"
              placeholder="Enter Last Name"
       
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="idNumber">ID Number</label>
            <input
              type="text"
              id="idNumber"
                   value={'8659094830583408'}
              name="idNumber"
              placeholder="Enter ID Number"
         
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
                 value={'0123456789'}
              id="phoneNumber"
              name="phoneNumber"
              placeholder="Enter Phone Number"
        
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="nextOfKin">Next of Kin</label>
            <input
              type="text"
                value={'Karen Khumalo'}
              id="nextOfKin"
              name="nextOfKin"
              placeholder="Enter Next of Kin"
      
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="nextOfKinNumber">Next of Kin Number</label>
            <input
              type="tel"
              id="nextOfKinNumber"
                     value={'0123456789'}
              name="nextOfKinNumber"
              placeholder="Enter Next of Kin Number"
        
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="passportNumber">Passport Number</label>
            <input
              type="text"
              id="passportNumber"
                     value={'893207432759347'}
              name="passportNumber"
              placeholder="Enter Passport Number"
         
            />
          </div>

          <div className="form-group">
            <label htmlFor="policyNumber">Policy Number</label>
            <input
              type="text"
                 value={'8924'}
              id="policyNumber"
              name="policyNumber"
              placeholder="Enter Policy Number"
     
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="postalCode">Postal Code</label>
            <input
              type="text"
              id="postalCode"
                 value={'8260'}
              name="postalCode"
              placeholder="Enter Postal Code"
    
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="address1">Address Line 1</label>
            <input
              type="text"
              id="address1"
                    value={'18 Ridge Road'}
              name="address1"
              placeholder="Enter Address Line 1"
       
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="address2">Address Line 2</label>
            <input
              type="text"
              id="address2"
                      value={'328 Nana Sita'}
              name="address2"
              placeholder="Enter Address Line 2"
     
            />
          </div>

          <div className="form-group">
            <label htmlFor="city">City</label>
            <input
              type="text"
              id="city"
                 value={'Durban'}
              name="city"
              placeholder="Enter City"
 
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="province">Province</label>
            <input
              type="text"
                      value={'Kwazulu Natal'}
              id="province"
              name="province"
              placeholder="Enter Province"
           
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="clientPassword">Client Password</label>
            <input
              type="password"
              id="clientPassword"
               value={'########'}
              name="clientPassword"
              placeholder="Enter Client Password"
             
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="initiatorName">Initiator Name</label>
            <input
              type="text"
              id="initiatorName"
              
                 value={'Sanele'}
        
        
              name="initiatorName"
              placeholder="Enter Initiator Name"
             
              required
            />
          </div>
        </div>

        <button 
          type="submit" 
          className="register-button"
       
        >
       Update Customer
        </button>
      </form>
    </section>
  );
}

export default EditCustomer;