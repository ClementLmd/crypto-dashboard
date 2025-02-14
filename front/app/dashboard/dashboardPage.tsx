'use client';

// Route: /dashboard
import { FetchAddresses } from '../../hooks/fetchAddresses';
import TokenBalancesTable from '../../components/ui/token-balances-table';
import styles from './dashboard.module.css';

export default function Dashboard() {
  const addresses = FetchAddresses();

  return (
    <div className={styles.main}>
      <h1 className={styles.title}>Token Balances</h1>
      <div className={styles.tableContainer}>
        <TokenBalancesTable addresses={addresses} />
      </div>
    </div>
  );
}
