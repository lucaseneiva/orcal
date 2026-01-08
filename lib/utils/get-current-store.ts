import { cache } from 'react';
import { headers } from 'next/headers';
import { StoreDAO } from '@/lib/repositories/store.repo';
import { createClient } from './supabase/server';

export const getCurrentStore = cache(async () => {
  const headerStack = await headers();

  const rawHost = headerStack.get('x-forwarded-host') || headerStack.get('host');

  const host = rawHost?.split(':')[0];

  console.log('[DEBUG] Host final processado:', host);

  const storeDAO = new StoreDAO(await createClient())
  const store = await storeDAO.findStoreByDomain(host || null);

  if (!store) return null;
  return store;
});
