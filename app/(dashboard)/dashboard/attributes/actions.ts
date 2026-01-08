'use server'

import { createClient } from '@/lib/utils/supabase/server'
import { getCurrentStore } from '@/lib/utils/get-current-store'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { AttributeRepo } from '@/lib/repositories/attribute.repo'


export async function upsertAttribute(formData: FormData) {
  const supabase = await createClient()
  const store = await getCurrentStore()
  if (!store) throw new Error("Loja não encontrada")

  const id = formData.get('id') as string
  const name = formData.get('name') as string

  const slug = name.toLowerCase().trim().replace(/\s+/g, '-')
  const payload = { name, slug, store_id: store.id }

  const attributeRepo = new AttributeRepo(supabase)

  if (id) {
    const { error } = await attributeRepo.update(id, payload)
    if (error) console.error('Erro ao atualizar o atributo:', error)
  } else {

    const { error, data } = await attributeRepo.create(payload)
    if (error) console.error('Erro ao criar atributo:', error)

    // Se criou novo, redireciona para edição
    if (data) redirect(`/dashboard/attributes/${data.id}/edit`)
  }

  revalidatePath('/dashboard/attributes')
  redirect('/dashboard/attributes')
}

export async function deleteAttribute(formData: FormData) {
  const supabase = await createClient()
  const attributeRepo = new AttributeRepo(supabase)
  const id = formData.get('id') as string

  attributeRepo.delete(id)

  revalidatePath('/dashboard/attributes')
  redirect('/dashboard/attributes')
}

export async function createValue(formData: FormData) {
  const supabase = await createClient()

  const attribute_id = formData.get('attribute_id') as string
  const name = formData.get('name') as string
  const description = formData.get('description') as string

  console.log("Tentando criar valor:", { attribute_id, name, description }) // DEBUG LOG

  if (!name || !attribute_id) {
    console.error("Dados incompletos para criar valor")
    return
  }

  const { error } = await supabase.from('attribute_values').insert({
    attribute_id,
    name,
    description: description || null // Garantindo que usa a coluna 'meta'
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
  const attribute_id = formData.get('attribute_id') as string

  // ALINHAMENTO: Pegando o valor do campo 'description'
  const description = formData.get('description') as string

  console.log("UPDATE - Recebido:", { id, name, description }) // Debug no terminal

  const { error } = await supabase
    .from('attribute_values')
    .update({
      name,
      description: description || null, // Salvando na coluna correta
    })
    .eq('id', id)

  if (error) {
    console.error("Erro ao atualizar:", error)
    throw error
  }

  revalidatePath(`/dashboard/attributes/${attribute_id}/edit`)
}