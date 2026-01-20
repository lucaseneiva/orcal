import { QuoteRequestInsert } from "../../types/types";
import { createClient } from "@/src/lib/utils/supabase/server";

export async function createQuoteRequest(payload: QuoteRequestInsert) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('quote_requests')
        .insert(payload)
        .select()
        .single()

    if (error) throw Error(`Erro ao criar solitação de cotação`)
    return data
}