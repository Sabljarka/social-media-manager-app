import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  user: {
    id: string;
    name: string;
    email: string;
    picture?: string;
  } | null;
  facebookToken: string | null;
  instagramToken: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  facebookToken: null,
  instagramToken: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    loginSuccess: (state, action: PayloadAction<{
      user: AuthState['user'];
      facebookToken?: string;
      instagramToken?: string;
    }>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      if (action.payload.facebookToken) {
        state.facebookToken = action.payload.facebookToken;
      }
      if (action.payload.instagramToken) {
        state.instagramToken = action.payload.instagramToken;
      }
      state.error = null;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.facebookToken = null;
      state.instagramToken = null;
    },
    setFacebookToken: (state, action: PayloadAction<string>) => {
      state.facebookToken = action.payload;
    },
    setInstagramToken: (state, action: PayloadAction<string>) => {
      state.instagramToken = action.payload;
    },
  },
});

export const {
  setLoading,
  setError,
  loginSuccess,
  logout,
  setFacebookToken,
  setInstagramToken,
} = authSlice.actions;

export default authSlice.reducer; 