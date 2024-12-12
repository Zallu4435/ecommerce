import { createSlice } from '@reduxjs/toolkit';
import { loadUser } from '../actions/user';

const initialState = {
    isAuthenticated: false,
    loading: false,
    user: null, 
    error: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        clearErrors: (state) => {
            state.error = null
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(loadUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(loadUser.fulfilled, (state, action) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload;
        })
        .addCase(loadUser.rejected, (state, action) => {
            state.loading = false;
            state.isAuthenticated = false;
            state.error = action.payload;
        });
    },
});

export const { clearErrors } = userSlice.actions;
export const userReducer = userSlice.reducer;