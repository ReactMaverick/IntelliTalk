import { configureStore, combineReducers } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistStore, persistReducer } from 'reduxjs-toolkit-persist';
import authReducer from './reducers/authReducer';
import conversationReducer from './reducers/conversationReducer';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};
const rootReducer = combineReducers({
  authReducer: persistReducer(persistConfig, authReducer),
  conversationReducer: persistReducer(persistConfig, conversationReducer),
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
export const persistor = persistStore(store);