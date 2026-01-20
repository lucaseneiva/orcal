import { createClient } from '@/src/lib/utils/supabase/server'
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

export async function getStoreOwnerEmail(storeId: string): Promise<string | null> {
  const supabase = await createClient()

  // Busca o email na tabela profiles vinculado a esta loja
  // Assumindo que o primeiro perfil encontrado é o admin/dono
  const { data, error } = await supabase
    .from('profiles')
    .select('email')
    .eq('store_id', storeId)
    .limit(1)
    .single()

  if (error || !data) return null
  return data.email
}