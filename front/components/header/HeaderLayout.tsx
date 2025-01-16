import Link from 'next/link';
import styles from './headerLayout.module.css';
import Image from 'next/image';
import { routes } from '../../app/config/routes';
import DesktopNavBar from './DesktopNavBar';
import MobileNavBar from './MobileNavBar';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '../../hooks/hooks';
import { Button } from '../ui/button';
import { logout } from '../../features/user/user.slice';
import { useRouter } from 'next/navigation';
import { selectUser } from '../../features/user/user.selectors';
import { store } from '../../redux/store';

export default function HeaderLayout() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [isBrowser, setIsBrowser] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  const connectedUser = selectUser(store.getState());

  useEffect(() => {
    setIsBrowser(true);

    const handleResize = () => {
      setIsDesktop(window.innerWidth > 865);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:3001/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      dispatch(logout());
      router.push(routes.home);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className={styles.body}>
      <div id="headerLogo">
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
      <div id="headerLinks">{isBrowser && (isDesktop ? <DesktopNavBar /> : <MobileNavBar />)} </div>
      {connectedUser ? <Button onClick={handleLogout}>Disconnect</Button> : <div></div>}
    </div>
  );
}
