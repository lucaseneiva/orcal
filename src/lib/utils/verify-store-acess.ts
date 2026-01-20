import { createClient } from "@/src/lib/utils/supabase/server"

export async function verifyStoreAccess(storeId: string) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    throw new Error("Usuário não autenticado.")
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('store_id, role')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) {
    throw new Error("Perfil de usuário não encontrado.")
  }

  if (profile.store_id !== storeId) {
    console.error(`SECURITY ALERT: User ${user.id} (Store ${profile.store_id}) tried to access Store ${storeId}`)
    throw new Error("Acesso negado: Você não tem permissão para gerenciar esta loja.")
  }

  return { user, profile }
}