'use server'

import { createClient } from '@/lib/utils/supabase/server'
import { getCurrentStore } from '@/lib/utils/get-current-store'
import * as Brevo from '@getbrevo/brevo'
import { revalidatePath } from 'next/cache'
import { Database, Json } from '@/lib/types/database.types'

// 1. Tipagem estrita para os itens do carrinho
type CartItemOption = {
  name: string
  value: string
}

type CartItem = {
  productName: string
  quantity: number
  options?: CartItemOption[]
}

// Tipagem para o objeto de inserção na tabela
type QuoteRequestInsert = Database['public']['Tables']['quote_requests']['Insert']

const apiInstance = new Brevo.TransactionalEmailsApi()
apiInstance.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY as string
)

export async function submitOrder(formData: FormData) {
  const supabase = await createClient()
  const store = await getCurrentStore()

  if (!store) return { success: false, error: 'Loja indisponível' }

  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const whatsapp = formData.get('whatsapp') as string
  const cartJson = formData.get('cart_items') as string
  
  // JSON.parse sempre retorna any, então fazemos o cast para o tipo conhecido
  const items = JSON.parse(cartJson) as CartItem[]

  // 2. Construção do payload com tipagem estrita do banco
  // Isso remove a necessidade do "as any" no .insert()
  const orderPayload: QuoteRequestInsert = {
    store_id: store.id,
    customer_name: name,
    email: email,
    customer_whatsapp: whatsapp,
    // Cast de unknown para Json satisfaz o TS e o linter
    items: (items as unknown) as Json, 
    total_items: items.length,
    status: 'pending' // Certifique-se que 'pending' é um valor válido no seu banco
  }

  const { error: dbError } = await supabase
    .from('quote_requests')
    .insert(orderPayload)

  if (dbError) {
    console.error('Erro DB:', dbError)
    return { success: false, error: 'Erro interno ao salvar pedido.' }
  }

  try {
    const adminEmail = 'teste@gmail.com'

    // Tipagem explícita nos maps para evitar 'any' implícito
    const itemsHtml = items.map((item: CartItem) => `
      <div style="margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #eee;">
        <strong>${item.productName}</strong><br/>
        Qtd: ${item.quantity}<br/>
        ${item.options ? item.options.map((o: CartItemOption) => `${o.name}: ${o.value}`).join(' | ') : ''}
      </div>
    `).join('')

    const emailHtml = `
      <h1>Novo Pedido de Orçamento!</h1>
      <p><strong>Cliente:</strong> ${name}</p>
      <p><strong>WhatsApp:</strong> ${whatsapp}</p>
      <hr/>
      <h3>Itens Solicitados:</h3>
      ${itemsHtml}
      <br/>
      <a href="https://wa.me/55${whatsapp.replace(/\D/g,'')}">Iniciar conversa no WhatsApp</a>
    `

    const sendSmtpEmail = new Brevo.SendSmtpEmail()
    sendSmtpEmail.subject = `Novo Orçamento de ${name}`
    sendSmtpEmail.htmlContent = emailHtml
    sendSmtpEmail.sender = { name: "Orcall", email: "no-reply@orcal.com.br" }
    sendSmtpEmail.to = [{ email: adminEmail, name: "Admin" }]

    await apiInstance.sendTransacEmail(sendSmtpEmail)
  } catch (emailError) {
    console.error('Erro Email:', emailError)
  }

  revalidatePath('/dashboard/orders')
  return { success: true }
}