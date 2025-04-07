import { configureStore } from '@reduxjs/toolkit';
import socialReducer from './features/socialSlice';
import authReducer from './store/slices/authSlice';

export const store = configureStore({
  reducer: {
    social: socialReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 