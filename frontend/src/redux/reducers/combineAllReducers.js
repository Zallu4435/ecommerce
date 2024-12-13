import { combineReducers } from '@reduxjs/toolkit';
import userReducer from '../slice/userSlice';
import { rootApiReducer } from './combineApiReducers'; 
import defaultReducer from './combineReducers';

// Combine all reducers
const rootReducer = combineReducers({
  user: userReducer,
  api: rootApiReducer,
  root: defaultReducer
});

export default rootReducer;
