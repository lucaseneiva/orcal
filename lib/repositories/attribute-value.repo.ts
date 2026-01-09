import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../types/database.types";
import { AttributeValueInsert, AttributeUpdate } from "../types/types";

export class AttributeValueRepo {
    private supabase: SupabaseClient<Database>;

    constructor(supabase: SupabaseClient<Database>) {
        this.supabase = supabase
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

    async delete(id: string) {
        const { error } = await this.supabase
            .from('attribute_values')
            .delete()
            .eq('id', id)

        if (error) console.log("Erro ao deletar:", error)

        return { error }
    }

    async update(id: string, payload: AttributeUpdate) {
        const { error } = await this.supabase
            .from('attribute_values')
            .update(payload)
            .eq('id', id)
        if (error) console.log("Erro ao atualizar")

        return { error }
    }
}