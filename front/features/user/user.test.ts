import { configureStore } from '@reduxjs/toolkit';
import { userReducer } from './user.slice';
import { signUp, fetchUsers, signIn } from './user.thunks';
import { selectUsers } from './user.selectors';
import type { User } from '@shared/types/user';
import { errors } from '@shared/utils/errors';

describe('User slice', () => {
  const mockUsers: User[] = [
    { username: 'John', password: 'Doedoe1' },
    { username: 'Jane', password: 'Doedoe1' },
  ];

  const createTestStore = () =>
    configureStore({
      reducer: {
        users: userReducer,
      },
    });
  it('should fetch users list in redux store', async () => {
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
    const newUser: User = { username: 'Jack', password: 'Blackk1' };

    const mockFetch = jest.spyOn(global, 'fetch').mockResolvedValue({
      json: async () => newUser,
      status: 201,
    } as Response);

    const store = createTestStore();
    const usersBeforeAdd = selectUsers(store.getState());
    expect(usersBeforeAdd).toEqual([]);

    await store.dispatch(signUp(newUser));

    const usersAfterAdd = selectUsers(store.getState());
    expect(usersAfterAdd).toEqual([newUser]);

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/users/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    });

    mockFetch.mockRestore();
  });
  it('should not dispatch if status 400 is received', async () => {
    const emptyUser: User = { username: '', password: '' };

    const mockFetch = jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({ error: 'Missing or empty fields' }),
    } as Response);

    const store = createTestStore();
    await store.dispatch(signUp(emptyUser));

    const users = selectUsers(store.getState());
    expect(users).toEqual([]);

    mockFetch.mockRestore();
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

    mockFetch.mockRestore();
  });
  it('should not sign in user if wrong password', async () => {
    const userWithWrongPassword: User = {
      username: mockUsers[0].username,
      password: 'wrongPassword',
    };

    const mockFetch = jest.spyOn(global, 'fetch').mockResolvedValue({
      json: async () => ({ error: errors.users.wrongPassword }),
      status: 400,
    } as Response);

    const store = createTestStore();
    await store.dispatch(signIn(userWithWrongPassword));

    const users = selectUsers(store.getState());
    expect(users).toEqual([]);

    mockFetch.mockRestore();
  });
});
