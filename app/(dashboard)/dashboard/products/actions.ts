'use server'

import { getCurrentStore } from '@/lib/utils/get-current-store'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { deleteProduct, upsertProduct } from '@/lib/data/mutations/products'
import { slugify } from '@/lib/utils/slugfy'
import { replaceAll } from '@/lib/data/mutations/products-attributes'
import { ProductInsert } from '@/lib/types/types'

export async function upsertProductAction(formData: FormData) {
  try {
    // 1. Validação inicial
    const store = await getCurrentStore()
    if (!store) throw new Error("Loja não encontrada")

    // 2. Extrai dados do form
    const id = formData.get('id') as string | null
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const image_url = formData.get('image_url') as string
    const status = null
    const selectedAttributeIds = formData.getAll('selected_values') as string[]
    
    let slug = formData.get('slug') as string
    if (!slug?.trim()) {
      slug = slugify(name)
    }
  
    
    const productPayload: ProductInsert = {
      name,
      description,
      image_url,
      slug,
      status,
      store_id: store.id,

    }

    
    const product = await upsertProduct(id, store.id, productPayload)
    
    replaceAll(product.id, selectedAttributeIds)
    
    
  } catch (error) {
    console.error('Erro ao salvar produto:', error)
    return { 
      error: error instanceof Error ? error.message : 'Erro ao salvar produto' 
    }
  }

  revalidatePath('/dashboard/products')
  redirect('/dashboard/products')
}

export async function deleteProductAction(formData: FormData) {
  const id = formData.get('id') as string;

  // 1. Basic Validation
  if (!id) {
    return { error: 'ID do produto não fornecido.' };
  }

  try {
    await deleteProduct(id);
  } catch (err) {
    // 2. Log the actual error for debugging
    console.error('Delete product error:', err);
    // 3. Return a user-friendly message
    return { error: 'Não foi possível deletar o produto.' };
  }

  // 4. Revalidate and Redirect OUTSIDE the try/catch block
  revalidatePath('/dashboard/products');
  redirect('/dashboard/products');
}