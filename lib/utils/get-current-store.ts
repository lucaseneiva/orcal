import { cache } from 'react';
import { headers } from 'next/headers';
import { StoreRepository } from '@/lib/repositories/store-repository';
import { notFound } from 'next/navigation';

export const getCurrentStore = cache(async () => {
  const headerStack = await headers();
  const host = headerStack.get('host');
  
  const repo = new StoreRepository();
  const store = await repo.findByDomain(host);

  if (!store) return null;

  return store;
});