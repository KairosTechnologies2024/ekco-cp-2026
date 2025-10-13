import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

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

interface UserProfile {
  id: string;
  email: string;
  user_type: string;
  twofa_enabled: boolean;
}

interface Alert {
  id: string;
  time: string;
  device_serial: string;
  alert: string;
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  id_number: string;
  next_of_kin: string | null;
  next_of_kin_number: string;
  vehicle_model: string;
  vehicle_plate: string;
  row_num: string;
  synced: boolean;
}

interface Ticket {
  id: number;
  title: string;
  type: string;
  description: string;
  status: 'pending' | 'resolved';
  createdat: string;
  updatedat: string | null;
  customername: string;
  customeremail: string;
  customerphone: string;
  loggedby: string; // Customer who created the ticket
  resolvedby: string | null; // Support staff who resolved it
  resolvedat?: string; // Assuming it might be added
  user_id: number;
  customer_id: number;
  user_email: string;
  user_type: string;
  first_name: string;
  last_name: string;
  phone_number: string;
}

interface RiskApi {
  id: number;
  title: string;
  clientname: string;
  clientid: string;
  carmodel: string;
  registration: string;
  contactnumber: string;
  risktype: string;
  description: string;
  status: string;
  createdat: string;
  updatedat: string;
  loggedby: string;
  resolvedby: string | null;
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3003/api',
    prepareHeaders: (headers) => {
      const token = sessionStorage.getItem('accessToken');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Customers', 'Tickets', 'Risks'],
  endpoints: (builder) => ({
    login: builder.mutation<{ user?: any; accessToken?: string; refreshToken?: string; otpSent?: boolean; userId?: string; message?: string }, { email: string; password: string }>({
      query: (credentials) => ({
        url: 'users/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    verifyOtp: builder.mutation<{ accessToken: string; refreshToken: string; message: string }, { userId: string; token: string }>({
      query: (body) => ({
        url: 'users/verify-2fa',
        method: 'POST',
        body,
      }),
    }),
    resetPassword: builder.mutation<any, { email?: string; token?: string; newPassword?: string }>({
      query: (body) => ({
        url: 'users/reset-password',
        method: 'POST',
        body,
      }),
    }),
    forgotPassword: builder.mutation<any, { email: string }>({
      query: (body) => ({
        url: 'users/forgot-password',
        method: 'POST',
        body,
      }),
    }),
    refreshToken: builder.mutation<{ accessToken: string }, { refreshToken: string }>({
      query: (body) => ({
        url: 'users/tokens/refresh',
        method: 'POST',
        body,
      }),
    }),
    getCustomers: builder.query<{ regularCustomers: Array<{ idNumber: string; firstName: string; lastName: string; customerType: string }>, fleetCustomers: Array<{ idNumber: string; firstName: string; lastName: string; customerType: string }> }, void>({
      query: () => ({
        url: 'customers/allcustomers', // Combined list of regular and fleet customers
        method: 'GET',
      }),
      providesTags: [{ type: 'Customers', id: 'LIST' }], // For cache invalidation
    }),
    getCustomer: builder.query<{ user: User; databaseLocation?: string; firebaseAI?: string }, string>({
      query: (id) => ({
        url: `customers/customer/${id}`,
        method: 'GET',
      }),
      providesTags: [{ type: 'Customers', id: 'SINGLE' }],
    }),
    updateCustomer: builder.mutation<{ message: string }, { userId: string; customerId: string; data: Partial<User> }>({
      query: ({ userId, customerId, data }) => ({
        url: `customers/customer/${userId}/${customerId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: [{ type: 'Customers', id: 'LIST' }, { type: 'Customers', id: 'SINGLE' }],
    }),
    deleteCustomer: builder.mutation<{ message: string }, { userId: string; customerId: string }>({
      query: ({ userId, customerId }) => ({
        url: `customers/customer/${userId}/${customerId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Customers', id: 'LIST' }, { type: 'Customers', id: 'SINGLE' }],
    }),
    getCustomerVehicles: builder.query<{ vehicles: Array<{ id: string; make: string; vehicle_model: string; year: string; package: string; device_serial: string; vehicle_plate: string }> }, string>({
      query: (userId) => ({
        url: `customers/vehicles/${userId}`,
        method: 'GET',
      }),
      providesTags: [{ type: 'Customers', id: 'VEHICLES' }],
    }),
    getSpeed: builder.query<{ speed_data: Array<{ speed: number }> }, string>({
      query: (serialNumber) => ({
        url: `customers/speed/${serialNumber}`,
        method: 'GET',
      }),
    }),
    getIgnition: builder.query<{ ignition_data: Array<{ ignition_status: string }> }, string>({
      query: (serialNumber) => ({
        url: `customers/ignition/${serialNumber}`,
        method: 'GET',
      }),
    }),
    getGps: builder.query<{ gps_data: Array<{ latitude: number; longitude: number; address: string }> }, string>({
      query: (serialNumber) => ({
        url: `customers/gps/${serialNumber}`,
        method: 'GET',
      }),
    }),
    getAlertsBySerial: builder.query<{ alerts_data: Alert[] }, string>({
      query: (serialNumber) => ({
        url: `customers/alerts/serial/${serialNumber}`,
        method: 'GET',
      }),
    }),
    getAllAlerts: builder.query<{ alerts: Alert[] }, void>({
      query: () => ({
        url: 'alerts/all',
        method: 'GET',
      }),
    }),
    markAlertSynced: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: 'customers/alerts/synced',
        method: 'PUT',
        body: { id },
      }),
    }),
    enable2FA: builder.mutation<any, { userId: string }>({
      query: (body) => ({
        url: 'users/enable-2fa',
        method: 'POST',
        body,
      }),
    }),
    disable2FA: builder.mutation<any, { userId: string }>({
      query: (body) => ({
        url: 'users/disable-2fa',
        method: 'POST',
        body,
      }),
    }),
    getUserProfile: builder.query<UserProfile, string>({
      query: (id) => ({
        url: `users/${id}`,
        method: 'GET',
      }),
    }),
    // Get staff users list (for super users to manage)
    getStaffUsers: builder.query<any[], void>({
      query: () => ({
        url: 'staff/users',
        method: 'GET',
      }),
      providesTags: ['Users'],
    }),
    registerCustomer: builder.mutation<{ message: string }, Partial<User>>({
  query: (body) => ({
    url: 'customers/register/',
    method: 'POST',
    body,
      }),
      invalidatesTags: [{ type: 'Customers', id: 'LIST' }],
    }),
    getTickets: builder.query<{ tickets: Ticket[] }, void>({
      query: () => 'tickets',
      providesTags: ['Tickets'],
    }),
    updateTicket: builder.mutation<Ticket, { id: number; data: Partial<Ticket> }>({
      query: ({ id, data }) => ({
        url: `tickets/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Tickets'],
    }),
    deleteTicket: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `tickets/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Tickets'],
    }),
    getRisks: builder.query<{ risks: RiskApi[] }, void>({
      query: () => 'risks',
      providesTags: ['Risks'],
    }),
    addRisk: builder.mutation<RiskApi, Partial<RiskApi>>({
      query: (body) => ({
        url: 'risks',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Risks'],
    }),
    updateRisk: builder.mutation<RiskApi, { id: number; data: Partial<RiskApi> }>({
      query: ({ id, data }) => ({
        url: `risks/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Risks'],
    }),
    deleteRisk: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `risks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Risks'],
    }),
  }),
});

export const publicApi = createApi({
  reducerPath: 'publicApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3003/api',
  }),
  endpoints: (builder) => ({
    getGpsPublic: builder.query<{ gps_data: Array<{ latitude: number; longitude: number; address: string }> }, string>({
      query: (serialNumber) => ({
        url: `customers/gps/${serialNumber}`,
        method: 'GET',
      }),
    }),
  }),
});

export const { useLoginMutation, useVerifyOtpMutation, useRefreshTokenMutation, useResetPasswordMutation, useForgotPasswordMutation, useGetCustomersQuery, useGetCustomerQuery, useUpdateCustomerMutation, useDeleteCustomerMutation, useGetCustomerVehiclesQuery, useGetSpeedQuery, useGetIgnitionQuery, useGetGpsQuery, useGetAlertsBySerialQuery, useGetAllAlertsQuery, useMarkAlertSyncedMutation, useEnable2FAMutation, useDisable2FAMutation, useGetUserProfileQuery, useRegisterCustomerMutation, useGetTicketsQuery, useUpdateTicketMutation, useDeleteTicketMutation, useGetRisksQuery, useAddRiskMutation, useUpdateRiskMutation, useDeleteRiskMutation, useGetStaffUsersQuery } = authApi;

export const { useGetGpsPublicQuery } = publicApi;
