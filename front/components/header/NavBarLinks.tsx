import { usePathname } from 'next/navigation';
import { isMenuItemActive } from '../../utils/isMenuItemActive';
import { routes } from '../../app/config/routes';
import Link from 'next/link';
import styles from './navBarLinks.module.css';

export default function MobileNavBar({
  menuOpen,
  isMobile,
}: {
  menuOpen?: boolean;
  isMobile?: boolean;
}) {
  const pathname = usePathname();
  console.log({ menuOpen });
  return (
    <div className={isMobile ? styles.mobile : styles.links}>
      <ul className={menuOpen ? `${styles.active}` : ''}>
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
            className={`${styles.title} ${isMenuItemActive(routes.dashboard, pathname) ? styles.activeItem : ''}`}
            href={routes.dashboard}
          >
            Dashboard
          </Link>
        </li>
        <li>
          <Link
            className={`${styles.title} ${isMenuItemActive(routes.reporting, pathname) ? styles.activeItem : ''}`}
            href={routes.reporting}
          >
            Reporting
          </Link>
        </li>
        <li>
          <Link
            className={`${styles.title} ${isMenuItemActive(routes.addresses, pathname) ? styles.activeItem : ''}`}
            href={routes.addresses}
          >
            Addresses
          </Link>
        </li>
      </ul>
    </div>
  );
}
