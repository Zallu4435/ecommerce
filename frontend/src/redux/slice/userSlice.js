import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  accessToken: null,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.accessToken = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setAccessToken, logout } = userSlice.actions;
export default userSlice.reducer;
