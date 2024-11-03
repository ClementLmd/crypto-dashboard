// Route: /database/get
'use client';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../../hooks/hooks';
import styles from './databaseGetPage.module.css';
import { selectUserIsLoading, selectUsers } from '../../../features/user/user.selectors';
import { fetchUsers } from '../../../features/user/user.thunks';
import CustomTable from '../../../components/ui/custom-table';
import type { User } from '@shared/types/user';
import { useState } from 'react';
import { Button } from '../../../components/ui/button';

export default function DatabaseGetPage() {
  const dispatch = useAppDispatch();

  const users = useSelector(selectUsers);
  const isLoading = useSelector(selectUserIsLoading);
  const [showTable, setShowTable] = useState(false);

  const handleFetchUsers = () => {
    dispatch(fetchUsers());
    setShowTable(true);
  };

  const columns = [
    { key: 'firstname', label: 'Firstname', sortable: true },
    { key: 'lastname', label: 'Lastname', sortable: true },
  ];

  const data = users.map((user: User, key: number) => ({
    id: key,
    firstname: user.firstname,
    lastname: user.lastname,
  }));

  return (
    <div className={styles.main}>
      {isLoading && <p>Loading...</p>}
      <Button onClick={handleFetchUsers} className="m-3">
        Fetch users
      </Button>
      {showTable && <CustomTable columns={columns} data={data} itemsPerPage={8} />}
    </div>
  );
}
