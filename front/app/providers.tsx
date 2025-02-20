import { useAppDispatch, useAppSelector } from '../hooks/hooks';
import { checkSession } from '../features/user/user.thunks';
import { useEffect, useRef } from 'react';
import { Loader } from '../components/ui/loader';

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
    return (
      <Loader
        text="Note: The backend is hosted on Render.com{`'`}s free tier. You may experience delays or
          need to refresh the page."
      />
    );
  }

  return <>{children}</>;
};
