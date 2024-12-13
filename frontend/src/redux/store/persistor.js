import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { encryptTransform } from 'redux-persist-transform-encrypt';
import rootReducer from '../reducers/combineAllReducers';

// Create the encryptor instance with your secret key
const encryptor = encryptTransform({
  secretKey: 'your-secret-key',
  onError: (error) => {
    console.error('Encryption error', error);
  }
});

// Persist configuration
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user'], 
  transforms: [encryptor],
};

// Create the persisted reducer
const rootPersistReducer = persistReducer(persistConfig, rootReducer);


export { rootPersistReducer };

