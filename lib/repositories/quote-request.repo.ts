import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../types/database.types";

export class QuoteRequestRepo {
    private supabase: SupabaseClient<Database>

    constructor(supabase: SupabaseClient<Database>) {
        this.supabase = supabase
    }

    async getFromStore(storeId: string) {
        const { data, error } = await this.supabase
            .from('quote_requests')
            .select('*')
            .eq('store_id', storeId)
            .order('created_at', { ascending: false })

        return data || []
    }

}