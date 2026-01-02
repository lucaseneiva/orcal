'use client'

import { upsertProduct, deleteProduct } from './actions'
import Link from 'next/link'

// Tipos para ajudar no autocomplete
type Attribute = {
  id: string
  name: string
  attribute_values: { id: string; name: string }[]
}

type ProductFormProps = {
  product?: any
  allAttributes: Attribute[] // Nova prop obrigatória
}

export function ProductForm({ product, allAttributes }: ProductFormProps) {
  
  // Cria um Set com os IDs que o produto JÁ tem, para marcar como checked
  // Precisamos ver como o dado vem do banco. Geralmente vem aninhado.
  // Supondo que você ajustou o SELECT do getStoreProduct para trazer os IDs simples:
  const existingIds = new Set(
    product?.options?.map((opt: any) => opt.value_id) || []
  )

  async function handleSubmit(formData: FormData) {
    const result = await upsertProduct(formData)
    if (result?.error) alert(result.error)
  }

  async function handleDelete(formData: FormData) {
    const result = await deleteProduct(formData)
    if (result?.error) alert(result.error)
  }

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
      
      {/* Coluna Principal (Esquerda) */}
      <div className="md:col-span-2 bg-white p-6 rounded-xl border shadow-sm h-fit">
        <form id="product-form" action={handleSubmit} className="flex flex-col gap-5">
          {product?.id && <input type="hidden" name="id" value={product.id} />}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
            <input name="name" defaultValue={product?.name} required className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-black" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
            <input name="slug" defaultValue={product?.slug} className="w-full border rounded-lg p-2.5 bg-gray-50 outline-none" placeholder="Automático se vazio" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <textarea name="description" defaultValue={product?.description} rows={4} className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-black" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Imagem URL</label>
            <input name="image_url" defaultValue={product?.image_url} type="url" className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-black" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select name="status" defaultValue={product?.status || 'active'} className="w-full border rounded-lg p-2.5 bg-white">
              <option value="active">Ativo</option>
              <option value="inactive">Inativo</option>
            </select>
          </div>
        </form>
      </div>

      {/* Coluna Lateral (Direita) - Atributos */}
      <div className="bg-white p-6 rounded-xl border shadow-sm h-fit">
        <h3 className="font-bold text-gray-900 mb-4">Configurações do Produto</h3>
        
        {allAttributes.length === 0 ? (
          <p className="text-sm text-gray-500">Nenhum atributo cadastrado na loja.</p>
        ) : (
          <div className="space-y-6">
            {allAttributes.map((attr) => (
              <div key={attr.id}>
                <h4 className="text-sm font-semibold text-gray-800 mb-2 uppercase tracking-wider">
                  {attr.name}
                </h4>
                <div className="space-y-2">
                  {attr.attribute_values.map((val) => (
                    <label key={val.id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                      <input 
                        type="checkbox"
                        // O SEGREDO: input fora do form principal, mas usando form="product-form"
                        // OU colocamos tudo dentro do mesmo form tag (recomendado mudar o layout se der)
                        // Para simplificar, vou assumir que este componente está dentro do form, 
                        // mas como separei as divs visualmente, precisamos usar o atributo `form="product-form"`
                        form="product-form"
                        name="selected_values" // Nome fixo para agrupar no array
                        value={val.id}
                        defaultChecked={existingIds.has(val.id)}
                        className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                      />
                      <span className="text-sm text-gray-600">{val.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Botões movidos para cá ou manter embaixo, mas precisam referenciar o form */}
        <div className="mt-8 pt-6 border-t">
            <button 
              type="submit"
              form="product-form"
              className="w-full px-5 py-2.5 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800"
            >
              {product ? 'Salvar Tudo' : 'Criar Produto'}
            </button>
            
            <Link 
            href="/dashboard/products"
            className="block text-center mt-3 text-sm text-gray-500 hover:text-black"
          >
            Cancelar
          </Link>
        </div>

        {/* Delete button (se existir) */}
        {product?.id && (
             <div className="mt-4 pt-4 border-t border-red-100 text-center">
             <form action={handleDelete}>
               <input type="hidden" name="id" value={product.id} />
               <button type="submit" className="text-xs text-red-600 underline">Excluir Produto</button>
             </form>
           </div>
        )}

      </div>
    </div>
  )
}