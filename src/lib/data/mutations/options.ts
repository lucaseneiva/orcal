import { createClient } from "@/src/lib/utils/supabase/server";
import { OptionInsert, OptionUpdate } from "../../types/types";

export async function createOption(payload: OptionInsert) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('options')
        .insert(payload)
        .select()
        .single()

    if (error) {
        throw new Error(error.message)
    }

    return data
}

export async function updateOption(id: string, payload: OptionUpdate) {
    const supabase = await createClient()

    const { error, data } = await supabase
        .from('options')
        .update(payload)
        .eq('id', id)
        .select()
        .single()

    if (error) {
        throw new Error(error.message)
    }

    return data
}

export async function deleteOption(id: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('options')
        .delete()
        .eq('id', id)

    if (error) {
        throw new Error(error.message)
    }

    return null
}