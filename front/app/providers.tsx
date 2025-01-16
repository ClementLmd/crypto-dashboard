'use client';

import { useAppDispatch, useAppSelector } from '../hooks/hooks';
import { checkSession } from '../features/user/user.thunks';
import { useEffect, useRef } from 'react';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.user.isLoading);
  const didInit = useRef(false);

  useEffect(() => {
    if (!didInit.current) {
      didInit.current = true;
      dispatch(checkSession());
    }
  }, [dispatch]);

  if (isLoading) {
    return null;
  }

  return <>{children}</>;
};
