'use client';

// Route: /dashboard
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { getUserAddresses } from '../../features/addresses/addresses.thunks';
import { selectAddresses } from '../../features/addresses/addresses.selectors';
import TokenBalancesTable from '../../components/ui/token-balances-table';
import styles from './dashboard.module.css';

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const addresses = useAppSelector(selectAddresses);

  useEffect(() => {
    dispatch(getUserAddresses());
  }, [dispatch]);

  return (
    <div className={styles.main}>
      <h1 className="text-2xl font-bold mb-6">Token Balances</h1>
      <TokenBalancesTable addresses={addresses} />
    </div>
  );
}
