import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../app/config/api';

export const signUp = createAsyncThunk(
  'users/signup',
  async (newUser: { username: string; password: string }) => {
    const response = await fetch(api.auth.signUp, {
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
    const response = await fetch(api.auth.signIn, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(signingInUser),
      credentials: 'include',
    });
    if (response.status !== 200) {
      const userSignInFailed = await response.json();
      throw new Error(`Error ${response.status}: ${userSignInFailed.error}`);
    }
    const signedInUser = await response.json();
    return signedInUser;
  },
);

export const checkSession = createAsyncThunk('users/checkSession', async () => {
  const response = await fetch(api.auth.checkSession, {
    credentials: 'include',
  });
  const data = await response.json();
  if (!response.ok) {
    throw data.error;
  }
  return data;
});
