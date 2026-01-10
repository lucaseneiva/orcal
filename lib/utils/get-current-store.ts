import { cache } from 'react';
import { headers } from 'next/headers';
import { StoreRepo } from '@/lib/data/stores';
import { createClient } from './supabase/server';

export const getCurrentStore = cache(async () => {
  const headerStack = await headers();

  const rawHost = headerStack.get('x-forwarded-host') || headerStack.get('host');

  const host = rawHost?.split(':')[0];

  console.log('[DEBUG] Host final processado:', host);

  const storeRepo = new StoreRepo(await createClient())
  const store = await storeRepo.findByDomain(host || null);

  if (!store) return null;
  return store;
});
