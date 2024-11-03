// Route: /database

import RedirectButton from '../../components/RedirectButton';
import { routes } from '../config/routes';
import styles from './databasePage.module.css';

export default function DatabasePage() {
  return (
    <div className={styles.main}>
      <RedirectButton route={routes.database.get} buttonName="GET" />
      <RedirectButton route={routes.database.post} buttonName="POST" />
    </div>
  );
}
