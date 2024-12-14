import { combineReducers } from '@reduxjs/toolkit';
import userReducer from '../slice/userSlice';
import defaultReducer from './combineReducers';
import { userApiSlice } from '../apiSliceFeatures/userApiSlice';
import { addressPasswordApi } from '../apiSliceFeatures/address-passwordApiSlice'
import { crudApiSlice } from '../apiSliceFeatures/crudApiSlice';

// Combine all reducers
const rootReducer = combineReducers({
  user: userReducer,
  userApi: userApiSlice.reducer, 
  crudApi: crudApiSlice.reducer,
  addressPasswordApi: addressPasswordApi,
  root: defaultReducer
});


// middleware
export const apiMiddleware = [
  userApiSlice.middleware,
  addressPasswordApi.middleware,
  crudApiSlice.middleware
  ];


  export default rootReducer;
