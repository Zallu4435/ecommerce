import { combineReducers } from '@reduxjs/toolkit'
import { userApiSlice } from '../apiSliceFeatures/userApiSlice'
import { addressPasswordApi } from '../apiSliceFeatures/address-passwordApiSlice'

// reducers
export const rootApiReducer = combineReducers({
    [userApiSlice.reducerPath]: userApiSlice.reducer,
    [addressPasswordApi.reducerPath]: addressPasswordApi.reducer,
});


// middleware
export const apiMiddleware = [
    userApiSlice.middleware,
    addressPasswordApi.middleware
];