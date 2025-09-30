import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  user: null | {
    id: string;
    email: string;
    name?: string;
    user_type: string;
  };
}

const initialState: UserState = {
  user: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserState['user']>) {
      state.user = action.payload;
    },
    logout(state) {
      state.user = null;
    },
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
