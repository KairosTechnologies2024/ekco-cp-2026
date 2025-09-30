import { useState } from 'react';
import CustomerCard from './CustomerCard';
import { IoIosSearch } from "react-icons/io";

import '../../styles/components/customers/customers.scss';
import { useCustomers } from '../../store/context/CustomersContext';

import { useEffect } from 'react';
import { useBreadcrumbs } from '../../store/context/BreadcrumbsContext';

function EditCustomerList() {
    const [search, setSearch] = useState('');
    // Using the same dummy data as CustomerList

 const { setBreadcrumbs } = useBreadcrumbs();
    const { editMode, setEditMode} = useCustomers();
  useEffect(() => {
        setBreadcrumbs([
            { label: 'Dashboard', path: '/dashboard' },
            { label: 'Customers', path: '/dashboard/customers' },
            { label: 'Edit', path: '/dashboard/customers/edit' },
        ]);

        // Set edit mode true on mount
        setEditMode(true);

        // Optional: Reset it on unmount
        return () => setEditMode(false);
    }, []);


    
    const customers = [
       { idNumber: "1007657650001", firstName: "John", lastName: "Doe", customerType: "Regular" },
  { idNumber: "1000007870002", firstName: "Jane", lastName: "Smith", customerType: "Fleet" },
  { idNumber: "100000655463", firstName: "Michael", lastName: "Brown", customerType: "Regular" },
  { idNumber: "1007567653004", firstName: "Emily", lastName: "Johnson", customerType: "Fleet" },
  { idNumber: "1006765756005", firstName: "David", lastName: "Williams", customerType: "Regular" },
  { idNumber: "1000000000006", firstName: "Sarah", lastName: "Jones", customerType: "Fleet" },
  { idNumber: "1000000000007", firstName: "Daniel", lastName: "Garcia", customerType: "Regular" },
  { idNumber: "1000078687008", firstName: "Emma", lastName: "Martinez", customerType: "Fleet" },
  { idNumber: "1000565656509", firstName: "Matthew", lastName: "Miller", customerType: "Regular" },
  { idNumber: "1000000000010", firstName: "Olivia", lastName: "Davis", customerType: "Fleet" },
  { idNumber: "1000354400011", firstName: "James", lastName: "Rodriguez", customerType: "Regular" },
  { idNumber: "1000000000012", firstName: "Sophia", lastName: "Hernandez", customerType: "Fleet" },
  { idNumber: "1000000000013", firstName: "Benjamin", lastName: "Lopez", customerType: "Regular" },
  { idNumber: "1000675676514", firstName: "Grace", lastName: "Gonzalez", customerType: "Fleet" },
  { idNumber: "1000000000015", firstName: "Jack", lastName: "Wilson", customerType: "Regular" },
  { idNumber: "1000000000016", firstName: "Chloe", lastName: "Anderson", customerType: "Fleet" },
  { idNumber: "1008787878717", firstName: "Lucas", lastName: "Thomas", customerType: "Regular" },
  { idNumber: "1000000000018", firstName: "Mia", lastName: "Taylor", customerType: "Fleet" },
  { idNumber: "1000000000019", firstName: "Henry", lastName: "Moore", customerType: "Regular" },
  { idNumber: "1000000000020", firstName: "Ella", lastName: "Jackson", customerType: "Fleet" }
      ];

    const filteredCustomers = customers.filter((c) => {
        const term = search.trim().toLowerCase();
        return (
            c.idNumber.toLowerCase().includes(term) ||
            c.firstName.toLowerCase().includes(term) ||
            c.lastName.toLowerCase().includes(term) ||
            c.customerType.toLowerCase().includes(term)
        );
    });
 







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
                        <IoIosSearch className='customers-search-icon' size={20}/>
                    </div>
                </div>
                 <div className={`customers-header-2 ${editMode? 'edit-mode' : ''}`}>
                    <p>ID NUMBER</p>
                    <p>FIRST NAME</p>
                    <p>LAST NAME</p>
                    <p>CUSTOMER TYPE</p>
                    <p>EDIT</p>
                </div>
            </div>

            <div className="customers-list">
                {filteredCustomers.length === 0 ? (
                    <div className="customers-no-results">
                        No results found for <strong>{search}</strong>
                    </div>
                ) : (
                    filteredCustomers.map((customer) => (
                        <CustomerCard
                            key={customer.idNumber}
                            idNumber={customer.idNumber}
                            firstName={customer.firstName}
                            lastName={customer.lastName}
                            customerType={customer.customerType}
                            showEditButton={true}
                        />
                    ))
                )}
            </div>
        </div>
        </section>
    );
}

export default EditCustomerList;