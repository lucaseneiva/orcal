import { cache } from 'react';
import { headers } from 'next/headers';
import { findStoreByDomain } from '@/lib/data/stores';

export const getCurrentStore = cache(async () => {
  const headerStack = await headers();
  
  const rawHost = headerStack.get('x-forwarded-host') || headerStack.get('host');
  
  const host = rawHost?.split(':')[0]; 

  console.log('[DEBUG] Host final processado:', host);

  
  const store = await findStoreByDomain(host || null);

  if (!store) return null;
  return store;
});
