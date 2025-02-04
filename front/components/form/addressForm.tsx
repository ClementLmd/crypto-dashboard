'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '../../components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../components/ui/form';
import { Input } from '../../components/ui/input';
import { useAppDispatch } from '../../hooks/hooks';
import {
  addAddress,
  addSolanaAddress,
  getUserAddresses,
} from '../../features/addresses/addresses.thunks';
import { useState } from 'react';
import { addressFormSchema, Blockchain, errors, Address, isValidSolanaAddress } from 'shared';

export function AddressForm({ blockchain }: { blockchain: Blockchain }) {
  const dispatch = useAppDispatch();
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const formDefaultAddressValues: Address = {
    address: '',
    blockchain,
    addressContent: [],
    addressName: '',
  };

  const form = useForm<z.infer<typeof addressFormSchema>>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: formDefaultAddressValues,
  });

  async function onSubmit(values: z.infer<typeof addressFormSchema>) {
    try {
      if (values.address.trim() === '') {
        setFeedbackMessage(errors.addresses.incompleteData);
        return;
      }
      if (blockchain === 'Solana') {
        if (!isValidSolanaAddress(values.address)) {
          setFeedbackMessage(errors.addresses.invalidSolanaAddress);
          return;
        }
        await dispatch(addSolanaAddress(values)).unwrap();
      } else {
        await dispatch(addAddress(values)).unwrap();
      }
      setFeedbackMessage('Address added');
      dispatch(getUserAddresses());
      form.reset(formDefaultAddressValues);
    } catch (error) {
      setFeedbackMessage(error instanceof Error ? error.message : 'An error occurred');
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Add address</FormLabel>
              <FormControl>
                <Input
                  placeholder="Address"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    setFeedbackMessage(null);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="addressName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address name (optional)</FormLabel>
              <FormControl>
                <Input placeholder="Main address" {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {feedbackMessage && <div className="text-sm text-dune-copper">{feedbackMessage}</div>}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
