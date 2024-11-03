import { createSlice } from '@reduxjs/toolkit';
import { createUser, fetchUsers } from './user.thunks';

interface UserState {
  users: {
    firstname: string;
    lastname: string;
  }[];
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
