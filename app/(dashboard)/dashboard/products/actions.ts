'use server'

import { getCurrentStore } from '@/lib/utils/get-current-store'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { deleteProduct, upsertProduct } from '@/lib/data/mutations/products'
import { slugify } from '@/lib/utils/slugfy'
import { replaceAll } from '@/lib/data/mutations/products-attributes'
import { ProductSchema } from '@/lib/validators'
import { ProductInsert } from '@/lib/types/types'

export async function upsertProductAction(formData: FormData) {
  try {
    const store = await getCurrentStore()
    if (!store) throw new Error("Loja não encontrada")

    const selectedAttributeIds = formData.getAll('selected_values') as string[]

    const rawData = {
      id: formData.get('id') || '',
      name: formData.get('name') || '',
      description: formData.get('description') || '',
      image_url: formData.get('image_url') || '',
      slug: formData.get('slug') || '',
      status: formData.get('status') || '',
    }

    const result = ProductSchema.safeParse(rawData)

    if (!result.success) {
      const errorMessage = result.error.issues
        .map((issue) => issue.message)
        .join('. ')
      return { error: errorMessage }
    }

    const data = result.data

    let finalSlug = data.slug
    if (!finalSlug || finalSlug.trim() === '') {
      finalSlug = slugify(data.name)
    }

    const productPayload: ProductInsert = {
      name: data.name,
      description: data.description || null,
      image_url: data.image_url || null,
      slug: finalSlug,
      status: (data.status as "active" | "inactive" | "draft") || 'active',
      store_id: store.id,
    }

    const product = await upsertProduct(data.id || null, store.id, productPayload)

    if (product?.id) {
      await replaceAll(product.id, selectedAttributeIds)
    }

  } catch (error) {
    console.error('Erro ao salvar produto:', error)
    return {
      error: error instanceof Error ? error.message : 'Erro interno ao salvar produto'
    }
  }

  revalidatePath('/dashboard/products')
  redirect('/dashboard/products')
}

export async function deleteProductAction(formData: FormData) {
  const id = formData.get('id') as string;

  if (!id) {
    return { error: 'ID do produto não fornecido.' };
  }

  try {
    await deleteProduct(id);
  } catch (err) {
    console.error('Delete product error:', err);
    return { error: 'Não foi possível deletar o produto.' };
  }

  revalidatePath('/dashboard/products');
  redirect('/dashboard/products');
}