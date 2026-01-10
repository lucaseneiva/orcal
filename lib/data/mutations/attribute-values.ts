import { createClient } from "@/lib/utils/supabase/server";
import { AttributeValueInsert, AttributeUpdate } from "../../types/types";

export async function createAttributeValue(payload: AttributeValueInsert) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('attribute_values')
        .insert(payload)
        .select()
        .single()

    if (error) {
        throw new Error(error.message)
    }

    return data
}

export async function updateAttributeValue(id: string, payload: AttributeUpdate) {
    const supabase = await createClient()

    const { error, data } = await supabase
        .from('attribute_values')
        .update(payload)
        .eq('id', id)
        .select()
        .single()

    if (error) {
        throw new Error(error.message)
    }

    return data
}

export async function deleteAttributeValue(id: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('attribute_values')
        .delete()
        .eq('id', id)

    if (error) {
        throw new Error(error.message)
    }

    return null
}