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
  tagTypes: ['Customers'],
  endpoints: (builder) => ({
    login: builder.mutation<{ user: any; accessToken: string; refreshToken: string }, { email: string; password: string }>({
      query: (credentials) => ({
        url: 'users/login',
        method: 'POST',
        body: credentials,
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
    getCustomerVehicles: builder.query<{ vehicles: Array<{ id: string; make: string; vehicle_model: string; year: string; package: string; device_serial: string }> }, string>({
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
  }),
});

export const { useLoginMutation, useRefreshTokenMutation, useResetPasswordMutation, useForgotPasswordMutation, useGetCustomersQuery, useGetCustomerQuery, useGetCustomerVehiclesQuery, useGetSpeedQuery, useGetIgnitionQuery, useGetGpsQuery, useGetAlertsBySerialQuery, useGetAllAlertsQuery, useMarkAlertSyncedMutation } = authApi;
