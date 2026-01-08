'use client'

import { upsertAttribute, deleteAttribute, createValue, deleteValue, updateValue } from './actions'
import Link from 'next/link'
import { useRef, useState } from 'react'

// --- Types ---

interface AttributeValue {
  id: string
  attribute_id: string
  name: string
  description?: string | null
  meta?: string | null 
}

export interface Attribute {
  id: string
  name: string
  attribute_values: AttributeValue[]
}

interface AttributeFormProps {
  attribute?: Attribute
}

// --- Component ---

export function AttributeForm({ attribute }: AttributeFormProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const [editingValue, setEditingValue] = useState<string | null>(null)
  const [editMeta, setEditMeta] = useState<string>('')

  async function handleCreateValue(formData: FormData) {
    await createValue(formData)
    formRef.current?.reset()
  }

  function startEditingMeta(valueId: string, currentMeta: string | null) {
    setEditingValue(valueId)
    setEditMeta(currentMeta || '')
  }

  function cancelEditing() {
    setEditingValue(null)
    setEditMeta('')
  }

  async function handleUpdateValue(formData: FormData) {
    try {
      await updateValue(formData) 
      setEditingValue(null)
    } catch (e) {
      console.error("ERRO:", e)
      alert("Erro ao salvar.")
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">

      {/* 1. Attribute Header Data */}
      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <h2 className="text-lg font-bold mb-4 text-gray-900">Dados do Atributo</h2>
        <form action={upsertAttribute} className="flex flex-col gap-4">
          {attribute?.id && <input type="hidden" name="id" value={attribute.id} />}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Atributo</label>
            <input
              name="name"
              defaultValue={attribute?.name}
              placeholder="Ex: Tamanho, Papel, Cor"
              required
              className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-black text-gray-700"
            />
          </div>

          <div className="flex gap-4 pt-2">
            <Link href="/dashboard/attributes" className="px-4 py-2 text-sm border rounded hover:bg-gray-50 text-gray-700">
              Cancelar
            </Link>
            <button type="submit" className="px-4 py-2 text-sm bg-black text-white rounded hover:bg-gray-800 flex-1">
              {attribute ? 'Salvar Nome' : 'Criar e Adicionar Valores →'}
            </button>
          </div>
        </form>
      </div>

      {/* 2. Values List (Only shows if attribute exists) */}
      {attribute?.id && (
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h2 className="text-lg font-bold mb-4 text-gray-900">Valores Disponíveis</h2>

          <div className="space-y-4 mb-8">
            {attribute.attribute_values?.length === 0 && (
              <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed">
                <p className="text-gray-500 text-sm">Nenhum valor cadastrado ainda.</p>
              </div>
            )}

            {attribute.attribute_values?.map((val: AttributeValue) => {
              const isEditing = editingValue === val.id

              return (
                <div
                  key={val.id}
                  className={`transition-all duration-200 rounded-xl ${
                    isEditing
                      ? 'bg-white ring-2 ring-black shadow-lg scale-[1.01] z-10'
                      : 'bg-gray-50 border hover:border-gray-300'
                  }`}
                >
                  {isEditing ? (
                    <form action={handleUpdateValue} className="p-5 flex flex-col gap-4">
                      <input type="hidden" name="id" value={val.id} />
                      <input type="hidden" name="attribute_id" value={attribute.id} />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-gray-500 uppercase">Nome</label>
                          <input
                            name="name"
                            defaultValue={val.name}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                            autoFocus
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-gray-500 uppercase">Descrição</label>
                          <input
                            name="description" 
                            defaultValue={editMeta || val.description || val.meta || ''} 
                            placeholder="Ex: Detalhes sobre o acabamento..."
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end items-center gap-3 pt-2 border-t mt-2">
                        <button type="button" onClick={cancelEditing} className="text-sm text-gray-600 hover:text-black px-3 py-1.5 font-medium">
                          Cancelar
                        </button>
                        <button type="submit" className="bg-black text-white text-sm px-4 py-1.5 rounded-md hover:bg-gray-800 font-medium">
                          Salvar
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="p-4 flex items-center justify-between gap-4 group">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-gray-900 truncate">{val.name}</span>
                          {(val.description || val.meta) && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                              Com descrição
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                          {val.description || val.meta || 'Sem descrição adicional'}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => startEditingMeta(val.id, val.description || val.meta || null)}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                        </button>

                        <form action={deleteValue}>
                          <input type="hidden" name="id" value={val.id} />
                          <input type="hidden" name="attribute_id" value={attribute.id} />
                          <button
                            type="submit"
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full"
                            onClick={(e) => !confirm(`Excluir "${val.name}"?`) && e.preventDefault()}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                          </button>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Add New Value Form */}
          <form ref={formRef} action={handleCreateValue} className="border-t pt-6 space-y-3">
            <h3 className="font-semibold text-gray-900 text-sm">Adicionar Novo Valor</h3>
            <input type="hidden" name="attribute_id" value={attribute.id} />
            <input
              name="name"
              placeholder="Ex: Extra Grande"
              required
              className="w-full border rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-black text-gray-700"
            />
            <textarea
              name="meta"
              placeholder="Descrição (opcional)"
              rows={2}
              className="w-full border rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-black text-gray-700 resize-none"
            />
            <button type="submit" className="w-full bg-green-600 text-white px-4 py-2.5 rounded-lg text-sm hover:bg-green-700 font-medium">
              + Adicionar Valor
            </button>
          </form>
        </div>
      )}

      {/* 3. Delete Attribute Footer */}
      {attribute?.id && (
        <div className="text-center pt-4">
          <form action={deleteAttribute}>
            <input type="hidden" name="id" value={attribute.id} />
            <button
              type="submit"
              className="text-red-600 text-xs underline hover:text-red-800"
              onClick={(e) => !confirm('Isso apagará o atributo e TODOS os seus valores. Continuar?') && e.preventDefault()}
            >
              Excluir Atributo &quot;{attribute.name}&quot;
            </button>
          </form>
        </div>
      )}

    </div>
  )
}