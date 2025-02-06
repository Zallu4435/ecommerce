import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "../slice/userSlice";
import defaultReducer from "./combineReducers";
import { userApiSlice } from "../apiSliceFeatures/userApiSlice";
import { adminApiSlice } from "../apiSliceFeatures/AdminApiSlice";
import adminReducer from "../slice/adminSlice";
import { userProfileApi } from "../apiSliceFeatures/userProfileApi";
import { crudApiSlice } from "../apiSliceFeatures/crudApiSlice";
import { productApiSlice } from "../apiSliceFeatures/productApiSlice";
import { cartApi } from "../apiSliceFeatures/CartApiSlice";
import { wishlistApiSlice } from "../apiSliceFeatures/WishlistApiSlice";
import { comparisonApiSlice } from "../apiSliceFeatures/ComparisonApiSlice";
import { salesApiSlice } from "../apiSliceFeatures/SalesApiSlice";
import { walletApiSlice } from "../apiSliceFeatures/WalletApiSlice";
import { reviewApi } from "../apiSliceFeatures/ReviewApiSlice";
import { orderApiSlice } from "../apiSliceFeatures/OrderApiSlice";

const rootReducer = combineReducers({
  user: userReducer,
  admin: adminReducer,
  userApi: userApiSlice.reducer,
  adminApi: adminApiSlice.reducer,
  crudApi: crudApiSlice.reducer,
  userProfileApi: userProfileApi.reducer,
  productApiSlice: productApiSlice.reducer,
  cartApi: cartApi.reducer,
  wishlistApi: wishlistApiSlice.reducer,
  salesApi: salesApiSlice.reducer,
  comparisonApi: comparisonApiSlice.reducer,
  walletApi: walletApiSlice.reducer,
  reviewApi: reviewApi.reducer,
  orderApiSlice: orderApiSlice.reducer,
  root: defaultReducer,
});

export const apiMiddleware = [
  userApiSlice.middleware,
  adminApiSlice.middleware,
  userProfileApi.middleware,
  crudApiSlice.middleware,
  productApiSlice.middleware,
  cartApi.middleware,
  wishlistApiSlice.middleware,
  comparisonApiSlice.middleware,
  salesApiSlice.middleware,
  walletApiSlice.middleware,
  reviewApi.middleware,
  orderApiSlice.middleware
];

export default rootReducer;
