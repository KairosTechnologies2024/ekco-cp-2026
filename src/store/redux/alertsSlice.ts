import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface Alert {
  id: string;
  alertType: string;
  vehicle_model: string;
  plate: string;
  time: string;
  first_name: string;
  last_name: string;
  id_number: string;
  phone_number: string;
  next_of_kin: string;
  next_of_kin_number: string;
  user_id: string;
  synced: boolean;
}

interface AlertsState {
  alerts: Alert[];
}

const initialState: AlertsState = {
  alerts: [],
};

const alertsSlice = createSlice({
  name: 'alerts',
  initialState,
  reducers: {
    setAlerts: (state, action: PayloadAction<Alert[]>) => {
      state.alerts = action.payload;
    },
    addAlert: (state, action: PayloadAction<Alert>) => {
      state.alerts.unshift(action.payload); // Add to top
    },
    clearAlerts: (state) => {
      state.alerts = [];
    },
    updateAlertSynced: (state, action: PayloadAction<{ id: string; synced: boolean }>) => {
      const alert = state.alerts.find(a => a.id === action.payload.id);
      if (alert) {
        alert.synced = action.payload.synced;
      }
    },
  },
});

export const { setAlerts, addAlert, clearAlerts, updateAlertSynced } = alertsSlice.actions;
export default alertsSlice.reducer;
