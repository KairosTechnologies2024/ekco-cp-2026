
import { useEffect } from "react";
import { useParams } from 'react-router-dom';
import { useBreadcrumbs } from "../../../store/context/BreadcrumbsContext";
import { useGetCustomerQuery } from "../../../utils/api";
import CustomerProfileCard from "../../../components/customers/customer/customer profile/CustomerProfileCard";
import CustomerVehicleCard from "../../../components/customers/customer/customer profile/CustomerVehicleCard";
import '../../../styles/components/customers/customer-profile-page.scss';
import CustomerAddVehicleCard from "../../../components/customers/customer/customer profile/CustomerAddVehicleCard";
import { MoonLoader } from "react-spinners";
import GlobalLoader from "../../../components/global loader/GlobalLoader";
import GlobalError from "../../../components/global error/GlobalError";
function CustomerProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { data: customer, isLoading, error } = useGetCustomerQuery(id || '');

  const { setBreadcrumbs } = useBreadcrumbs();



  useEffect(() => {
    if (customer) {
      setBreadcrumbs([
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Customers', path: '/dashboard/customers' },
        { label: 'View', path: '/dashboard/customers/list' },
        { label: `${customer.user.first_name || 'N/A'} ${customer.user.last_name || 'N/A'}`, path: `/dashboard/customers/profile/${id}` }
      ]);
    }
  }, [customer, id, setBreadcrumbs]);

  if (isLoading) {
    return <GlobalLoader/>
    
    
    ;
  }

  if (error || !customer) {
    return <GlobalError/>;
  }






  return (
    <GlobalError>
      <section className="customer-profile-page global-margin">
        <CustomerProfileCard />
        <CustomerVehicleCard userId={id || ''} />
        <CustomerAddVehicleCard userId={id || ''} />
      </section>
    </GlobalError>
  );
}

export default CustomerProfilePage;
