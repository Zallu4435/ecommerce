import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    token: null,
    isAuthenticated: false,
  },
  reducers: {
    setCredentials: (state, action) => {
      const { user, accessToken } = action.payload;
      state.user = user;
      state.token = accessToken;
      state.isAuthenticated = true;
    },
    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    setGmailCredentials: (state) => {
      state.isAuthenticated = true
    }
  },
});

export const { setCredentials, clearCredentials, setGmailCredentials } = userSlice.actions;
export default userSlice.reducer;

export const selectCurrentUser = (state) => state.user.user;
export const selectCurrentToken = (state) => state.user.token;

