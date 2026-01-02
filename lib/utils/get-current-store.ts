import { cache } from 'react';
import { headers } from 'next/headers';
import { getStoreRepository } from '@/lib/services/store-service';

export const getCurrentStore = cache(async () => {
  const headerStack = await headers();
  const host = headerStack.get('host');

  const storeRepository = await getStoreRepository();
  const store = storeRepository.findByDomain(host);

  if (!store) return null;
  return store;
});