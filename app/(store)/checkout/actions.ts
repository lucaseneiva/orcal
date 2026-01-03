'use server'

import { createClient } from '@/lib/utils/supabase/server'
import { getCurrentStore } from '@/lib/utils/get-current-store'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function submitOrder(formData: FormData) {
  const supabase = await createClient()
  const store = await getCurrentStore()

  if (!store) return { success: false, error: 'Loja indisponível' }

  const name = formData.get('name') as string
  const whatsapp = formData.get('whatsapp') as string
  const cartJson = formData.get('cart_items') as string
  
  const items = JSON.parse(cartJson)

  // 1. Salvar no Supabase
  const { error: dbError } = await supabase.from('orders').insert({
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

  // 2. Enviar Notificação por Email (Resend)
  try {
    // Busca o email do dono (assumindo que profiles.id = store.owner_id ou algo assim)
    // Para simplificar no MVP: vamos mandar para o email fixo de teste ou buscar no auth se possível
    // Vou usar um email fixo ou o seu email para testar
    const adminEmail = 'neiva.lucas13@gmail.com' 

    // Monta um HTML simples para o email
    const itemsHtml = items.map((item: any) => `
      <div style="margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #eee;">
        <strong>${item.productName}</strong><br/>
        Qtd: ${item.quantity}<br/>
        ${item.options.map((o: any) => `${o.name}: ${o.value}`).join(' | ')}
      </div>
    `).join('')

    await resend.emails.send({
      from: 'Orçamentos <onboarding@resend.dev>', // Use o domínio verificado se tiver
      to: adminEmail,
      subject: `Novo Orçamento de ${name}`,
      html: `
        <h1>Novo Pedido de Orçamento!</h1>
        <p><strong>Cliente:</strong> ${name}</p>
        <p><strong>WhatsApp:</strong> ${whatsapp}</p>
        <hr/>
        <h3>Itens Solicitados:</h3>
        ${itemsHtml}
        <br/>
        <a href="https://wa.me/55${whatsapp.replace(/\D/g,'')}">Iniciar conversa no WhatsApp</a>
      `
    })

  } catch (emailError) {
    console.error('Erro Email:', emailError)
    // Não vamos falhar o pedido se o email falhar, apenas logar
  }

  return { success: true }
}