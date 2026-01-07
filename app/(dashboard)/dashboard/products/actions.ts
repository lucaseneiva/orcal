'use server'

import { createClient } from '@/lib/utils/supabase/server'
import { getCurrentStore } from '@/lib/utils/get-current-store'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { deleteProduct } from '@/lib/data/products.dao'
import { slugify } from '@/lib/utils/slugfy'
import { ProductAttributesDAO } from '@/lib/data/product-attributes.dao'
import { upsert } from '@/lib/data/products.dao'
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

    // 4. Salva produto via DAO
    // const productDAO = new ProductDAO()
    const product = await upsert(id, store.id, productPayload)
    
    // 5. Sincroniza atributos
    const attributesDAO = new ProductAttributesDAO(await createClient())
    
    // Escolha uma das estratégias:
    
    // Opção A: Simples (delete + insert) - usa a atual
    await attributesDAO.replaceAll(product.id, selectedAttributeIds)
    
    // Opção B: Eficiente (diff) - recomendada se tiver timestamps
    // await attributesDAO.syncAttributes(product.id, selectedAttributeIds)

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
  const id = formData.get('id') as string
  
   try {
    await deleteProduct(id)
  } catch (error) {
    return { error: 'Não foi possível deletar.' } 
  }

  revalidatePath('/dashboard/products')
  redirect('/dashboard/products')
}