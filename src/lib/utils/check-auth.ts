import { createClient } from "@/src/lib/utils/supabase/server"

export async function checkUserStoreAccess(currentStoreId: string) {
  const supabase = await createClient()

  
  const { data: { user } } = await supabase.auth.getUser()
  
  
  if (!user) {
    return { isAuthorized: false, user: null, correctStoreId: null }
  }

  
  const { data: profile } = await supabase
    .from('profiles')
    .select('store_id')
    .eq('id', user.id)
    .single()

  
  if (!profile) {
    return { isAuthorized: false, user, correctStoreId: null }
  }

  
  const isAuthorized = profile.store_id === currentStoreId

  return { 
    isAuthorized, 
    user, 
    correctStoreId: profile.store_id 
  }
}