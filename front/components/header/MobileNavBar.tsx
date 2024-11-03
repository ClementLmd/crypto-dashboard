import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { isMenuItemActive } from '../../utils/isMenuItemActive';
import { routes } from '../../app/config/routes';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './mobileNavBar.module.css';
import { useEffect, useState } from 'react';

type IconButtonProps = {
  icon?: typeof faBars;
};

export default function MobileNavBar({ icon = faBars }: IconButtonProps) {
  const pathname = usePathname();

  const [menuOpen, setMenuOpen] = useState(false);

  const openMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      !(event.target as Element).closest(`.${styles.links}`) &&
      !(event.target as Element).closest(`.${styles.burger}`)
    ) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    if (menuOpen) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <div id="mobileHeader">
      <div className={styles.menuItems}>
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
          <li>
            <Link
              className={`${styles.title} ${isMenuItemActive(routes.home, pathname) ? styles.activeItem : ''}`}
              href={routes.home}
            >
              Connexion
            </Link>
          </li>
        </ul>
      </div>
      <FontAwesomeIcon icon={icon} className={styles.burger} onClick={openMenu} />
    </div>
  );
}
