import { createSlice } from "@reduxjs/toolkit";

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    admin: null,
    adminToken: null,
    isAdminAuthenticated: false,
  },
  reducers: {
    setAdminCredentials: (state, action) => {
      const { admin, adminAccessToken } = action.payload;
      state.admin = admin;
      state.adminToken = adminAccessToken;
      state.isAdminAuthenticated = true;
    },
    clearAdminCredentials: (state) => {
      state.admin = null;
      state.adminToken = null;
      state.isAdminAuthenticated = false;
    },
  },
});

export const { setAdminCredentials, clearAdminCredentials } =
  adminSlice.actions;
export default adminSlice.reducer;

export const selectCurrentAdmin = (state) => state.admin.admin;
export const selectCurrentAdminToken = (state) => state.admin.adminToken;
