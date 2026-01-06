'use server'

import { createClient } from '@/lib/utils/supabase/server'
import { getCurrentStore } from '@/lib/utils/get-current-store'
import * as Brevo from '@getbrevo/brevo'
import { revalidatePath } from 'next/cache'

// Initialize Brevo Client
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
  const whatsapp = formData.get('whatsapp') as string
  const cartJson = formData.get('cart_items') as string
  
  const items = JSON.parse(cartJson)

  // 1. Salvar no Supabase (Unchanged)
  const { error: dbError } = await supabase.from('quote_requests').insert({
    store_id: store.id,
    customer_name: name,
    customer_whatsapp: whatsapp,
    items: items,
    total_items: items.length,
    status: 'pending'
  })

  if (dbError) {
    console.error('Erro DB:', dbError)
    return { success: false, error: 'Erro interno ao salvar pedido.' }
  }

  // 2. Enviar Notificação por Email (Brevo)
  try {
    const adminEmail = 'teste@gmail.com' // Replace with actual admin email

    // Generate HTML (Same logic)
    const itemsHtml = items.map((item: any) => `
      <div style="margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #eee;">
        <strong>${item.productName}</strong><br/>
        Qtd: ${item.quantity}<br/>
        ${item.options ? item.options.map((o: any) => `${o.name}: ${o.value}`).join(' | ') : ''}
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

    // Create the email object
    const sendSmtpEmail = new Brevo.SendSmtpEmail()
    
    sendSmtpEmail.subject = `Novo Orçamento de ${name}`
    sendSmtpEmail.htmlContent = emailHtml
    
    // IMPORTANT: This email must be verified in your Brevo account "Senders" list
    sendSmtpEmail.sender = { 
      name: "no-reply", 
      email: "no-reply@orcal.com.br" 
    }
    
    sendSmtpEmail.to = [
      { email: adminEmail, name: "Admin" }
    ]

    // Send
    await apiInstance.sendTransacEmail(sendSmtpEmail)

  } catch (emailError) {
    // Log the detailed error from Brevo
    console.error('Erro Email:', emailError)
    // We don't fail the request if email fails, just log it
  }
  revalidatePath('/dashboard/orders')
  return { success: true }
}