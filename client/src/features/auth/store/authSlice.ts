import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { IUser, IAuthTokens, IAuthState } from '../types/auth.types';

const initialState: IAuthState = {
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: IUser; tokens: IAuthTokens }>
    ) => {
      state.user = action.payload.user;
      state.tokens = action.payload.tokens;
      state.isAuthenticated = true;
      state.isLoading = false;
    },
    updateTokens: (state, action: PayloadAction<IAuthTokens>) => {
      state.tokens = action.payload;
    },
    updateUser: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.tokens = null;
      state.isAuthenticated = false;
      state.isLoading = false;
    },
  },
});

export const { setCredentials, updateTokens, updateUser, setLoading, logout } =
  authSlice.actions;
export default authSlice.reducer;
