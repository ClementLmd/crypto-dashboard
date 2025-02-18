'use client';

// Route: /dashboard
import { FetchAddresses } from '../../hooks/fetchAddresses';
import TokenBalancesTable from '../../components/ui/token-balances-table';
import TokenTotalsTable from '../../components/ui/token-totals-table';
import styles from './dashboard.module.css';

export default function Dashboard() {
  const addresses = FetchAddresses();

  return (
    <div className={styles.main}>
      <h1 className={styles.title}>Token Balances</h1>
      <div className={styles.tableContainer}>
        <h2 className={styles.subtitle}>Total Portfolio</h2>
        <TokenTotalsTable addresses={addresses} />
        <h2 className={styles.subtitle}>Individual Wallets</h2>
        <TokenBalancesTable addresses={addresses} />
      </div>
    </div>
  );
}
