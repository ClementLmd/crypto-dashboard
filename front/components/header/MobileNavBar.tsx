import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './mobileNavBar.module.css';
import { useEffect, useState } from 'react';
import NavBarLinks from './NavBarLinks';

type IconButtonProps = {
  icon?: typeof faBars;
};

export default function MobileNavBar({ icon = faBars }: IconButtonProps) {
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
      <NavBarLinks menuOpen={menuOpen} isMobile={true} />
      <FontAwesomeIcon icon={icon} className={styles.burger} onClick={openMenu} />
    </div>
  );
}
