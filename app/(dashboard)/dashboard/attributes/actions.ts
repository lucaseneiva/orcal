'use server'

import { createClient } from '@/lib/utils/supabase/server'
import { getCurrentStore } from '@/lib/utils/get-current-store'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { AttributeRepo } from '@/lib/data/attributes'
import { AttributeValueRepo } from '@/lib/data/attribute-values'
import { AttributeValueInsert } from '@/lib/types/types'

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
    const { error } = await repo.update(id, payload)
    if (error) return { success: false, error: 'Erro ao atualizar' }
  } else {

    const { error, data } = await repo.create(payload)
    if (error) console.error('Erro ao criar atributo:', error)

    if (data) redirect(`/dashboard/attributes/${data.id}/edit`)
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

export async function createValue(formData: FormData) {

  const attribute_id = formData.get('attribute_id') as string
  const id = formData.get('id') as string
  const name = formData.get('name') as string
  const description = formData.get('description') as string

  if (!name || !attribute_id) {
    console.error("Dados incompletos para criar valor")
    return
  }

  const supabase = await createClient()

  const attributeValueRepo = new AttributeValueRepo(supabase)

  const payload: AttributeValueInsert = {
    name: name,
    attribute_id: attribute_id,
    description: description
  }

  attributeValueRepo.create(payload)

  revalidatePath(`/dashboard/attributes/${attribute_id}/edit`)
}

export async function deleteValue(formData: FormData) {
  const supabase = await createClient()

  const id = formData.get('id') as string
  const attribute_id = formData.get('attribute_id') as string

  const repo = new AttributeValueRepo(supabase)

  await repo.delete(id)

  revalidatePath(`/dashboard/attributes/${attribute_id}/edit`)
}

export async function updateValue(formData: FormData) {
  const supabase = await createClient()

  const id = formData.get('id') as string
  const name = formData.get('name') as string
  const attribute_id = formData.get('attribute_id') as string
  const description = formData.get('description') as string

  const payload = {
    name,
    description: description || null,
  }

  const repo = new AttributeValueRepo(supabase)
  
  const { error } = await repo.update(id, payload)

  revalidatePath(`/dashboard/attributes/${attribute_id}/edit`)
}