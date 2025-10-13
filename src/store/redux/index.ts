import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import customersReducer from './customersSlice';
import alertsReducer from './alertsSlice';
import risksReducer from './risksSlice';
import ticketsReducer from './ticketsSlice';
import { authApi, publicApi } from '../../utils/api';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'user',
  storage,
  whitelist: ['user'],
};

const persistedUserReducer = persistReducer(persistConfig, userReducer);

const store = configureStore({
  reducer: {
    user: persistedUserReducer,
    customers: customersReducer,
    alerts: alertsReducer,
    risks: risksReducer,
    tickets: ticketsReducer,
    [authApi.reducerPath]: authApi.reducer,
    [publicApi.reducerPath]: publicApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({serializableCheck: false}).concat(authApi.middleware).concat(publicApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const persistor = persistStore(store);
export default store;
