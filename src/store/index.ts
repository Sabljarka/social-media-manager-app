import { configureStore } from '@reduxjs/toolkit';
import socialReducer from './slices/socialSlice';
import authReducer from './slices/authSlice';
import { AuthState } from '../types/user';
import { SocialState } from './slices/socialSlice';

export const store = configureStore({
  reducer: {
    social: socialReducer,
    auth: authReducer,
  },
});

export interface RootState {
  social: SocialState;
  auth: AuthState;
}

export type AppDispatch = typeof store.dispatch; 