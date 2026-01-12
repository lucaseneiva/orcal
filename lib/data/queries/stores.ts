import { createClient } from '@/lib/utils/supabase/server'
import { Store } from '../../types/types'

export async function findByDomain(domain: string | null): Promise<Store | null> {
  if (!domain) return null

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('stores')
    .select('*')
    .eq('domain', domain)
    .single()

  return error ? null : data
}




