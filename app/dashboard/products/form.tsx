'use client'

import { upsertProduct, deleteProduct } from './actions'
import Link from 'next/link'

export function ProductForm({ product }: { product?: any }) {
  
  // 1. Wrapper para lidar com Criar/Editar
  async function handleSubmit(formData: FormData) {
    const result = await upsertProduct(formData)
    
    if (result?.error) {
      alert(result.error) // Mostra erro simples se houver
    }
  }

  // 2. Wrapper para lidar com Deletar
  async function handleDelete(formData: FormData) {
    const result = await deleteProduct(formData)
    
    if (result?.error) {
      alert(result.error)
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl border shadow-sm">
      {/* 3. Usamos handleSubmit aqui em vez de chamar a action direto */}
      <form action={handleSubmit} className="flex flex-col gap-5">
        
        {product?.id && <input type="hidden" name="id" value={product.id} />}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Produto</label>
          <input
            name="name"
            defaultValue={product?.name}
            required
            className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-black outline-none text-gray-700"
            placeholder="Ex: Cartão de Visita"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL Amigável)</label>
          <input
            name="slug"
            defaultValue={product?.slug}
            className="w-full border rounded-lg p-2.5 bg-gray-50 focus:bg-white transition outline-none text-gray-700"
            placeholder="Deixe vazio para gerar automaticamente"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
          <textarea
            name="description"
            defaultValue={product?.description}
            rows={4}
            className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-black outline-none text-gray-700"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">URL da Imagem</label>
          <input
            name="image_url"
            defaultValue={product?.image_url}
            type="url"
            className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-black outline-none text-gray-700"
            placeholder="https://exemplo.com/imagem.jpg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select 
            name="status" 
            defaultValue={product?.status || 'active'}
            className="w-full border rounded-lg p-2.5 bg-white text-gray-700"
          >
            <option value="active">Ativo</option>   
            <option value="inactive">Inativo</option>
          </select>
        </div>

        <div className="flex items-center gap-4 pt-4 border-t mt-2">
          <Link 
            href="/dashboard/products"
            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancelar
          </Link>
          
          <button 
            type="submit"
            className="px-5 py-2.5 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 flex-1"
          >
            {product ? 'Salvar Alterações' : 'Criar Produto'}
          </button>
        </div>
      </form>

      {product?.id && (
        <div className="mt-8 pt-6 border-t border-red-100">
          <h3 className="text-sm font-bold text-red-900 mb-2">Zona de Perigo</h3>
          
          {/* 4. Usamos handleDelete aqui */}
          <form action={handleDelete}>
            <input type="hidden" name="id" value={product.id} />
            <button 
              type="submit"
              className="text-red-600 text-sm hover:underline bg-red-50 px-3 py-1.5 rounded"
              onClick={(e) => {
                if(!confirm('Tem certeza que deseja excluir este produto?')) {
                  e.preventDefault()
                }
              }}
            >
              Excluir este produto
            </button>
          </form>
        </div>
      )}
    </div>
  )
}