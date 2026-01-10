'use client'

import Link from 'next/link'
import { upsertAttribute, deleteAttributeAction } from '../actions'
import { AttributeWithValues } from '@/lib/types/attribute.types'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'

export function AttributeHeaderForm({ attribute }: { attribute?: AttributeWithValues }) {
  const [loading, setLoading] = useState(false)

  // Wrapper to handle the Upsert action
  async function handleUpsert(formData: FormData) {
    setLoading(true)
    const result = await upsertAttribute(formData)
    
  }

  // Wrapper to handle the Delete action
  async function handleDelete(formData: FormData) {
    if (!confirm('Excluir atributo e todos os seus valores?')) return
    
    setLoading(true)
    await deleteAttributeAction(formData)
    // Redirects happen on server
  }

  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
      <div className="flex justify-between items-start">
        <h2 className="text-lg font-bold text-gray-900">Dados do Atributo</h2>
        {attribute?.id && (
          <form action={handleDelete}>
            <input type="hidden" name="id" value={attribute.id} />
            <button 
              type="submit" 
              disabled={loading}
              className="text-xs text-red-500 hover:text-red-700 underline disabled:opacity-50"
            >
              Excluir Atributo
            </button>
          </form>
        )}
      </div>

      {/* Point to the client wrapper, not the server action directly */}
      <form action={handleUpsert} className="flex flex-col gap-4">
        {attribute?.id && <input type="hidden" name="id" value={attribute.id} />}
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
          <input
            name="name"
            defaultValue={attribute?.name}
            placeholder="Ex: Cor, Tamanho"
            required
            disabled={loading}
            className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-black text-gray-700 disabled:bg-gray-100"
          />
        </div>

        <div className="flex gap-4 pt-2">
          <Link href="/dashboard/attributes" className="px-4 py-2 text-sm border rounded hover:bg-gray-50 text-gray-700 flex items-center justify-center">
            Cancelar
          </Link>
          <button 
            type="submit" 
            disabled={loading}
            className="px-4 py-2 text-sm bg-black text-white rounded hover:bg-gray-800 flex-1 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="animate-spin w-4 h-4" />}
            {attribute ? 'Salvar Nome' : 'Criar e Adicionar Valores →'}
          </button>
        </div>
      </form>
    </div>
  )
}