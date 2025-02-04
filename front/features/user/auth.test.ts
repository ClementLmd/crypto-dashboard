import { configureStore } from '@reduxjs/toolkit';
import { userReducer } from './user.slice';
import { checkSession } from './user.thunks';
import { errors } from 'shared';
import { api } from '../../app/config/api';

describe('Auth features', () => {
  const mockUser = { username: 'testuser' };

  const createTestStore = () =>
    configureStore({
      reducer: {
        user: userReducer,
      },
    });

  it('should restore session and store user in redux store', async () => {
    const mockFetch = jest.spyOn(global, 'fetch').mockResolvedValue({
      json: async () => ({ user: mockUser, authenticated: true }),
      ok: true,
      status: 200,
    } as Response);

    const store = createTestStore();
    await store.dispatch(checkSession());

    const state = store.getState();
    expect(state.user.userData).toEqual(mockUser);
    expect(state.user.isAuthenticated).toBe(true);
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(
      api.auth.checkSession,
      expect.objectContaining({
        credentials: 'include',
      }),
    );
    mockFetch.mockRestore();
  });

  it('should not restore invalid session', async () => {
    const mockFetch = jest.spyOn(global, 'fetch').mockResolvedValue({
      json: async () => ({ error: errors.session.invalidSession }),
      ok: false,
      status: 401,
    } as Response);

    const store = createTestStore();

    await expect(store.dispatch(checkSession()).unwrap()).rejects.toStrictEqual({
      message: errors.session.invalidSession,
    });

    const state = store.getState();
    expect(state.user.userData).toEqual(null);
    expect(state.user.isAuthenticated).toBe(false);
    mockFetch.mockRestore();
  });
});
