import { createClient } from "../utils/supabase/server";

export class ProfileService {
    private supabase

    constructor(supabase: any) {
        this.supabase = supabase
    }
    
    async findById(id: string) {
    
    const { data, error } = await (await this.supabase)
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single()

    return error ? null : data
  }
}