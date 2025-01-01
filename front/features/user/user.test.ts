import { configureStore } from '@reduxjs/toolkit';
import { logout, userReducer } from './user.slice';
import { signUp, fetchUsers, signIn } from './user.thunks';
import { selectUsers } from './user.selectors';
import type { SigningUpUser } from '@shared/types/user';
import { addressReducer } from '../addresses/addresses.slice';

describe('User slice', () => {
  const mockUsers: SigningUpUser[] = [
    { username: 'John', password: 'Doedoe1' },
    { username: 'Jane', password: 'Doedoe1' },
  ];

  const createTestStore = () =>
    configureStore({
      reducer: {
        users: userReducer,
        addresses: addressReducer,
      },
    });
  it('should fetch users list in redux store', async () => {
    // TODO : modify tests order so users added can be fetched
    const mockFetch = jest.spyOn(global, 'fetch').mockResolvedValue({
      json: async () => mockUsers,
    } as Response);

    const store = createTestStore();

    await store.dispatch(fetchUsers());

    const users = selectUsers(store.getState());
    expect(users).toEqual(mockUsers);

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/users');

    mockFetch.mockRestore();
  });
  it('should create a new user in database and store it in redux store', async () => {
    const newUser: SigningUpUser = { username: 'Jack', password: 'Blackk1' };

    // TODO : delete user from db before starting these tests
    const mockFetch = jest.spyOn(global, 'fetch').mockResolvedValue({
      json: async () => await { username: newUser.username },
      status: 201,
    } as Response);

    const store = createTestStore();
    const usersBeforeAdd = selectUsers(store.getState());
    expect(usersBeforeAdd).toEqual([]);

    await store.dispatch(signUp(newUser));

    const usersAfterAdd = await selectUsers(store.getState());
    expect(usersAfterAdd).toEqual([{ username: newUser.username }]);

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/users/signup', {
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

    const users = selectUsers(store.getState());
    expect(users).toEqual([]);
  });

  it('should sign in user', async () => {
    const signedInUser = { username: mockUsers[0].username };

    const mockFetch = jest.spyOn(global, 'fetch').mockResolvedValue({
      json: async () => await signedInUser,
      status: 200,
    } as Response);

    const store = createTestStore();
    await store.dispatch(signIn(mockUsers[0]));

    const users = selectUsers(store.getState());
    expect(users).toEqual([signedInUser]);

    expect(mockFetch).toHaveBeenCalledTimes(1);
    mockFetch.mockRestore();
  });
  it('should not sign in user if wrong password', async () => {
    const userWithWrongPassword: SigningUpUser = { ...mockUsers[0], password: 'wrongPassword' };

    const store = createTestStore();
    await store.dispatch(signIn(userWithWrongPassword));

    const users = selectUsers(store.getState());
    expect(users).toEqual([]);
  });
  it('should disconnect user when clicking disconnect', async () => {
    const signedInUser = { username: mockUsers[0].username };

    const mockFetch = jest.spyOn(global, 'fetch').mockResolvedValue({
      json: async () => await signedInUser,
      status: 200,
    } as Response);

    const store = createTestStore();
    await store.dispatch(signIn(mockUsers[0]));

    const users = selectUsers(store.getState());
    expect(users).toEqual([signedInUser]);

    await store.dispatch(logout());
    const usersAfterLogout = selectUsers(store.getState());
    expect(usersAfterLogout).toEqual([]);

    expect(mockFetch).toHaveBeenCalledTimes(1);
    mockFetch.mockRestore();
  });
});
