import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await fetch('http://localhost:3001/users');
  const fetchedUsers = await response.json();
  return fetchedUsers;
});

export const signUp = createAsyncThunk(
  'users/signup',
  async (newUser: { username: string; password: string }) => {
    const response = await fetch('http://localhost:3001/users/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    });
    if (response.status !== 201) {
      const userSignUpFailed = await response.json();
      throw new Error(`Error ${response.status}: ${userSignUpFailed.error}`);
    }
    const signedUpUser = await response.json();
    return signedUpUser;
  },
);

export const signIn = createAsyncThunk(
  'users/signin',
  async (signingInUser: { username: string; password: string }) => {
    const response = await fetch('http://localhost:3001/users/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(signingInUser),
    });
    if (response.status !== 200) {
      const userSignInFailed = await response.json();
      throw new Error(`Error ${response.status}: ${userSignInFailed.error}`);
    }
    const signedInUser = await response.json();
    return signedInUser;
  },
);
