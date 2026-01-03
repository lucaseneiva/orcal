'use server'

import { createClient } from '@/lib/utils/supabase/server'
import { getCurrentStore } from '@/lib/utils/get-current-store'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// Utilitário simples para gerar slug
function slugify(text: string) {
  return text.toString().toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Substitui espaços por -
    .replace(/[^\w\-]+/g, '') // Remove caracteres não alfanuméricos
    .replace(/\-\-+/g, '-')   // Substitui múltiplos - por um único -
}
export async function upsertProduct(formData: FormData) {
  const supabase = await createClient()
  const store = await getCurrentStore()

  if (!store) throw new Error("Loja não encontrada")

  const id = formData.get('id') as string
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const image_url = formData.get('image_url') as string
  const status = formData.get('status') as string

  // 1. Pega todos os valores marcados nos checkboxes
  // O getAll pega todos os inputs com name="selected_values"
  const selectedValues = formData.getAll('selected_values') as string[]

  let slug = formData.get('slug') as string
  if (!slug || slug.trim() === '') {
    slug = slugify(name)
  }

  const payload = {
    name,
    description,
    image_url,
    slug,
    status,
    store_id: store.id
  }

  let productId = id
  let error;

  // --- 2. SALVAR PRODUTO ---
  if (id) {
    const { error: updateError } = await supabase
      .from('products')
      .update(payload)
      .eq('id', id)
      .eq('store_id', store.id)
    error = updateError
  } else {
    const { data: newProduct, error: insertError } = await supabase
      .from('products')
      .insert(payload)
      .select()
      .single()
      
    if (newProduct) productId = newProduct.id
    error = insertError
  }

  if (error) {
    console.error(error)
    return { error: 'Erro ao salvar produto' }
  }

  // --- 3. SALVAR ATRIBUTOS (O PULO DO GATO) ---
  if (productId) {
    // A. Removemos todas as relações antigas desse produto (limpeza)
    await supabase
      .from('product_attribute_values')
      .delete()
      .eq('product_id', productId)

    // B. Se houver checkboxes marcados, criamos as novas relações
    if (selectedValues.length > 0) {
      const attributesPayload = selectedValues.map(valueId => ({
        product_id: productId,
        attribute_value_id: valueId
      }))

      const { error: attrError } = await supabase
        .from('product_attribute_values')
        .insert(attributesPayload)
      
      if (attrError) console.error('Erro ao salvar atributos:', attrError)
    }
  }

  revalidatePath('/dashboard/products')
  redirect('/dashboard/products')
}

export async function deleteProduct(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string
  
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)

  if (error) {
    return { error: 'Erro ao deletar' }
  }

  revalidatePath('/dashboard/products')
  redirect('/dashboard/products')
}