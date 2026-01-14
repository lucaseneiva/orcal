'use server'

import { getCurrentStore } from '@/lib/utils/get-current-store'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createAttribute, updateAttribute, deleteAttribute } from '@/lib/data/mutations/attributes'
import { createOption, deleteOption, updateOption } from '@/lib/data/mutations/options'
import { OptionInsert } from '@/lib/types/types'
import { AttributeSchema, OptionSchema } from '@/lib/validators' // Import Zod Schemas
import { slugify } from '@/lib/utils/slugfy'

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

  const payload = {
    name,
    slug,
    store_id: store.id
  }

  if (id) {
    await updateAttribute(id, payload)
  } else {
    await createAttribute(payload)
  }

  revalidatePath('/dashboard/attributes')
  redirect('/dashboard/attributes')
}

export async function deleteAttributeAction(formData: FormData) {
  const id = formData.get('id') as string
  if (!id) throw new Error("ID inválido")

  await deleteAttribute(id)

  revalidatePath('/dashboard/attributes')
  redirect('/dashboard/attributes')
}

export async function createOptonAction(formData: FormData) {
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

  const payload: OptionInsert = {
    name,
    attribute_id,
    description: description || null
  }

  await createOption(payload)

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

  const payload = {
    name,
    description: description || null,
  }

  if (id) {
    await updateOption(id, payload)
  }

  revalidatePath(`/dashboard/attributes/${attribute_id}/edit`)
}

export async function deleteOptionAction(formData: FormData) {
  const id = formData.get('id') as string
  const attribute_id = formData.get('attribute_id') as string

  if (!id) return

  await deleteOption(id)

  revalidatePath(`/dashboard/attributes/${attribute_id}/edit`)
}