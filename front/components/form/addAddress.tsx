import { AddressForm } from './addressForm';
import styles from './addAddress.module.css';
import { Blockchain } from '@shared/types/blockchain';

export function AddAddress({ blockchain }: { blockchain: Blockchain }) {
  return (
    <div className={styles.container}>
      <div>{blockchain}</div>
      <AddressForm blockchain={blockchain} />
    </div>
  );
}
