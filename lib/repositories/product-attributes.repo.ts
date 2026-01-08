import { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/types/database.types'



type AttributeRelation = {
  product_id: string
  attribute_value_id: string
}

export class ProductAttributesRepo {
  private supabase

  constructor(supabase: SupabaseClient<Database>) {
    this.supabase = supabase
  }

  /**
   * Busca os IDs dos atributos atuais do produto
   */
  async getCurrentAttributeIds(productId: string): Promise<string[]> {
    const { data, error } = await this.supabase
      .from('product_attribute_values')
      .select('attribute_value_id')
      .eq('product_id', productId)

    if (error) {
      console.error('Erro ao buscar atributos:', error)
      return []
    }

    return data?.map(item => item.attribute_value_id) || []
  }

  /**
   * Estratégia 1: Delete + Insert (mais simples, atual)
   */
  async replaceAll(productId: string, newAttributeIds: string[]) {
    // Remove tudo
    const { error: deleteError } = await this.supabase
      .from('product_attribute_values')
      .delete()
      .eq('product_id', productId)

    if (deleteError) {
      throw new Error(`Erro ao limpar atributos: ${deleteError.message}`)
    }

    // Insere os novos (se houver)
    if (newAttributeIds.length === 0) return

    const payload: AttributeRelation[] = newAttributeIds.map(valueId => ({
      product_id: productId,
      attribute_value_id: valueId
    }))

    const { error: insertError } = await this.supabase
      .from('product_attribute_values')
      .insert(payload)

    if (insertError) {
      throw new Error(`Erro ao inserir atributos: ${insertError.message}`)
    }
  }

  /**
   * Estratégia 2: Diff (mais eficiente, mantém timestamps)
   */
  async syncAttributes(productId: string, newAttributeIds: string[]) {
    const currentIds = await this.getCurrentAttributeIds(productId)

    // Calcula o que adicionar e o que remover
    const toAdd = newAttributeIds.filter(id => !currentIds.includes(id))
    const toRemove = currentIds.filter(id => !newAttributeIds.includes(id))

    // Remove apenas o que precisa
    if (toRemove.length > 0) {
      const { error } = await this.supabase
        .from('product_attribute_values')
        .delete()
        .eq('product_id', productId)
        .in('attribute_value_id', toRemove)

      if (error) console.error('Erro ao remover atributos:', error)
    }

    // Adiciona apenas o que precisa
    if (toAdd.length > 0) {
      const payload: AttributeRelation[] = toAdd.map(valueId => ({
        product_id: productId,
        attribute_value_id: valueId
      }))

      const { error } = await this.supabase
        .from('product_attribute_values')
        .insert(payload)

      if (error) console.error('Erro ao adicionar atributos:', error)
    }
  }
}