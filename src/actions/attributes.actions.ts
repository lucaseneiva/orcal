'use server'

import { getCurrentStore } from '@/src/lib/utils/get-current-store'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/src/lib/utils/supabase/server'
import { AttributeSchema, OptionSchema } from '@/src/lib/validators'
import { slugify } from '@/src/lib/utils/slugfy'

export async function upsertAttribute(formData: FormData) {
  const store = await getCurrentStore()
  if (!store) throw new Error("Loja não encontrada")

  const rawData = {
    id: formData.get('id') || '',
    name: formData.get('name') || '',
  }

  const validation = AttributeSchema.safeParse(rawData)

  if (!validation.success) {
    throw new Error(validation.error.issues[0].message)
  }

  const { id, name } = validation.data
  const slug = slugify(name)
  const supabase = await createClient()

  const payload = {
    name,
    slug,
    store_id: store.id
  }

  if (id) {
    const { error } = await supabase
      .from('attributes')
      .update(payload)
      .eq('id', id)
      .select()

    if (error) throw new Error(error.message)
  } else {
    const { error } = await supabase
      .from('attributes')
      .insert(payload)
      .select()

    if (error) throw new Error(error.message)
  }

  revalidatePath('/dashboard/attributes')
  redirect('/dashboard/attributes')
}

export async function deleteAttributeAction(formData: FormData) {
  const id = formData.get('id') as string
  if (!id) throw new Error("ID inválido")

  const supabase = await createClient()
  const { error } = await supabase
    .from('attributes')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/dashboard/attributes')
  redirect('/dashboard/attributes')
}

export async function createOptionAction(formData: FormData) {
  const rawData = {
    attribute_id: formData.get('attribute_id'),
    name: formData.get('name'),
    description: formData.get('description')
  }

  const validation = OptionSchema.omit({ id: true }).safeParse(rawData)

  if (!validation.success) {
    console.error("Validation Error:", validation.error.issues[0].message)
    return
  }

  const { attribute_id, name, description } = validation.data
  const supabase = await createClient()

  const { error } = await supabase
    .from('options')
    .insert({
      name,
      attribute_id,
      description: description || null
    })

  if (error) console.error("Database Error:", error.message)

  revalidatePath(`/dashboard/attributes/${attribute_id}/edit`)
}

export async function updateOptionAction(formData: FormData) {
  const rawData = {
    id: formData.get('id'),
    attribute_id: formData.get('attribute_id'),
    name: formData.get('name'),
    description: formData.get('description')
  }

  const validation = OptionSchema.safeParse(rawData)

  if (!validation.success) {
    console.error("Validation Error:", validation.error.issues[0].message)
    return
  }

  const { id, attribute_id, name, description } = validation.data
  const supabase = await createClient()


  const { error } = await supabase
    .from('options')
    .update({
      name,
      description: description || null,
    })
    .eq('id', id!)

  if (error) console.error("Database Error:", error.message)

  revalidatePath(`/dashboard/attributes/${attribute_id}/edit`)
}

export async function deleteOptionAction(formData: FormData) {
  const id = formData.get('id') as string
  const attribute_id = formData.get('attribute_id') as string

  if (!id) return

  const supabase = await createClient()
  const { error } = await supabase
    .from('options')
    .delete()
    .eq('id', id)

  if (error) console.error("Database Error:", error.message)

  revalidatePath(`/dashboard/attributes/${attribute_id}/edit`)
}