import Link from 'next/link';
import { isMenuItemActive } from '../../utils/isMenuItemActive';
import styles from './desktopNavBar.module.css';
import { usePathname } from 'next/navigation';
import { routes } from '../../app/config/routes';

export default function DesktopNavBar() {
  const pathname = usePathname();

  return (
    <div id="desktopHeader">
      <ul className={styles.links}>
        <li>
          <Link
            className={`${styles.title} ${isMenuItemActive(routes.home, pathname) ? styles.activeItem : ''}`}
            href={routes.home}
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            className={`${styles.title} ${isMenuItemActive(routes.database.index, pathname) ? styles.activeItem : ''}`}
            href={routes.database.index}
          >
            Database
          </Link>
        </li>
        <li>
          <Link
            className={`${styles.title} ${isMenuItemActive(routes.fetchHelloWorld, pathname) ? styles.activeItem : ''}`}
            href={routes.fetchHelloWorld}
          >
            HelloWorld
          </Link>
        </li>
      </ul>
    </div>
  );
}
