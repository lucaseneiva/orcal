'use server'

import { createClient } from '@/lib/utils/supabase/server'
import { getCurrentStore } from '@/lib/utils/get-current-store'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// --- ATRIBUTO (PAI) ---

export async function upsertAttribute(formData: FormData) {
  const supabase = await createClient()
  const store = await getCurrentStore()
  if (!store) throw new Error("Loja não encontrada")

  const id = formData.get('id') as string
  const name = formData.get('name') as string
  
  const slug = name.toLowerCase().trim().replace(/\s+/g, '-')
  const payload = { name, slug, store_id: store.id }

  if (id) {
    await supabase.from('attributes').update(payload).eq('id', id)
  } else {
    const { data, error } = await supabase.from('attributes').insert(payload).select().single()
    if (error) console.error('Erro ao criar atributo:', error)
    
    // Se criou novo, redireciona para edição
    if (data) redirect(`/dashboard/attributes/${data.id}/edit`)
  }

  revalidatePath('/dashboard/attributes')
  redirect('/dashboard/attributes')
}

export async function deleteAttribute(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string
  await supabase.from('attributes').delete().eq('id', id)
  
  revalidatePath('/dashboard/attributes')
  redirect('/dashboard/attributes')
}

// --- VALORES (FILHOS) ---

export async function createValue(formData: FormData) {
  const supabase = await createClient()
  
  const attribute_id = formData.get('attribute_id') as string
  const name = formData.get('name') as string
  const meta = formData.get('meta') as string
  
  console.log("Tentando criar valor:", { attribute_id, name, meta }) // DEBUG LOG

  if (!name || !attribute_id) {
    console.error("Dados incompletos para criar valor")
    return
  }

  const { error } = await supabase.from('attribute_values').insert({
    attribute_id,
    name,
    description: meta || null // Garantindo que usa a coluna 'meta'
  })

  if (error) {
    console.error("Erro Supabase Create:", error.message)
    throw new Error(error.message) // Isso vai aparecer no console do servidor
  }

  // Importante: Revalidar a página exata onde o formulário está
  revalidatePath(`/dashboard/attributes/${attribute_id}/edit`)
}

export async function deleteValue(formData: FormData) {
  const supabase = await createClient()
  
  const id = formData.get('id') as string
  const attribute_id = formData.get('attribute_id') as string

  await supabase.from('attribute_values').delete().eq('id', id)

  revalidatePath(`/dashboard/attributes/${attribute_id}/edit`)
}

export async function updateValue(formData: FormData) {
  const supabase = await createClient()

  const id = formData.get('id') as string
  const name = formData.get('name') as string
  const meta = formData.get('meta') as string
  const attribute_id = formData.get('attribute_id') as string

  console.log("Atualizando valor:", { id, meta }) // DEBUG LOG

  // CORREÇÃO 1: Nome da coluna alterado de 'description' para 'meta'
  const { error } = await supabase
    .from('attribute_values')
    .update({
      name,
      description: meta || null, 
    })
    .eq('id', id)

  if (error) {
    console.error("Erro Supabase Update:", error)
    throw error
  }

  // CORREÇÃO 2: Mantendo o usuário na página de edição (/edit)
  const path = `/dashboard/attributes/${attribute_id}/edit`
  
  revalidatePath(path)
  redirect(path) // Isso força o recarregamento da página correta
}