'use server'

import { createClient } from '@/lib/utils/supabase/server'
import { getCurrentStore } from '@/lib/utils/get-current-store'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { AttributeRepo } from '@/lib/repositories/attribute.repo'

// --- 1. Attribute Actions (Parent) ---

export async function upsertAttribute(formData: FormData) {
  const supabase = await createClient()
  const store = await getCurrentStore()
  if (!store) throw new Error("Loja não encontrada")

  const id = formData.get('id') as string
  const name = formData.get('name') as string
  const slug = name.toLowerCase().trim().replace(/\s+/g, '-')
  
  const payload = { name, slug, store_id: store.id }
  const repo = new AttributeRepo(supabase)

  if (id) {
    // Update
    const { error } = await repo.update(id, payload)
    if (error) return { success: false, error: 'Erro ao atualizar' }
  } else {
    // Create
    const { error, data } = await repo.create(payload)
    if (error || !data) return { success: false, error: 'Erro ao criar' }
    
    // Redirect to edit mode immediately after create
    redirect(`/dashboard/attributes/${data.id}/edit`)
  }

  revalidatePath('/dashboard/attributes')
  redirect('/dashboard/attributes')
}

export async function deleteAttribute(formData: FormData) {
  const supabase = await createClient()
  const repo = new AttributeRepo(supabase)
  const id = formData.get('id') as string

  await repo.delete(id)
  revalidatePath('/dashboard/attributes')
  redirect('/dashboard/attributes')
}

// --- 2. Value Actions (Children) ---

export async function manageAttributeValue(formData: FormData) {
  const supabase = await createClient()
  
  const actionType = formData.get('_action') // 'create' | 'update' | 'delete'
  const attribute_id = formData.get('attribute_id') as string
  const id = formData.get('id') as string
  const name = formData.get('name') as string
  const description = formData.get('description') as string

  try {
    if (actionType === 'delete') {
      await supabase.from('attribute_values').delete().eq('id', id)
    } 
    else if (actionType === 'update') {
      await supabase
        .from('attribute_values')
        .update({ name, description: description || null })
        .eq('id', id)
    } 
    else { // create
      if (!name) return { success: false, error: 'Nome obrigatório' }
      await supabase
        .from('attribute_values')
        .insert({
          attribute_id,
          name,
          description: description || null
        })
    }

    revalidatePath(`/dashboard/attributes/${attribute_id}/edit`)
    return { success: true }
  } catch (error) {
    console.error("Error managing value:", error)
    return { success: false, error: 'Erro interno' }
  }
}