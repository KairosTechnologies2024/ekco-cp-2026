import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface Risk {
  id: string;
  title: string;
  clientName: string;
  clientId: string;
  carModel: string;
  registration: string;
  contactNumber: string;
  riskType: string;
  description: string;
  status: 'pending' | 'done';
  createdAt: string;
  updatedAt: string;
  loggedBy: string;
  resolvedBy?: string;
}

interface RisksState {
  risks: Risk[];
}

const initialState: RisksState = {
  risks: [
    {
      id: '1',
      title: 'Possible Vehicle Theft',
      clientName: 'John Smith',
      clientId: '880301584208',
      carModel: '2022 Toyota Fortuner',
      registration: 'FH54YPGP',
      contactNumber: '0823456789',
      riskType: 'Hijacking Risk',
      description: 'Customer reported suspicious activity around vehicle. Multiple attempts to jam remote.',
      status: 'pending',
      createdAt: '2023-09-04T08:00:00Z',
      updatedAt: '2023-09-04T08:00:00Z',
      loggedBy: 'Wasim Shabally',
    },
    {
      id: '2',
      title: 'Unit Not Responding',
      clientName: 'Sarah Johnson',
      clientId: '920715362514',
      carModel: '2021 VW Golf GTI',
      registration: 'DRT546GP',
      contactNumber: '0761234567',
      riskType: 'Unit Not Updating',
      description: 'GPS unit not updating location for past 6 hours. No response from ping attempts.',
      status: 'pending',
      createdAt: '2023-09-03T15:30:00Z',
      updatedAt: '2023-09-03T15:30:00Z',
      loggedBy: 'Wasim Shabally',
    },
    {
      id: '3',
      title: 'Resolved: Fuel Cut Issue',
      clientName: 'Michael Brown',
      clientId: '850812459632',
      carModel: '2020 Ford Ranger',
      registration: 'CT789WC',
      contactNumber: '0832145698',
      riskType: 'Fuel Cut Not Responding',
      description: 'Fuel cut command was not executing. Issue resolved after unit reset.',
      status: 'done',
      createdAt: '2023-09-02T10:15:00Z',
      updatedAt: '2023-09-02T14:20:00Z',
      loggedBy: 'Wasim Shabally',
      resolvedBy: 'Alice Smith',
    },
  ],
};

const risksSlice = createSlice({
  name: 'risks',
  initialState,
  reducers: {
    setRisks: (state, action: PayloadAction<Risk[]>) => {
      state.risks = action.payload;
    },
    addRisk: (state, action: PayloadAction<Risk>) => {
      state.risks.push(action.payload);
    },
    updateRisk: (state, action: PayloadAction<{ id: string; updates: Partial<Risk> }>) => {
      const risk = state.risks.find(r => r.id === action.payload.id);
      if (risk) {
        Object.assign(risk, action.payload.updates);
      }
    },
    deleteRisk: (state, action: PayloadAction<string>) => {
      state.risks = state.risks.filter(r => r.id !== action.payload);
    },
  },
});

export const { setRisks, addRisk, updateRisk, deleteRisk } = risksSlice.actions;
export default risksSlice.reducer;
