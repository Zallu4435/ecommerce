import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "../slice/userSlice";
import defaultReducer from "./combineReducers";
import { userApiSlice } from "../apiSliceFeatures/userApiSlice";
import { adminApiSlice } from "../apiSliceFeatures/AdminApiSlice";
import adminReducer from "../slice/adminSlice";
import { userProfileApi } from "../apiSliceFeatures/userProfileApi";
import { crudApiSlice } from "../apiSliceFeatures/crudApiSlice";
import { productApiSlice } from "../apiSliceFeatures/productApiSlice";
import { unifiedApiSlice } from "../apiSliceFeatures/unifiedApiSlice";
import { salesApiSlice } from "../apiSliceFeatures/SalesApiSlice";
import { walletApiSlice } from "../apiSliceFeatures/WalletApiSlice";

import { orderApiSlice } from "../apiSliceFeatures/OrderApiSlice";

const rootReducer = combineReducers({
  user: userReducer,
  admin: adminReducer,
  userApi: userApiSlice.reducer,
  adminApi: adminApiSlice.reducer,
  crudApi: crudApiSlice.reducer,
  userProfileApi: userProfileApi.reducer,
  productApiSlice: productApiSlice.reducer,
  unifiedApi: unifiedApiSlice.reducer,
  salesApi: salesApiSlice.reducer,
  walletApi: walletApiSlice.reducer,
  // reviewApi: reviewApi.reducer, // Removed as it is now part of crudApiSlice
  orderApiSlice: orderApiSlice.reducer,
  root: defaultReducer,
});

export const apiMiddleware = [
  userApiSlice.middleware,
  adminApiSlice.middleware,
  userProfileApi.middleware,
  crudApiSlice.middleware,
  productApiSlice.middleware,
  unifiedApiSlice.middleware,
  salesApiSlice.middleware,
  walletApiSlice.middleware,
  // reviewApi.middleware, // Removed
  orderApiSlice.middleware
];

export default rootReducer;
