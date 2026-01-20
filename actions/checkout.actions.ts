'use server'

import { createClient } from '@/lib/utils/supabase/server'
import { getCurrentStore } from '@/lib/utils/get-current-store'
import { revalidatePath } from 'next/cache'
import { sendOrderNotificationEmail } from '@/lib/services/email.service'
import { getStoreOwnerEmail } from '@/lib/data/queries/stores'
import { Json } from '@/lib/types/database.types'
import { QuoteRequestInsert } from '@/lib/types/types'
import { QuoteRequestSchema } from '@/lib/validators'

export async function submitOrder(formData: FormData) {
  const supabase = await createClient()
  const store = await getCurrentStore()

  if (!store) return { success: false, error: 'Loja indisponível' }

  const rawData = {
    name: formData.get('name'),
    email: formData.get('email'),
    whatsapp: formData.get('whatsapp'),
    cart_items: formData.get('cart_items')
  }

  const validation = QuoteRequestSchema.safeParse(rawData)

  if (!validation.success) {
    return { success: false, error: validation.error.issues[0].message }
  }

  const { name, email, whatsapp, cart_items } = validation.data

  const orderPayload: QuoteRequestInsert = {
    store_id: store.id,
    customer_name: name,
    email: email,
    customer_whatsapp: whatsapp,
    items: (cart_items as unknown) as Json,
    total_items: cart_items.length,
    status: 'pending'
  }

  const { error: dbError } = await supabase
    .from('quote_requests')
    .insert(orderPayload)

  if (dbError) {
    console.error('Erro DB:', dbError)
    return { success: false, error: 'Erro interno ao salvar pedido.' }
  }

  const merchantEmail = await getStoreOwnerEmail(store.id)

  if (merchantEmail) {
    await sendOrderNotificationEmail({
      merchantEmail,
      customerName: name,
      customerEmail: email,
      customerWhatsapp: whatsapp,
      items: cart_items
    })
  } else {
    console.warn(`[Checkout] Pedido criado, mas loja ${store.id} não possui email de admin configurado.`)
  }

  revalidatePath('/dashboard/orders')
  return { success: true }
}