'use server'

import { createClient } from '@/lib/utils/supabase/server'
import { getCurrentStore } from '@/lib/utils/get-current-store'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { ProductRepo } from '@/lib/data/products'
import { slugify } from '@/lib/utils/slugfy'
import { ProductAttributesRepo } from '@/lib/data/product-attributes'
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

    
    const productRepo = new ProductRepo(await createClient())
    const product = await productRepo.upsert(id, store.id, productPayload)
    
    // 5. Sincroniza atributos
    const attributesRepo = new ProductAttributesRepo(await createClient())
    
    // Escolha uma das estratégias:
    
    // Opção A: Simples (delete + insert) - usa a atual
    await attributesRepo.replaceAll(product.id, selectedAttributeIds)
    
    // Opção B: Eficiente (diff) - recomendada se tiver timestamps
    // await attributesRepo.syncAttributes(product.id, selectedAttributeIds)

    // 6. Revalida e redireciona
    
    
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

  const supabase = await createClient();
  const productRepo = new ProductRepo(supabase);

  try {
    await productRepo.deleteProduct(id);
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