'use client'

import { AttributeWithOptions } from '@/lib/types/types'
import { useAttributeValues } from '../hooks/useAttributeValues'
import { Edit2, Trash2, X, Check, Info } from 'lucide-react'

export function AttributeValuesManager({ attribute }: { attribute: AttributeWithOptions }) {
  const { 
    formRef, editingId, startEditing, cancelEditing, 
    handleCreate, handleUpdate, handleDelete 
  } = useAttributeValues()

  if (!attribute.id) return null

  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm space-y-6">
      <h2 className="text-lg font-bold text-gray-900">Valores Disponíveis</h2>

      {/* List */}
      <div className="space-y-3">
        {attribute.options.length === 0 && (
          <p className="text-gray-400 text-sm text-center py-4 border-2 border-dashed rounded-lg">
            Nenhum valor cadastrado.
          </p>
        )}

        {attribute.options.map((val) => {
          const isEditing = editingId === val.id

          if (isEditing) {
            return (
              <form key={val.id} action={handleUpdate} className="p-4 bg-gray-50 rounded-lg border border-blue-200 ring-2 ring-blue-500/20 space-y-4">
                <input type="hidden" name="id" value={val.id} />
                <input type="hidden" name="attribute_id" value={attribute.id} />
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Nome</label>
                    <input name="name" defaultValue={val.name} className="w-full p-2 text-sm border rounded" autoFocus />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Descrição</label>
                    <input name="description" defaultValue={val.description || ''} className="w-full p-2 text-sm border rounded" />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={cancelEditing} className="p-2 text-gray-500 hover:bg-gray-200 rounded">
                    <X size={16} />
                  </button>
                  <button type="submit" className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded flex items-center gap-2">
                    <Check size={16} /> Salvar
                  </button>
                </div>
              </form>
            )
          }

          {/* View Mode */}
          return (
            <div key={val.id} className="group flex items-center justify-between p-3 bg-gray-50 border rounded-lg hover:border-gray-300 transition-all">
              <div>
                <div className="font-semibold text-gray-900">{val.name}</div>
                {val.description && (
                  <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                    <Info size={12} /> {val.description}
                  </div>
                )}
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => startEditing(val.id)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded">
                  <Edit2 size={16} />
                </button>
                <button 
                  onClick={() => confirm('Excluir?') && handleDelete(val.id, attribute.id)} 
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Add New */}
      <form ref={formRef} action={handleCreate} className="pt-6 border-t space-y-3">
        <h3 className="text-sm font-semibold text-gray-900">Adicionar Novo Valor</h3>
        <input type="hidden" name="attribute_id" value={attribute.id} />
        
        <div className="flex gap-3">
          <input 
            name="name" 
            placeholder="Nome (ex: GG)" 
            required 
            className="flex-1 border rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-black"
          />
          <input 
            name="description" 
            placeholder="Descrição opcional" 
            className="flex-2 border rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-black"
          />
        </div>
        <button type="submit" className="w-full py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-black">
          + Adicionar Valor
        </button>
      </form>
    </div>
  )
}