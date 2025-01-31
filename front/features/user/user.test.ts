import { configureStore } from '@reduxjs/toolkit';
import { logout, userReducer } from './user.slice';
import { signUp, signIn } from './user.thunks';
import { selectIsAuthenticated, selectUser } from './user.selectors';
import { SigningUpUser } from 'shared';
import { addressReducer } from '../addresses/addresses.slice';
import { api } from '../../app/config/api';

describe('User slice', () => {
  const mockUsers: SigningUpUser[] = [
    { username: 'John', password: 'Doedoe1' },
    { username: 'Jane', password: 'Doedoe1' },
  ];

  const createTestStore = () =>
    configureStore({
      reducer: {
        user: userReducer,
        addresses: addressReducer,
      },
    });
  it('should create a new user in database and store it in redux store', async () => {
    const newUser: SigningUpUser = { username: 'Jack', password: 'Blackk1' };

    // TODO : delete user from db before starting these tests
    const mockFetch = jest.spyOn(global, 'fetch').mockResolvedValue({
      json: async () => ({ user: { username: newUser.username }, authenticated: true }),
      status: 201,
    } as Response);

    const store = createTestStore();
    const userBeforeAdd = selectUser(store.getState());
    expect(userBeforeAdd).toEqual(null);

    await store.dispatch(signUp(newUser));

    const userAfterAdd = selectUser(store.getState());
    expect(userAfterAdd).toEqual({ username: newUser.username });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(api.auth.signUp, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    });

    mockFetch.mockRestore();
  });
  it('should not dispatch if status 400 is received', async () => {
    const emptyUser: SigningUpUser = { username: '', password: '' };

    const store = createTestStore();
    await store.dispatch(signUp(emptyUser));

    const user = selectUser(store.getState());
    expect(user).toEqual(null);
  });

  it('should sign in user', async () => {
    const signedInUser = { username: mockUsers[0].username };

    const mockFetch = jest.spyOn(global, 'fetch').mockResolvedValue({
      json: async () => ({ user: signedInUser, authenticated: true }),
      status: 200,
    } as Response);

    const store = createTestStore();
    await store.dispatch(signIn(mockUsers[0]));

    const user = selectUser(store.getState());
    expect(user).toEqual({ username: signedInUser.username });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    mockFetch.mockRestore();
  });
  it('should not sign in user if wrong password', async () => {
    const userWithWrongPassword: SigningUpUser = { ...mockUsers[0], password: 'wrongPassword' };

    const store = createTestStore();
    await store.dispatch(signIn(userWithWrongPassword));

    const user = selectUser(store.getState());
    expect(user).toEqual(null);
  });
  it('should disconnect user when clicking disconnect', async () => {
    const signedInUser = { username: mockUsers[0].username };

    const mockFetch = jest.spyOn(global, 'fetch').mockResolvedValue({
      json: async () => ({ user: signedInUser, authenticated: true }),
      status: 200,
    } as Response);

    const store = createTestStore();
    await store.dispatch(signIn(mockUsers[0]));

    const isAuthenticated = selectIsAuthenticated(store.getState());
    const user = selectUser(store.getState());
    expect(user).toEqual({ username: signedInUser.username });
    expect(isAuthenticated).toBe(true);

    store.dispatch(logout());

    const isAuthenticatedAfterLogout = selectIsAuthenticated(store.getState());
    const userAfterLogout = selectUser(store.getState());
    expect(userAfterLogout).toEqual(null);
    expect(isAuthenticatedAfterLogout).toBe(false);

    expect(mockFetch).toHaveBeenCalledTimes(1);
    mockFetch.mockRestore();
  });
});
