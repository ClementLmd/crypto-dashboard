'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { checkSession } from '../utils/auth/checkSession';
import { User } from '@shared/types/user';
import { useAppDispatch } from '../hooks/hooks';
import { signIn } from '../features/user/user.thunks';

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

  useEffect(() => {
    const initAuth = async () => {
      try {
        const userData = await checkSession();
        setUser(userData.user);
        setIsAuthenticated(true);
        // TODO : signin with good credentials
        dispatch(signIn(userData.user));
      } catch (error) {
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>; // Or your loading component
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
