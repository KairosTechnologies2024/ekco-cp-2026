import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface Customer {
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
  databaseLocation: string;
  firebaseAI: string;
}

interface CustomersState {
  count: number;
  regularCustomers: Customer[];
  fleetCustomers: Customer[];
  allCustomers: Customer[];
  selectedCustomer: Customer | null;
}

const initialState: CustomersState = {
  count: 0,
  regularCustomers: [],
  fleetCustomers: [],
  allCustomers: [],
  selectedCustomer: null,
};

const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    setCustomerCount(state, action: PayloadAction<number>) {
      state.count = action.payload;
    },
    setCustomersData(state, action: PayloadAction<{ regularCustomers: Customer[]; fleetCustomers: Customer[] }>) {
      state.regularCustomers = action.payload.regularCustomers;
      state.fleetCustomers = action.payload.fleetCustomers;
      // combine and dedupe customers by idNumber so the count reflects unique customers
      const combined = [...action.payload.regularCustomers, ...action.payload.fleetCustomers];
      const unique: Customer[] = [];
      const seen = new Set<string>();
      for (const c of combined) {
        if (c.idNumber && !seen.has(c.idNumber)) {
          unique.push(c);
          seen.add(c.idNumber);
        }
      }
      state.allCustomers = unique;
      state.count = unique.length;
    },
    setSelectedCustomer(state, action: PayloadAction<Customer | null>) {
      state.selectedCustomer = action.payload;
    },
  },
});

export const { setCustomerCount, setCustomersData, setSelectedCustomer } = customersSlice.actions;
export default customersSlice.reducer;
