// Route: /addresses

import { AddAddress } from '../../components/form/addAddress';
import styles from './addresses.module.css';

export default function AddressesPage() {
  return (
    <div className={styles.main}>
      <AddAddress blockchain="Bitcoin" />
      <AddAddress blockchain="Ethereum" />
      <AddAddress blockchain="Solana" />
    </div>
  );
}
