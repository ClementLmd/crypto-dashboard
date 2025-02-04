import { createSlice } from '@reduxjs/toolkit';
import { signUp, signIn, checkSession } from './user.thunks';
import { ConnectedUser } from 'shared';

interface UserState {
  userData: ConnectedUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  userData: null,
  isLoading: false,
  isAuthenticated: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.userData = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUp.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userData = action.payload.user;
        state.isAuthenticated = action.payload.authenticated;
      })
      .addCase(signIn.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userData = action.payload.user;
        state.isAuthenticated = action.payload.authenticated;
      })
      .addCase(checkSession.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkSession.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = action.payload.authenticated;
        if (action.payload.user) {
          state.userData = action.payload.user;
        }
      })
      .addCase(checkSession.rejected, (state) => {
        state.isLoading = false;
        state.userData = null;
        state.isAuthenticated = false;
      });
  },
});

export const { logout } = userSlice.actions;
export const userReducer = userSlice.reducer;
