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
  
  // Slug simples
  const slug = name.toLowerCase().trim().replace(/\s+/g, '-')

  const payload = { name, slug, store_id: store.id }

  if (id) {
    await supabase.from('attributes').update(payload).eq('id', id)
  } else {
    const { data } = await supabase.from('attributes').insert(payload).select().single()
    // Se criou novo, redireciona para edição para poder adicionar valores
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
  
  if (!name || !attribute_id) return

  await supabase.from('attribute_values').insert({
    attribute_id,
    name // Geralmente o valor é igual ao nome, ou meta dado
  })

  revalidatePath(`/dashboard/attributes/${attribute_id}/edit`)
}

export async function deleteValue(formData: FormData) {
  const supabase = await createClient()
  
  const id = formData.get('id') as string
  const attribute_id = formData.get('attribute_id') as string // Para revalidar a tela certa

  await supabase.from('attribute_values').delete().eq('id', id)

  revalidatePath(`/dashboard/attributes/${attribute_id}/edit`)
}