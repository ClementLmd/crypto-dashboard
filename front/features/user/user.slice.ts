import { createSlice } from '@reduxjs/toolkit';
import { signUp, fetchUsers, signIn, signInWithSession } from './user.thunks';
import type { ConnectedUser } from '@shared/types/user';

interface UserState {
  users: ConnectedUser[];
  isLoading: boolean;
}

const initialState: UserState = {
  isLoading: false,
  users: [],
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.users = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
      })
      .addCase(signUp.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users.push(action.payload);
      })
      .addCase(signIn.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users.push(action.payload);
      })
      .addCase(signInWithSession.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signInWithSession.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = [action.payload];
      })
      .addCase(signInWithSession.rejected, (state) => {
        state.isLoading = false;
        state.users = [];
      });
  },
});

export const { logout } = userSlice.actions;
export const userReducer = userSlice.reducer;
