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
import { addressFormSchema } from '@shared/schema/addressForm.schema';
import { useAppDispatch } from '../../hooks/hooks';
import { addAddress } from '../../features/addresses/addresses.thunks';
import { Blockchain } from '@shared/types/blockchain';
import { useState } from 'react';

export function AddressForm({ blockchain }: { blockchain: Blockchain }) {
  const dispatch = useAppDispatch();
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const form = useForm<z.infer<typeof addressFormSchema>>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: { address: '', blockchain, addressContent: [], addressName: '' },
  });

  async function onSubmit(values: z.infer<typeof addressFormSchema>) {
    try {
      await dispatch(addAddress(values));
      setFeedbackMessage('Address added');
      form.reset({ address: '', addressName: '' });
    } catch {
      setFeedbackMessage('Address not added');
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
                <Input placeholder="Address" {...field} />
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
                <Input placeholder="Main address" {...field} />
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
