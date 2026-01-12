import { createClient } from "@/lib/utils/supabase/server";


export async function getQuoteRequestsByStoreId(storeId: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('quote_requests')
        .select('*')
        .eq('store_id', storeId)
        .order('created_at', { ascending: false })

    return data || []
}



