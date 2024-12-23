import { combineReducers } from '@reduxjs/toolkit';
import userReducer from '../slice/userSlice';
import defaultReducer from './combineReducers';
import { userApiSlice } from '../apiSliceFeatures/userApiSlice';
import { adminApiSlice } from '../apiSliceFeatures/AdminApiSlice'
import adminReducer from '../slice/adminSlice'
import { addressPasswordApi } from '../apiSliceFeatures/addressPasswordApiSlice'
import { crudApiSlice } from '../apiSliceFeatures/crudApiSlice';
import { productApiSlice } from '../apiSliceFeatures/productApiSlice';
import { cartApi } from '../apiSliceFeatures/CartApiSlice'
import { wishlistApiSlice } from '../apiSliceFeatures/WishlistApiSlice';
import { comparisonApiSlice } from '../apiSliceFeatures/ComparisonApiSlice'

// Combine all reducers
const rootReducer = combineReducers({
  user: userReducer,
  admin: adminReducer,
  userApi: userApiSlice.reducer, 
  adminApi: adminApiSlice.reducer,
  crudApi: crudApiSlice.reducer,
  addressPasswordApi: addressPasswordApi.reducer,
  productApiSlice: productApiSlice.reducer,
  cartApi: cartApi.reducer,
  wishlistApi: wishlistApiSlice.reducer,
  comparisonApi: comparisonApiSlice.reducer,
  root: defaultReducer
});


// middleware
export const apiMiddleware = [
  userApiSlice.middleware,
  adminApiSlice.middleware,
  addressPasswordApi.middleware,
  crudApiSlice.middleware,
  productApiSlice.middleware,
  cartApi.middleware,
  wishlistApiSlice.middleware,
  comparisonApiSlice.middleware,
  ];


  export default rootReducer;
