'use server'

import { createClient } from '@/lib/utils/supabase/server'
import { getCurrentStore } from '@/lib/utils/get-current-store'
import { revalidatePath } from 'next/cache'
import { sendOrderNotificationEmail } from '@/lib/services/email.service'
import { Json } from '@/lib/types/database.types'
import { CartItem, QuoteRequestInsert } from '@/lib/types/types' 

export async function submitOrder(formData: FormData) {
  const supabase = await createClient()
  const store = await getCurrentStore()

  if (!store) return { success: false, error: 'Loja indisponível' }

  // Extract data
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const whatsapp = formData.get('whatsapp') as string
  const cartJson = formData.get('cart_items') as string
  
  if (!cartJson) return { success: false, error: 'Carrinho vazio' }

  // 1. Validate / Parse Items
  let items: CartItem[] = []
  try {
    items = JSON.parse(cartJson)
  } catch (e) {
    return { success: false, error: 'Dados do carrinho inválidos', e }
  }

  // 2. Prepare DB Payload
  const orderPayload: QuoteRequestInsert = {
    store_id: store.id,
    customer_name: name,
    email: email,
    customer_whatsapp: whatsapp,
    items: (items as unknown) as Json, // Safe cast for Supabase
    total_items: items.length,
    status: 'pending'
  }

  // 3. Database Insert
  const { error: dbError } = await supabase
    .from('quote_requests')
    .insert(orderPayload)

  if (dbError) {
    console.error('Erro DB:', dbError)
    return { success: false, error: 'Erro interno ao salvar pedido.' }
  }

  // 4. Send Email (Non-blocking usually, but awaited here for safety)
  await sendOrderNotificationEmail({
    customerName: name,
    customerEmail: email,
    customerWhatsapp: whatsapp,
    items: items
  })

  revalidatePath('/dashboard/orders')
  return { success: true }
}