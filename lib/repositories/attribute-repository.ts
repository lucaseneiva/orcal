import { createClient } from '@/lib/utils/supabase/client'

class AttributeRepository {
    private supabase

    constructor(supabase: any) {
        this.supabase = supabase
    }

    async findByStoreId(storeId: string) {
        const { data, error } = await (await this.supabase)
            .from('attributes')
            .select(`
            id,
            name,
            slug,
            attribute_values (
                id,
                label,
                attribute_id
            )
            `)
            .eq('store_id', storeId)
            .order('created_at', { ascending: true })
    }
}