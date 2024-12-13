import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await fetch('http://localhost:3001/users');
  const fetchedUsers = await response.json();
  return fetchedUsers;
});

export const createUser = createAsyncThunk(
  'users/createUser',
  async (newUser: { username: string; password: string }) => {
    const response = await fetch('http://localhost:3001/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    });
    if (response.status !== 201) {
      const userCreationFailed = await response.json();
      throw new Error(`Error ${response.status}: ${userCreationFailed.error}`);
    }
    const savedUser = await response.json();
    return savedUser;
  },
);
