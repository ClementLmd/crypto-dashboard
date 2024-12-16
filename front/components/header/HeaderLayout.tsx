import Link from 'next/link';
import styles from './headerLayout.module.css';
import Image from 'next/image';
import { routes } from '../../app/config/routes';
import DesktopNavBar from './DesktopNavBar';
import MobileNavBar from './MobileNavBar';
import { useEffect, useState } from 'react';
import { useAppSelector } from '../../hooks/hooks';

export default function HeaderLayout() {
  const [isBrowser, setIsBrowser] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  const connectedUser = useAppSelector((state) => state.users.users);

  useEffect(() => {
    setIsBrowser(true);

    const handleResize = () => {
      setIsDesktop(window.innerWidth > 865);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      {connectedUser.length > 0 ? (
        <div className={styles.login}>Username: {connectedUser[0].username}</div>
      ) : (
        <div className={styles.login}>Login</div>
      )}
    </div>
  );
}
