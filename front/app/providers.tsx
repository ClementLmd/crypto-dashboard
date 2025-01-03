'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@shared/types/user';
import { useAppDispatch } from '../hooks/hooks';
import { signInWithSession } from '../features/user/user.thunks';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const result = await dispatch(signInWithSession()).unwrap();
        setUser(result);
        setIsAuthenticated(true);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setUser(null);
        setIsAuthenticated(false);
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [dispatch, router]);

  if (loading) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
