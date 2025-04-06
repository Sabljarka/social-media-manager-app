import { configureStore } from '@reduxjs/toolkit';
import socialReducer from './slices/socialSlice';
import notificationReducer from './slices/notificationSlice';

export const store = configureStore({
  reducer: {
    social: socialReducer,
    notifications: notificationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 