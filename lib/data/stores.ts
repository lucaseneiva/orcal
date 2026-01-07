import { createClient } from '@/lib/utils/supabase/server'
import { Store } from '../types/types'



export const findStoreByDomain = async (domain: string | null): Promise < Store | null > => {
    if(!domain) return null
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('domain', domain)
        .single()

    return error ? null : data
}


export const getStoreAttributes = async (storeId: string) => {
    const supabase = await createClient()
    const { data } = await supabase
        .from('attributes')
        .select(`
        id,
        name,
        slug,
        attribute_values (
          id,
          name
        )
      `)
        .eq('store_id', storeId)

    return data || []
}