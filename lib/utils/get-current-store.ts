import { cache } from 'react';
import { headers } from 'next/headers';
import { storeRepository } from '@/lib/repositories/store-repository';

export const getCurrentStore = cache(async () => {
  const headerStack = await headers();
  const host = headerStack.get('host');

  const store = await storeRepository.findByDomain(host);

  if (!store) return null;
  return store;
});