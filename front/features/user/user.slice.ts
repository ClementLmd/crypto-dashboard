import { createSlice } from '@reduxjs/toolkit';
import { signUp, fetchUsers, signIn } from './user.thunks';
import type { connectedUser } from '@shared/types/user';

interface UserState {
  users: connectedUser[];
  isLoading: boolean;
}

const initialState: UserState = {
  isLoading: false,
  users: [],
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
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
      });
  },
});

export const userReducer = userSlice.reducer;
