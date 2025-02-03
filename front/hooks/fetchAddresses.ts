import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './hooks';
import { getUserAddresses } from '../features/addresses/addresses.thunks';
import { selectAddresses, selectLastFetched } from '../features/addresses/addresses.selectors';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export const FetchAddresses = (forceRefresh = false) => {
  const dispatch = useAppDispatch();
  const addresses = useAppSelector(selectAddresses);
  const lastFetched = useAppSelector(selectLastFetched);

  useEffect(() => {
    const shouldFetch = forceRefresh || !lastFetched || Date.now() - lastFetched > CACHE_DURATION;

    if (shouldFetch) {
      dispatch(getUserAddresses());
    }
  }, [dispatch, lastFetched, forceRefresh]);

  return addresses;
};
