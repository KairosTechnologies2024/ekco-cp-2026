import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface Ticket {
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
  loggedby: string;
  resolvedby: string | null;
  user_id: number;
  customer_id: number;
  user_email: string;
  user_type: string;
  first_name: string;
  last_name: string;
  phone_number: string;
}

interface TicketsState {
  tickets: Ticket[];
}

const initialState: TicketsState = {
  tickets: [],
};

const ticketsSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    setTickets: (state, action: PayloadAction<Ticket[]>) => {
      state.tickets = action.payload;
    },
    addTicket: (state, action: PayloadAction<Ticket>) => {
      state.tickets.push(action.payload);
    },
    updateTicket: (state, action: PayloadAction<{ id: number; updates: Partial<Ticket> }>) => {
      const ticket = state.tickets.find(t => t.id === action.payload.id);
      if (ticket) {
        Object.assign(ticket, action.payload.updates);
      }
    },
    deleteTicket: (state, action: PayloadAction<number>) => {
      state.tickets = state.tickets.filter(t => t.id !== action.payload);
    },
  },
});

export const { setTickets, addTicket, updateTicket, deleteTicket } = ticketsSlice.actions;
export default ticketsSlice.reducer;
