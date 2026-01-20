'use client'

import { AttributeWithOptions } from '@/lib/types/types'
import { createOptionAction, updateOptionAction, deleteOptionAction } from '../../../../../actions/attributes.actions'
import { Edit2, Trash2, X, Check, Info, Loader2 } from 'lucide-react'
import { useState, useRef } from 'react'

export function OptionsManager({
  attribute,
  primaryColor = '#000000'
}: {
  attribute: AttributeWithOptions,
  primaryColor?: string
}) {
  const formRef = useRef<HTMLFormElement>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Handlers
  async function handleCreate(formData: FormData) {
    setLoading(true)
    await createOptionAction(formData)
    formRef.current?.reset()
    setLoading(false)
  }

  async function handleUpdate(formData: FormData) {
    await updateOptionAction(formData)
    setEditingId(null)
  }

  async function handleDelete(id: string, attributeId: string) {
    if (!confirm('Excluir esta opção?')) return

    const formData = new FormData()
    formData.append('id', id)
    formData.append('attribute_id', attributeId)
    await deleteOptionAction(formData)
  }

  if (!attribute.id) return null

  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm space-y-6">
      <h2 className="text-lg font-bold text-gray-900">Opções Disponíveis</h2>

      <div className="space-y-3">
        {attribute.options.map((val) => {
          const isEditing = editingId === val.id

          if (isEditing) {
            return (
              <form key={val.id} action={handleUpdate} className="p-4 bg-gray-50 rounded-lg border border-blue-200 space-y-4">
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
                  <button type="button" onClick={() => setEditingId(null)} className="p-2 text-gray-500 hover:bg-gray-200 rounded">
                    <X size={16} />
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1.5 text-white text-sm rounded flex items-center gap-2 hover:opacity-90"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <Check size={16} /> Salvar
                  </button>
                </div>
              </form>
            )
          }

          {/* View Mode */ }
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
                <button onClick={() => setEditingId(val.id)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded">
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(val.id, attribute.id)}
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
        <h3 className="text-sm font-semibold text-gray-900">Adicionar Nova Opção</h3>
        <input type="hidden" name="attribute_id" value={attribute.id} />

        <div className="flex gap-3">
          <input
            name="name"
            placeholder="Nome (ex: GG)"
            required
            disabled={loading}
            className="flex-1 border rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-black disabled:bg-gray-100"
          />
          <input
            name="description"
            placeholder="Descrição opcional"
            disabled={loading}
            className="flex-2 border rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-black disabled:bg-gray-100"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex justify-center items-center gap-2"
          style={{ backgroundColor: primaryColor }}
        >
          {loading ? <Loader2 className="animate-spin w-4 h-4" /> : '+ Adicionar Opção'}
        </button>
      </form>
    </div>
  )
}