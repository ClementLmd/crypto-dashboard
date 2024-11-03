import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await fetch('http://localhost:3001/users');
  const fetchedUsers = await response.json();
  return fetchedUsers;
});

export const createUser = createAsyncThunk(
  'users/createUser',
  async (newUser: { firstname: string; lastname: string }) => {
    const response = await fetch('http://localhost:3001/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    });
    if (response.status !== 201) {
      throw new Error(`Error ${response.status}: ${await response.text()}`);
    }
    const savedUser = await response.json();
    return savedUser;
  },
);
