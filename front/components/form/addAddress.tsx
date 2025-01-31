import { AddressForm } from './addressForm';
import styles from './addAddress.module.css';
import { Blockchain } from 'shared';

export function AddAddress({ blockchain }: { blockchain: Blockchain }) {
  return (
    <div className={styles.container}>
      <div>{blockchain}</div>
      <AddressForm blockchain={blockchain} />
    </div>
  );
}
