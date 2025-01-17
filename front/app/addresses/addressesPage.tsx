'use client';
// Route: /addresses

import { Address } from 'crypto-dashboard-shared';
import { AddAddress } from '../../components/form/addAddress';
import AddressesTable from '../../components/ui/addresses-table';
import styles from './addresses.module.css';
import { selectAddresses } from '../../features/addresses/addresses.selectors';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../hooks/hooks';
import { deleteAddress, getUserAddresses } from '../../features/addresses/addresses.thunks';
import { useEffect } from 'react';

export default function AddressesPage() {
  const dispatch = useAppDispatch();
  const addresses: Address[] = useSelector(selectAddresses);

  useEffect(() => {
    dispatch(getUserAddresses());
  }, [dispatch]);

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

  const handleDelete = (row: Address) => {
    dispatch(deleteAddress(row));
  };

  return (
    <div className={styles.main}>
      <div className={styles.addAddress}>
        <AddAddress blockchain="Bitcoin" />
        <AddAddress blockchain="Ethereum" />
        <AddAddress blockchain="Solana" />
      </div>
      <AddressesTable columns={columns} data={data} itemsPerPage={10} onDelete={handleDelete} />
    </div>
  );
}
