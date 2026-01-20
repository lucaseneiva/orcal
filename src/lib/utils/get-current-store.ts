import { cache } from 'react';
import { headers } from 'next/headers';
import { findByDomain } from '@/src/lib/data/queries/stores';

export const getCurrentStore = cache(async () => {
  const headerStack = await headers();

  const rawHost = headerStack.get('x-forwarded-host') || headerStack.get('host');

  const host = rawHost?.split(':')[0];

  console.log('[DEBUG] Host final processado:', host);

  const store = await findByDomain(host || null);

  if (!store) return null;
  return store;
});
