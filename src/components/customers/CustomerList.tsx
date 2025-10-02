
import { useState, useEffect, useMemo } from 'react';
import CustomerCard from './CustomerCard';
import { IoIosSearch } from "react-icons/io";
import '../../styles/components/customers/customers.scss';

import { useBreadcrumbs } from '../../store/context/BreadcrumbsContext';
import { useGetCustomersQuery } from '../../utils/api';
import { MoonLoader } from 'react-spinners';
import { useDispatch } from 'react-redux';
import { setCustomerCount, setCustomersData } from '../../store/redux/customersSlice';
import GlobalLoader from '../global loader/GlobalLoader';
import GlobalError from '../global error/GlobalError';


function CustomerList() {
  const { data, error, isLoading, refetch } = useGetCustomersQuery();

  const { setBreadcrumbs } = useBreadcrumbs();

  const dispatch = useDispatch();
  let errorMessage = 'Error loading customers...';

  const [isPseudoLoading, setIsPseudoLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsPseudoLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Dashboard', path: '/dashboard' },
      { label: 'Customers', path: '/dashboard/customers' },
      { label: 'View', path: '/dashboard/customers/list' }
    ]);
  }, [setBreadcrumbs]);

  // Log data retrieval status and store data in Redux
  useEffect(() => {
    console.log('Customer data retrieval status:');
    console.log('isLoading:', isLoading);
    console.log('error:', error);
    console.log('data:', data);
    if (data) {
      console.log('regularCustomers:', data.regularCustomers);
      console.log('fleetCustomers:', data.fleetCustomers);
      // Store customers data in Redux
      dispatch(setCustomersData({
        regularCustomers: (data.regularCustomers || []).map((c: any) => ({
          idNumber: c.id_number || c.idNum || c.id_num || '',
          firstName: c.first_name || '',
          lastName: c.last_name || '',
          customerType: c.user_type || c.customerType || '',
          addressLine1: c.address_line_1 || '',
          addressLine2: c.address_line_2 || '',
          city: c.city || '',
          clientPassword: c.client_password || '',
          email: c.email || '',
          initiatorName: c.initiator_name || '',
          isActive: c.is_active || false,
          nextOfKin: c.next_of_kin || '',
          nextOfKinNumber: c.next_of_kin_number || '',
          passportNumber: c.passport_number || '',
          phoneNumber: c.phone_number || '',
          policyNumber: c.policy_number || '',
          postalCode: c.postal_code || '',
          profilePicture: c.profile_picture || '',
          province: c.province || '',
          userId: c.user_id || '',
          databaseLocation: c.database_location || '',
          firebaseAI: c.firebase_ai || ''
        })),
        fleetCustomers: (data.fleetCustomers || []).map((c: any) => ({
          idNumber: c.id_number || c.idNum || c.id_num || '',
          firstName: c.first_name || '',
          lastName: c.last_name || '',
          customerType: c.user_type || c.customerType || '',
          addressLine1: c.address_line_1 || '',
          addressLine2: c.address_line_2 || '',
          city: c.city || '',
          clientPassword: c.client_password || '',
          email: c.email || '',
          initiatorName: c.initiator_name || '',
          isActive: c.is_active || false,
          nextOfKin: c.next_of_kin || '',
          nextOfKinNumber: c.next_of_kin_number || '',
          passportNumber: c.passport_number || '',
          phoneNumber: c.phone_number || '',
          policyNumber: c.policy_number || '',
          postalCode: c.postal_code || '',
          profilePicture: c.profile_picture || '',
          province: c.province || '',
          userId: c.user_id || '',
          databaseLocation: c.database_location || '',
          firebaseAI: c.firebase_ai || ''
        }))
      }));
    }
  }, [data, error, isLoading, dispatch]);

  const [search, setSearch] = useState('');
  const [itemsToShow, setItemsToShow] = useState(100);

  // Memoize all customers by combining regular and fleet customers
  const allCustomers = useMemo(() => {
    if (!data) return [];
    const regular = (data.regularCustomers || []).map((c: any) => ({
      idNumber: c.id_number || c.idNum || c.id_num || '',
      firstName: c.first_name || '',
      lastName: c.last_name || '',
      customerType: c.user_type || c.customerType || '',
      addressLine1: c.address_line_1 || '',
      addressLine2: c.address_line_2 || '',
      city: c.city || '',
      clientPassword: c.client_password || '',
      email: c.email || '',
      initiatorName: c.initiator_name || '',
      isActive: c.is_active || false,
      nextOfKin: c.next_of_kin || '',
      nextOfKinNumber: c.next_of_kin_number || '',
      passportNumber: c.passport_number || '',
      phoneNumber: c.phone_number || '',
      policyNumber: c.policy_number || '',
      postalCode: c.postal_code || '',
      profilePicture: c.profile_picture || '',
      province: c.province || '',
      userId: c.user_id || '',
      databaseLocation: c.database_location || '',
      firebaseAI: c.firebase_ai || ''
    }));
    const fleet = (data.fleetCustomers || []).map((c: any) => ({
      idNumber: c.id_number || c.idNum || c.id_num || '',
      firstName: c.first_name || '',
      lastName: c.last_name || '',
      customerType: c.user_type || c.customerType || '',
      addressLine1: c.address_line_1 || '',
      addressLine2: c.address_line_2 || '',
      city: c.city || '',
      clientPassword: c.client_password || '',
      email: c.email || '',
      initiatorName: c.initiator_name || '',
      isActive: c.is_active || false,
      nextOfKin: c.next_of_kin || '',
      nextOfKinNumber: c.next_of_kin_number || '',
      passportNumber: c.passport_number || '',
      phoneNumber: c.phone_number || '',
      policyNumber: c.policy_number || '',
      postalCode: c.postal_code || '',
      profilePicture: c.profile_picture || '',
      province: c.province || '',
      userId: c.user_id || '',
      databaseLocation: c.database_location || '',
      firebaseAI: c.firebase_ai || ''
    }));
    const combined = [...regular, ...fleet];
    // Filter out customers with any empty fields
    const filtered = combined.filter(customer =>
      customer.idNumber !== '' &&
      customer.firstName !== '' &&
      customer.lastName !== '' &&
      customer.customerType !== ''
    );
    // Filter out duplicates by idNumber only
    const uniqueCustomers: any[] = [];
    const seenIdNumbers = new Set();

    for (const customer of filtered) {
      if (!seenIdNumbers.has(customer.idNumber)) {
        uniqueCustomers.push(customer);
        seenIdNumbers.add(customer.idNumber);
      }
    }
    return uniqueCustomers;
  }, [data]);

  // Update customer count in Redux when allCustomers changes
  useEffect(() => {
    dispatch(setCustomerCount(allCustomers.length));
  }, [allCustomers.length, dispatch]);

  // Memoize filtered customers to avoid unnecessary recalculations
  const filteredCustomers = useMemo(() => {
    if (!allCustomers.length) return [];
    const term = search.trim().toLowerCase();
    return allCustomers.filter((c) =>
      (c.idNumber?.toLowerCase() || '').includes(term) ||
      (c.firstName?.toLowerCase() || '').includes(term) ||
      (c.lastName?.toLowerCase() || '').includes(term) ||
      (c.customerType?.toLowerCase() || '').includes(term)
    );
  }, [allCustomers, search]);

  return (
    <section className="customers global-margin">
      <div className="customers-container">
        <div className="customers-header">
          <div className="customers-header-1">
            <div className="customers-search-input-wrapper">
              <input
                type="text"
                className="customers-search-input"
                placeholder="Search by ID, First Name, Last Name or Customer Type"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <IoIosSearch className='customers-search-icon' size={20} />
            </div>
          </div>
          <div className="customers-header-2">
            <p>ID NUMBER</p>
            <p>FIRST NAME</p>
            <p>LAST NAME</p>
            <p>CUSTOMER TYPE</p>
          </div>
        </div>

        <div className="customers-list">
          {(isLoading) ? (

         <GlobalLoader/>
          ) : error && !isLoading ? (
                <GlobalError errorMessage={errorMessage}/>
          ) : filteredCustomers.length === 0 ? (
            <div className="customers-no-results">
              No results found for <strong>{search}</strong>
            </div>
          ) : (
            filteredCustomers.slice(0, itemsToShow).map((customer) => (
              <CustomerCard
                key={customer.user_id}
                customer={customer}
              />
            ))
          )}
        </div>
        {filteredCustomers.length > itemsToShow && (
          <div style={{ textAlign: 'center', margin: '20px 0' }}>
            <button onClick={() => setItemsToShow(prev => prev + 100)} className='btn-load-more'>Load More</button>
          </div>
        )}
      </div>
    </section>
  );
}

export default CustomerList;
