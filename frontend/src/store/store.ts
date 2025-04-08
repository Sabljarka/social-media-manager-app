import { configureStore } from '@reduxjs/toolkit';
import socialReducer from './slices/socialSlice';
import notificationReducer from './slices/notificationSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    social: socialReducer,
    notification: notificationReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 