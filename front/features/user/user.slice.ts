import { createSlice } from '@reduxjs/toolkit';
import { createUser, fetchUsers } from './user.thunks';
import type { User } from '@shared/types/user';

interface UserState {
  users: User[];
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
      .addCase(createUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users.push(action.payload);
      });
  },
});

export const userReducer = userSlice.reducer;
