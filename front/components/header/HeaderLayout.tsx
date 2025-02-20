import Link from 'next/link';
import styles from './headerLayout.module.css';
import Image from 'next/image';
import { routes } from '../../app/config/routes';
import DesktopNavBar from './DesktopNavBar';
import MobileNavBar from './MobileNavBar';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { Button } from '../ui/button';
import { logoutUser } from '../../features/user/user.slice';
import { useRouter } from 'next/navigation';
import { selectIsAuthenticated } from '../../features/user/user.selectors';
import { api } from '../../app/config/api';
import { logoutAddresses } from '../../features/addresses/addresses.slice';

export default function HeaderLayout() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [isBrowser, setIsBrowser] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  useEffect(() => {
    setIsBrowser(true);

    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 865);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(api.auth.signOut, {
        method: 'POST',
        credentials: 'include',
      });
      dispatch(logoutUser());
      dispatch(logoutAddresses());
      router.push(routes.home);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className={styles.body}>
      <div className={styles.headerLogo}>
        <Link href={routes.home}>
          <Image
            src="/favicon.ico"
            width={50}
            height={50}
            alt="logo"
            className={styles.image}
            priority
          />
        </Link>
      </div>
      <div className={styles.headerLinks}>
        {isBrowser && (isDesktop ? <DesktopNavBar /> : <MobileNavBar />)}
      </div>
      {isAuthenticated ? (
        <div className={styles.logoutButton}>
          <Button onClick={handleLogout}>Disconnect</Button>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}
