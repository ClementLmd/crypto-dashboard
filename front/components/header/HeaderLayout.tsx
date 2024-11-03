import Link from 'next/link';
import styles from './headerLayout.module.css';
import Image from 'next/image';
import { routes } from '../../app/config/routes';
import DesktopNavBar from './DesktopNavBar';
import MobileNavBar from './MobileNavBar';
import { useEffect, useState } from 'react';

export default function HeaderLayout() {
  const [isBrowser, setIsBrowser] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

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
      <div className={styles.login}>Connexion</div>
    </div>
  );
}
