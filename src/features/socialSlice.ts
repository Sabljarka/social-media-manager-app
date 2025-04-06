import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SocialState {
  facebookPages: any[];
  instagramAccounts: any[];
  selectedAccount: string | null;
  posts: any[];
  comments: any[];
  notifications: any[];
}

const initialState: SocialState = {
  facebookPages: [],
  instagramAccounts: [],
  selectedAccount: null,
  posts: [],
  comments: [],
  notifications: [],
};

const socialSlice = createSlice({
  name: 'social',
  initialState,
  reducers: {
    setFacebookPages: (state, action: PayloadAction<any[]>) => {
      state.facebookPages = action.payload;
    },
    setInstagramAccounts: (state, action: PayloadAction<any[]>) => {
      state.instagramAccounts = action.payload;
    },
    setSelectedAccount: (state, action: PayloadAction<string | null>) => {
      state.selectedAccount = action.payload;
    },
    setPosts: (state, action: PayloadAction<any[]>) => {
      state.posts = action.payload;
    },
    setComments: (state, action: PayloadAction<any[]>) => {
      state.comments = action.payload;
    },
    setNotifications: (state, action: PayloadAction<any[]>) => {
      state.notifications = action.payload;
    },
  },
});

export const {
  setFacebookPages,
  setInstagramAccounts,
  setSelectedAccount,
  setPosts,
  setComments,
  setNotifications,
} = socialSlice.actions;

export default socialSlice.reducer; 