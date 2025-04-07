import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Comment {
  id: string;
  postId: string;
  author: string;
  authorPicture?: string;
  content: string;
  timestamp: string;
  isHidden: boolean;
  replies: Comment[];
  likes: number;
}

export interface Post {
  id: string;
  pageId: string;
  content: string;
  mediaUrl?: string;
  timestamp: string;
  likes: number;
  shares: number;
  comments: Comment[];
  isPublished: boolean;
}

export interface FacebookPage {
  id: string;
  name: string;
  accessToken: string;
  posts: Post[];
  followers: number;
  isActive: boolean;
}

export interface InstagramAccount {
  id: string;
  username: string;
  accessToken: string;
  posts: Post[];
  followers: number;
  isActive: boolean;
}

export interface SocialState {
  facebookPages: FacebookPage[];
  instagramAccounts: InstagramAccount[];
  selectedPage: string | null;
  selectedAccount: string | null;
  loading: boolean;
  error: string | null;
}

export const initialState: SocialState = {
  facebookPages: [],
  instagramAccounts: [],
  selectedPage: null,
  selectedAccount: null,
  loading: false,
  error: null,
};

const socialSlice = createSlice({
  name: 'social',
  initialState,
  reducers: {
    setFacebookPages: (state, action: PayloadAction<FacebookPage[]>) => {
      state.facebookPages = action.payload;
    },
    addFacebookPage: (state, action: PayloadAction<FacebookPage>) => {
      state.facebookPages.push(action.payload);
    },
    removeFacebookPage: (state, action: PayloadAction<string>) => {
      state.facebookPages = state.facebookPages.filter(page => page.id !== action.payload);
    },
    updateFacebookPage: (state, action: PayloadAction<FacebookPage>) => {
      const index = state.facebookPages.findIndex(page => page.id === action.payload.id);
      if (index !== -1) {
        state.facebookPages[index] = action.payload;
      }
    },
    setPosts: (state, action: PayloadAction<{ pageId: string; posts: Post[] }>) => {
      const { pageId, posts } = action.payload;
      const pageIndex = state.facebookPages.findIndex(page => page.id === pageId);
      if (pageIndex !== -1) {
        state.facebookPages[pageIndex].posts = posts;
      }
    },
    addPost: (state, action: PayloadAction<{ pageId: string; post: Post }>) => {
      const { pageId, post } = action.payload;
      const pageIndex = state.facebookPages.findIndex(page => page.id === pageId);
      if (pageIndex !== -1) {
        state.facebookPages[pageIndex].posts.push(post);
      }
    },
    updatePost: (state, action: PayloadAction<{ pageId: string; post: Post }>) => {
      const page = state.facebookPages.find(p => p.id === action.payload.pageId);
      if (page) {
        const index = page.posts.findIndex(p => p.id === action.payload.post.id);
        if (index !== -1) {
          page.posts[index] = action.payload.post;
        }
      }
    },
    deletePost: (state, action: PayloadAction<{ pageId: string; postId: string }>) => {
      const page = state.facebookPages.find(p => p.id === action.payload.pageId);
      if (page) {
        page.posts = page.posts.filter(p => p.id !== action.payload.postId);
      }
    },
    addComment: (state, action: PayloadAction<{ pageId: string; postId: string; comment: Comment }>) => {
      const { pageId, postId, comment } = action.payload;
      const pageIndex = state.facebookPages.findIndex(page => page.id === pageId);
      if (pageIndex !== -1) {
        const postIndex = state.facebookPages[pageIndex].posts.findIndex(post => post.id === postId);
        if (postIndex !== -1) {
          state.facebookPages[pageIndex].posts[postIndex].comments.push(comment);
        }
      }
    },
    updateComment: (state, action: PayloadAction<{ pageId: string; postId: string; comment: Comment }>) => {
      const page = state.facebookPages.find(p => p.id === action.payload.pageId);
      if (page) {
        const post = page.posts.find(p => p.id === action.payload.postId);
        if (post) {
          const index = post.comments.findIndex(c => c.id === action.payload.comment.id);
          if (index !== -1) {
            post.comments[index] = action.payload.comment;
          }
        }
      }
    },
    deleteComment: (state, action: PayloadAction<{ pageId: string; postId: string; commentId: string }>) => {
      const page = state.facebookPages.find(p => p.id === action.payload.pageId);
      if (page) {
        const post = page.posts.find(p => p.id === action.payload.postId);
        if (post) {
          post.comments = post.comments.filter(c => c.id !== action.payload.commentId);
        }
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setInstagramAccounts: (state, action: PayloadAction<InstagramAccount[]>) => {
      state.instagramAccounts = action.payload;
    },
    addInstagramAccount: (state, action: PayloadAction<InstagramAccount>) => {
      state.instagramAccounts.push(action.payload);
    },
    removeInstagramAccount: (state, action: PayloadAction<string>) => {
      state.instagramAccounts = state.instagramAccounts.filter(account => account.id !== action.payload);
    },
    updateInstagramAccount: (state, action: PayloadAction<InstagramAccount>) => {
      const index = state.instagramAccounts.findIndex(account => account.id === action.payload.id);
      if (index !== -1) {
        state.instagramAccounts[index] = action.payload;
      }
    },
    setSelectedPage: (state, action: PayloadAction<string | null>) => {
      state.selectedPage = action.payload;
    },
    setSelectedAccount: (state, action: PayloadAction<string | null>) => {
      state.selectedAccount = action.payload;
    },
  },
});

export const {
  setFacebookPages,
  addFacebookPage,
  removeFacebookPage,
  updateFacebookPage,
  setPosts,
  addPost,
  updatePost,
  deletePost,
  addComment,
  updateComment,
  deleteComment,
  setLoading,
  setError,
  setInstagramAccounts,
  addInstagramAccount,
  removeInstagramAccount,
  updateInstagramAccount,
  setSelectedPage,
  setSelectedAccount,
} = socialSlice.actions;

export default socialSlice.reducer; 