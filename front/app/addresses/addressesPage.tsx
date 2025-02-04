'use client';
// Route: /addresses

import { Address } from 'shared';
import { AddAddress } from '../../components/form/addAddress';
import AddressesTable from '../../components/ui/addresses-table';
import styles from './addresses.module.css';
import { useAppDispatch } from '../../hooks/hooks';
import { deleteAddress, getUserAddresses } from '../../features/addresses/addresses.thunks';
import { FetchAddresses } from '../../hooks/fetchAddresses';
import { Button } from '../../components/ui/button';
import { useState } from 'react';

export default function AddressesPage() {
  const dispatch = useAppDispatch();
  const addresses = FetchAddresses();
  const [showAddAddress, setShowAddAddress] = useState(false);

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

  const handleDelete = async (row: Address) => {
    await dispatch(deleteAddress(row));
    // Force refresh after deletion
    dispatch(getUserAddresses());
  };

  return (
    <div className={styles.main}>
      <Button onClick={() => setShowAddAddress(!showAddAddress)} className="mb-4">
        {showAddAddress ? 'Hide Address Forms' : 'Add Addresses'}
      </Button>

      {showAddAddress && (
        <div className={styles.addAddress}>
          <AddAddress blockchain="Bitcoin" />
          <AddAddress blockchain="Ethereum" />
          <AddAddress blockchain="Solana" />
        </div>
      )}
      <h1 className={styles.title}>Your addresses</h1>
      <div className={styles.addressesTable}>
        <AddressesTable columns={columns} data={data} itemsPerPage={10} onDelete={handleDelete} />
      </div>
    </div>
  );
}
