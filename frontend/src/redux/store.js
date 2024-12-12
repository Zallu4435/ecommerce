import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers//combineReducers';
import { rootApiReducer, apiMiddleware } from './reducers/combineApiReducers';

const store = configureStore({
  reducer: {
    root: rootReducer, 
    api: rootApiReducer, 
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiMiddleware),
});

export default store;
