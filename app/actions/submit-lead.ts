'use server'

import { createClient } from '@/utils/supabase/server'
import { headers } from 'next/headers'
import { Resend } from 'resend' // 1. Importar Resend
import { NewLeadEmail } from '@/components/emails/NewLeadEmail' // 2. Importar o template

const resend = new Resend(process.env.RESEND_API_KEY) // 3. Inicializar

export async function submitLead(formData: FormData) {
  const supabase = await createClient()
  const headerStack = await headers()
  const host = headerStack.get('host')

  // --- BUSCAR TENANT ---
  const { data: tenant } = await supabase
    .from('tenants')
    .select('*') // Vamos pegar tudo pra ter o nome da loja
    .eq('domain', host)
    .single()

  if (!tenant) return { success: false, error: 'Loja não encontrada' }

  // --- PROCESSAR DADOS ---
  const name = formData.get('name') as string
  const whatsapp = formData.get('whatsapp') as string
  // Pegue o email se tiver adicionado o campo no formulário, senão fica vazio por enquanto
  const email = formData.get('email') as string || '' 
  const itemsRaw = formData.get('items') as string
  
  let items = []
  try { items = JSON.parse(itemsRaw) } catch (e) { return { success: false } }

  // --- 1. SALVAR NO BANCO ---
  const { error: dbError } = await supabase.from('leads').insert({
    tenant_id: tenant.id,
    customer_name: name,
    customer_email: email, 
    customer_whatsapp: whatsapp,
    items: items,
    status: 'new'
  })

  if (dbError) {
    console.error('Erro Banco:', dbError)
    return { success: false, error: 'Erro ao salvar' }
  }

  // --- 2. ENVIAR EMAIL (RESEND) ---
  try {
    // IMPORTANTE: No plano grátis do Resend, você só pode enviar emails 
    // PARA o email que você cadastrou na conta (o seu email de admin).
    // Quando verificar o domínio, poderá enviar para qualquer um.
    
    // TODO: No futuro, o 'to' será tenant.owner_email (o email do dono da gráfica)
    const emailDestino = 'neiva.lucas13@gmail.com' 

    await resend.emails.send({
      from: 'Orçal Notificações <onboarding@resend.dev>', // Domínio padrão de teste do Resend
      to: emailDestino, 
      subject: `Nova Cotação: ${name} solicitou um orçamento`,
      react: NewLeadEmail({
        customerName: name,
        customerEmail: email,
        customerWhatsapp: whatsapp,
        items: items,
        tenantName: tenant.name
      })
    })

  } catch (emailError) {
    // Se o email falhar, não vamos travar o usuário, pois o lead já tá no banco.
    // Apenas logamos o erro para debug.
    console.error('Erro Resend:', emailError)
  }

  return { success: true }
}