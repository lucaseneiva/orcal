import * as Brevo from '@getbrevo/brevo'
import { CartItem } from '@/src/lib/types/types'

type EmailPayload = {
  merchantEmail: string
  customerName: string
  customerEmail: string
  customerWhatsapp: string
  items: CartItem[]
}

const generateOrderHtml = (data: EmailPayload) => {
  const itemsHtml = data.items.map((item) => `
    <div style="margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #eee;">
      <strong>${item.productName}</strong><br/>
      Qtd: ${item.quantity}<br/>
      ${item.options
      ? item.options.map((o) => `${o.name}: ${o.value}`).join(' | ')
      : ''
    }
    </div>
  `).join('')

  return `
    <h1>Novo Pedido de Orçamento!</h1>
    <p><strong>Cliente:</strong> ${data.customerName}</p>
    <p><strong>Email:</strong> ${data.customerEmail || 'Não informado'}</p>
    <p><strong>WhatsApp:</strong> ${data.customerWhatsapp}</p>
    <hr/>
    <h3>Itens Solicitados:</h3>
    ${itemsHtml}
    <br/>
    <a href="https://wa.me/55${data.customerWhatsapp.replace(/\D/g, '')}">Iniciar conversa no WhatsApp</a>
  `
}

export async function sendOrderNotificationEmail(data: EmailPayload) {
  const apiInstance = new Brevo.TransactionalEmailsApi()

  // Garante que a API Key existe antes de tentar enviar
  if (!process.env.BREVO_API_KEY) {
    console.error('BREVO_API_KEY is missing')
    return { success: false, error: 'Configuration Error' }
  }

  apiInstance.setApiKey(
    Brevo.TransactionalEmailsApiApiKeys.apiKey,
    process.env.BREVO_API_KEY
  )

  const sendSmtpEmail = new Brevo.SendSmtpEmail()
  sendSmtpEmail.subject = `Novo Orçamento de ${data.customerName}`
  sendSmtpEmail.htmlContent = generateOrderHtml(data)

  // Remetente do Sistema
  sendSmtpEmail.sender = { name: "Orçal Notificações", email: "no-reply@orcal.com.br" }

  // Destinatário: Dono da Loja
  sendSmtpEmail.to = [{ email: data.merchantEmail }]

  // Reply-To: Cliente (para o lojista apenas clicar em Responder)
  if (data.customerEmail && data.customerEmail.includes('@')) {
    sendSmtpEmail.replyTo = { email: data.customerEmail, name: data.customerName }
  }

  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail)
    return { success: true }
  } catch (error: unknown) {
    // Tratamento seguro de erro (unknown -> Error)
    console.error('Brevo Error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown email error'
    return { success: false, error: errorMessage }
  }
}