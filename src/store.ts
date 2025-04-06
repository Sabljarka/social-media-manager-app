import { configureStore } from '@reduxjs/toolkit';
import socialReducer from './features/socialSlice';

export const store = configureStore({
  reducer: {
    social: socialReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 