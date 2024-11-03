import { RootState } from '../../redux/store';

export const selectUsers = (state: RootState) => state.users.users;
export const selectUserIsLoading = (state: RootState) => state.users.isLoading;
