import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../types/database.types";
import { AttributeValueInsert } from "../types/types";

export class AttributeValueRepo {
    private supabase: SupabaseClient<Database>;

    constructor(supase: SupabaseClient<Database>) {
        this.supabase = supase
    }

    async create(payload: AttributeValueInsert) {
        const { error } = await this.supabase
            .from('attribute_values')
            .insert(payload)

        if (error) {
            console.error("Erro Supabase Create:", error.message) // Isso vai aparecer no console do servidor
        }

        return { error }
    }

    
}