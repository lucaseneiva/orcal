'use server'

import { createClient } from '@/utils/supabase/server'
import { headers } from 'next/headers'

export async function submitLead(formData: FormData) {
  const supabase = await createClient()

  // 1. Descobrir qual tenant é (mesma lógica da home)
  const headerStack = await headers()
  const host = headerStack.get('host')

  const { data: tenant } = await supabase
    .from('tenants')
    .select('id')
    .eq('domain', host)
    .single()

  if (!tenant) return { success: false, error: 'Tenant not found' }

  // 2. Pegar dados do form
  const name = formData.get('name') as string
  const whatsapp = formData.get('whatsapp') as string
  const itemsRaw = formData.get('items') as string
  const items = JSON.parse(itemsRaw)

  // 3. Salvar no banco
  const { error } = await supabase.from('leads').insert({
    tenant_id: tenant.id,
    customer_name: name,
    customer_whatsapp: whatsapp,
    items: items,
    status: 'new'
  })

  if (error) {
    console.error('Erro ao salvar lead:', error)
    return { success: false }
  }

  return { success: true }
}