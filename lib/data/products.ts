import { createClient } from '@/lib/utils/supabase/server'
import { ProductWithDetails, ProductOption, ProductRaw, ProductInsert } from '@/lib/types/types'
import { Database } from '../types/database.types'
import { SupabaseClient } from '@supabase/supabase-js'

export class ProductRepo {
  private supabase

  constructor(supabase: SupabaseClient<Database>) {
    this.supabase = supabase
  }

  async getFromStore(storeId: string) {
    const { data } = await this.supabase
      .from('products')
      .select('*')
      .eq('store_id', storeId)
    return data || []
  }

  async findBySlugAndStoreId(slug: string, storeId: string) {

    const { data } = await this.supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .eq('store_id', storeId)
      .single()
    return data || null
  }

  async getStoreProduct(storeId: string, slug: string): Promise<ProductWithDetails | null> {
    const { data, error } = await this.supabase
      .from('products')
      .select(`
      *,
      product_attribute_values (
        attribute_values (
          id,
          name,
          description, 
          attributes (
            id,
            name,
            slug
          )
        )
      )
    `)
      .eq('store_id', storeId)
      .eq('slug', slug)
      .single();

    if (error || !data) {
      console.error('Produto não encontrado:', error);
      return null;
    }

    // --- TRANSFORMAÇÃO DE DADOS ---

    const options: ProductOption[] = data.product_attribute_values.map((pav: any) => {
      const val = pav.attribute_values;
      const attr = val.attributes;

      return {
        value_id: val.id,
        value_name: val.name,
        description: val.description,
        attribute_value_description: val.description,
        attribute_id: attr.id,
        attribute_name: attr.name,
        attribute_slug: attr.slug,
      };
    });

    const product: ProductWithDetails = {
      id: data.id,
      name: data.name,
      description: data.description,
      image_url: data.image_url,
      slug: data.slug,
      options: options,
      created_at: data.created_at,
      status: data.status,
      updated_at: data.updated_at,
      store_id: data.store_id,
      display_order: data.display_order
    };

    return product;
  }


  async getById(productId: string) {

    const { data, error } = await this.supabase
      .from('products')
      .select(`
        id,
        name,
        description,
        slug,
        image_url,
        status,
        store_id,
        product_attribute_values (
          attribute_values (
            id,
            name,
            description
          )
        )
      `)
      .eq('id', productId)
      .single()

    if (error || !data) return null

    // --- TRANSFORMAÇÃO IMPORTANTE ---
    // Precisamos converter o retorno aninhado do banco para o formato "plano"
    // que o nosso formulário espera (array de options)

    const options = data.product_attribute_values.map((pav: any) => ({
      value_id: pav.attribute_values.id,
      value_name: pav.attribute_values.name
    }))

    return {
      ...data,
      options // O formulário vai usar isso para marcar os checkboxes
    }
  }

  async create(payload: ProductInsert) {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('products')
      .insert(payload)
      .select()
      .single()

    if (error) throw new Error(`Erro ao criar produto: ${error.message}`)
    return data
  }


  async update(id: string, storeId: string, payload: ProductInsert) {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('products')
      .update(payload)
      .eq('id', id)
      .eq('store_id', storeId)
      .select()
      .single()

    if (error) throw new Error(`Erro ao atualizar produto: ${error.message}`)
    return data
  }


  async upsert(id: string | null, storeId: string, payload: ProductInsert) {
    if (id) {
      return this.update(id, storeId, payload)
    }
    return this.create(payload)
  }

  async deleteProduct(id: string) {
    const supabase = await createClient()
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    if (error) {
      return { error: 'Erro ao deletar' }
    }
  }
}












