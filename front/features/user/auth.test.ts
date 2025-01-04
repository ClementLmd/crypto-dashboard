import { configureStore } from '@reduxjs/toolkit';
import { userReducer } from '../user/user.slice';
import { signInWithSession } from '../user/user.thunks';
import { errors } from '@shared/utils/errors';

describe('Auth features', () => {
  const mockUser = { username: 'testuser' };

  const createTestStore = () =>
    configureStore({
      reducer: {
        users: userReducer,
      },
    });

  it('should restore session and store user in redux store', async () => {
    const mockFetch = jest.spyOn(global, 'fetch').mockResolvedValue({
      json: async () => ({ user: mockUser }),
      ok: true,
      status: 200,
    } as Response);

    const store = createTestStore();
    await store.dispatch(signInWithSession());

    const state = store.getState();
    expect(state.users.users).toEqual([mockUser]);

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:3001/auth/check',
      expect.objectContaining({
        credentials: 'include',
      }),
    );
    mockFetch.mockRestore();
  });

  it('should not restore invalid session', async () => {
    const mockFetch = jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      status: 401,
    } as Response);

    const store = createTestStore();

    await expect(store.dispatch(signInWithSession()).unwrap()).rejects.toMatchObject({
      message: errors.session.invalidSession,
    });

    const state = store.getState();
    expect(state.users.users).toEqual([]);

    mockFetch.mockRestore();
  });
});
