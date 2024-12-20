// Route: /addresses

import { AddressForm } from '../../components/form/addressForm';
import styles from './addresses.module.css';

export default function AddressesPage() {
  return (
    <div>
      <div className={styles.main}>Addresses</div>
      <AddressForm />
    </div>
  );
}
