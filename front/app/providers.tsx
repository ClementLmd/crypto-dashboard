'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/hooks';
import { signInWithSession } from '../features/user/user.thunks';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.users.isLoading);

  useEffect(() => {
    dispatch(signInWithSession());
  }, [dispatch]);

  if (isLoading) {
    return null;
  }

  return <>{children}</>;
};
