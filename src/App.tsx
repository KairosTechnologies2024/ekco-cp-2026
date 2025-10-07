import { Route, Routes } from "react-router-dom";
import { Navigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

import AlertsPage from "./pages/alerts/alerts";
import Auth from "./components/auth/Auth";
import OtpVerification from "./components/auth/OtpVerification";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";
import CustomersPage from "./pages/customers/customers";
import CustomerList from "./components/customers/CustomerList";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import RequireAuth from './components/auth/RequireAuth';
import NotFound from "./components/404/NotFound";
import RegisterCustomer from "./pages/customers/register/RegisterCustomer";
import EditCustomerList from "./components/customers/EditCustomerList";
import DeleteCustomerList from "./components/customers/DeleteCustomerList";
import CustomerProfilePage from "./pages/customers/customer/customer";
import CustomerVehiclePage from "./pages/customers/customer/vehicle/vehicle";
import SplashScreen from "./components/SplashScreen";
import EditCustomer from "./pages/customers/edit/editCustomer";
import MobilizePage from "./pages/fuelcuts/mobilized/mobilized";
import FleetApprovalsPage from "./pages/fleets/fleetapprovals";
import FuelCutsPage from "./pages/fuelcuts/fuelcuts";
import ImmobilizePage from "./pages/fuelcuts/immobilized/immobilized";
import DevicesPage from "./pages/devices/devices";
import DeviceHealthPage from "./pages/devices/health/devicehealthpage";
import UnlikedDevicesPage from "./pages/devices/unliked/unlikeddevicespage";
import LinkedDevicesPage from "./pages/devices/linked/linkeddevicespage";
import TodosPage from "./pages/todos/todos";
import TodosRiskPage from "./pages/todos/risks/risks";
import TodosTicketsPage from "./pages/todos/tickets/tickets";
import TicketNotification from "./components/TicketNotification";
import RiskNotification from "./components/RiskNotification";
function App() {
  const [splashVisible, setSplashVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setSplashVisible(false), 1600);
    return () => clearTimeout(timer);
  }, []);

  if (splashVisible) return <SplashScreen />;

  return (
    <>
      <TicketNotification />
      <RiskNotification/>
      <Routes>
        <Route path="/" element={<Navigate to="/auth" />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/otp" element={<OtpVerification />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/dashboard" element={<Navigate to="/dashboard/alerts" />} />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <DashboardLayout />
            </RequireAuth>
          }
        >
          <Route path="alerts" element={<AlertsPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="customers/list" element={<CustomerList />} />
          <Route path="customers/register" element={<RegisterCustomer />} />
          <Route path="customers/edit" element={<EditCustomerList />} />
          <Route path="customers/edit/:id" element= {<EditCustomer/>} />
          <Route path="customers/delete" element={<DeleteCustomerList />} />
          <Route path="customers/profile/:id" element={<CustomerProfilePage />} />
          <Route path="customers/profile/:id/vehicle/:vehicleId" element={<CustomerVehiclePage />} />
          <Route path="fleet-approvals" element={<FleetApprovalsPage/>} />
          <Route path="fuel-cuts" element={<FuelCutsPage/>} />
          <Route path="fuel-cuts/mobilize" element={<MobilizePage/>} />
          <Route path="fuel-cuts/immobilize" element={<ImmobilizePage/>} />
          <Route path="devices" element={<DevicesPage />} />
          <Route path="devices/health" element={<DeviceHealthPage />} />
          <Route path="devices/unlinked" element={<UnlikedDevicesPage/>} />
          <Route path="devices/linked" element={<LinkedDevicesPage/>} />
          <Route path="todos" element= {<TodosPage/>} />
          <Route path="todos/risks" element= {<TodosRiskPage/>} />
          <Route path= "todos/tickets" element= {<TodosTicketsPage/>} />

        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      {/* 
      <Routes>
        <Route path="/" element={<Auth />} />
      </Routes>
      */}
    </>
  );
}

export default App;
