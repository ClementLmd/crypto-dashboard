'use client';
// Route: /addresses

import { Address } from '@shared/types/address';
import { AddAddress } from '../../components/form/addAddress';
import CustomTable from '../../components/ui/custom-table';
import styles from './addresses.module.css';
import { selectAddresses } from '../../features/addresses/addresses.selectors';
import { useSelector } from 'react-redux';

export default function AddressesPage() {
  const addresses: Address[] = useSelector(selectAddresses);
  console.log(addresses);

  const columns = [
    { key: 'blockchain', label: 'Blockchain', sortable: true },
    { key: 'address', label: 'Address', sortable: true },
    { key: 'addressName', label: 'Address name', sortable: true },
  ];

  const data = addresses.map((address: Address, key: number) => ({
    id: key,
    blockchain: address.blockchain,
    address: address.address,
    addressName: address.addressName,
  }));

  return (
    <div className={styles.main}>
      <div className={styles.addAddress}>
        <AddAddress blockchain="Bitcoin" />
        <AddAddress blockchain="Ethereum" />
        <AddAddress blockchain="Solana" />
      </div>
      <CustomTable columns={columns} data={data} itemsPerPage={10} />
    </div>
  );
}
