import Link from 'next/link';
import { RoutePaths } from '../app/config/routes';
import styles from './redirectButton.module.css';
import { Button } from './ui/button';

export default function RedirectButton({
  route,
  buttonName,
}: {
  route: RoutePaths;
  buttonName: string;
}) {
  return (
    <Button className={`${styles.Button} m-2`} type="button">
      <Link href={`${route}`} className={styles.link}>
        {buttonName}
      </Link>
    </Button>
  );
}
