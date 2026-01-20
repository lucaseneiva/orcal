'use server'

import { createClient } from '@/src/lib/utils/supabase/server'
import { getCurrentStore } from '@/src/lib/utils/get-current-store'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { ProductSchema } from '@/src/lib/validators'
import { slugify } from '@/src/lib/utils/slugfy'

export async function upsertProductAction(formData: FormData) {
  const supabase = await createClient()
  const store = await getCurrentStore()

  if (!store) {
    return { error: 'Sessão inválida ou loja não encontrada.' }
  }

  const rawData = {
    id: formData.get('id') || '',
    name: formData.get('name'),
    description: formData.get('description'),
    image_url: formData.get('image_url'),
    slug: formData.get('slug'),
    status: formData.get('status'),
  }

  const validation = ProductSchema.safeParse(rawData)

  if (!validation.success) {
    return { error: validation.error.issues[0].message }
  }

  const data = validation.data

  const finalSlug = data.slug && data.slug.trim() !== ''
    ? slugify(data.slug)
    : slugify(data.name)

  try {
    const productPayload = {
      store_id: store.id,
      name: data.name,
      description: data.description || null,
      image_url: data.image_url || null,
      slug: finalSlug,
      status: (data.status as 'active' | 'inactive' | 'draft') || 'active',
      updated_at: new Date().toISOString()
    }

    let productId = data.id

    if (productId) {
      const { error } = await supabase
        .from('products')
        .update(productPayload)
        .eq('id', productId)
        .eq('store_id', store.id)

      if (error) throw error
    } else {
      const { data: newProduct, error } = await supabase
        .from('products')
        .insert(productPayload)
        .select('id')
        .single()

      if (error) throw error
      productId = newProduct.id
    }

    const selectedOptions = formData.getAll('selected_values') as string[]

    if (productId) {
      await supabase
        .from('products_options')
        .delete()
        .eq('product_id', productId)

      if (selectedOptions.length > 0) {
        const relations = selectedOptions.map(optionId => ({
          product_id: productId,
          option_id: optionId
        }))

        const { error: relError } = await supabase
          .from('products_options')
          .insert(relations)

        if (relError) throw relError
      }
    }

  } catch (error) {
    console.error('Erro ao salvar produto:', error)
    return { error: 'Erro interno ao salvar os dados. Tente novamente.' }
  }

  revalidatePath('/dashboard/products')
  redirect('/dashboard/products')
}

export async function deleteProductAction(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string

  if (!id) return { error: 'ID inválido' }

  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    if (error) throw error

  } catch (error) {
    console.error('Delete error:', error)
    return { error: 'Erro ao excluir o produto.' }
  }

  revalidatePath('/dashboard/products')
  redirect('/dashboard/products')
}