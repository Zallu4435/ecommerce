import { configureStore } from '@reduxjs/toolkit';
import { apiMiddleware } from '../reducers/combineAllReducers'
import { rootPersistReducer } from './persistor';
import persistStore from 'redux-persist/es/persistStore';

const store = configureStore({
  reducer: rootPersistReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(apiMiddleware),
});

// Create the persistor here
const persistedStore = persistStore(store);

export { store as default, persistedStore as persistor };

