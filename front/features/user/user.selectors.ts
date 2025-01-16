import { RootState } from '../../redux/store';

export const selectUser = (state: RootState) => state.user.user;
export const selectIsAuthenticated = (state: RootState) => state.user.isAuthenticated;
export const selectUserIsLoading = (state: RootState) => state.user.isLoading;
