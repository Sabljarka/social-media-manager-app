import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  user: {
    email: string;
    token: string;
  } | null;
}

// Učitavanje stanja iz localStorage-a
const loadState = (): AuthState => {
  const savedState = localStorage.getItem('authState');
  if (savedState) {
    return JSON.parse(savedState);
  }
  return {
    isAuthenticated: false,
    user: null,
  };
};

const initialState: AuthState = loadState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ email: string; token: string }>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      // Čuvanje stanja u localStorage
      localStorage.setItem('authState', JSON.stringify({
        isAuthenticated: true,
        user: action.payload,
      }));
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      // Brisanje stanja iz localStorage-a
      localStorage.removeItem('authState');
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer; 