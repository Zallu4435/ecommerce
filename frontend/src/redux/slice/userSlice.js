import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    token: null,
    avatar: null,
    username: null,
    isAuthenticated: false,
    otpToken: null,
    forgot_email: null,
  },
  reducers: {
    setCredentials: (state, action) => {
      const { user, accessToken, avatar, username } = action.payload;
      state.user = user;
      state.token = accessToken;
      state.isAuthenticated = true;
      state.avatar = avatar;
      state.username = username;
    },
    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.otpToken = null;
    },
    setGmailCredentials: (state) => {
      state.isAuthenticated = true;
    },
    setEmailOtpToken: (state, action) => {
      state.otpToken = action.payload;
    },
    setResetPassword: (state, action) => {
      state.resetToken = action.payload;
    },
    setForgotEmail: (state, action) => {
      state.forgot_email = action.payload;
    },
  },
});

export const {
  setCredentials,
  clearCredentials,
  setGmailCredentials,
  setEmailOtpToken,
  setResetPassword,
  setForgotEmail,
} = userSlice.actions;
export default userSlice.reducer;

export const selectCurrentUser = (state) => state.user.user;
export const selectCurrentToken = (state) => state.user.token;
