'use client'

import { upsertAttribute, deleteAttribute, createValue, deleteValue, updateValue } from './actions'
import Link from 'next/link'
import { useRef, useState } from 'react'

export function AttributeForm({ attribute }: { attribute?: any }) {
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

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
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

      {attribute?.id && (
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h2 className="text-lg font-bold mb-4 text-gray-900">Valores Disponíveis</h2>
          
          {/* Lista de Valores Existentes */}
          <div className="space-y-3 mb-6">
            {attribute.attribute_values?.length === 0 && (
              <p className="text-gray-500 text-sm italic">Nenhum valor cadastrado (ex: P, M, G).</p>
            )}
            
            {attribute.attribute_values?.map((val: any) => (
              <div key={val.id} className="p-4 bg-gray-50 rounded-lg border">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-semibold text-gray-900">{val.name}</span>
                      <button
                        type="button"
                        onClick={() => startEditingMeta(val.id, val.meta)}
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                      >
                        {val.meta ? '✏️ Editar descrição' : '+ Adicionar descrição'}
                      </button>
                    </div>
                    
                    {/* Mostrar descrição atual se existir e não estiver editando */}
                    {val.meta && editingValue !== val.id && (
                      <p className="text-sm text-gray-600 bg-white p-3 rounded border border-gray-200">
                        {val.meta}
                      </p>
                    )}

                    {/* Form de edição de descrição */}
                    {editingValue === val.id && (
                      <form action={updateValue} className="mt-2 space-y-2">
                        <input type="hidden" name="id" value={val.id} />
                        <input type="hidden" name="attribute_id" value={attribute.id} />
                        <input type="hidden" name="name" value={val.name} />
                        
                        <textarea
                          name="meta"
                          value={editMeta}
                          onChange={(e) => setEditMeta(e.target.value)}
                          placeholder="Adicione uma descrição detalhada para este valor..."
                          rows={3}
                          className="w-full border rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-black text-gray-700 resize-none"
                        />
                        
                        <div className="flex gap-2">
                          <button
                            type="submit"
                            onClick={() => setEditingValue(null)}
                            className="bg-green-600 text-white px-3 py-1.5 rounded text-sm hover:bg-green-700 font-medium"
                          >
                            Salvar
                          </button>
                          <button
                            type="button"
                            onClick={cancelEditing}
                            className="bg-gray-300 text-gray-700 px-3 py-1.5 rounded text-sm hover:bg-gray-400 font-medium"
                          >
                            Cancelar
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                  
                  {/* Botão de deletar */}
                  <form action={deleteValue}>
                    <input type="hidden" name="id" value={val.id} />
                    <input type="hidden" name="attribute_id" value={attribute.id} />
                    <button 
                      type="submit" 
                      className="text-red-500 hover:text-red-700 text-sm font-bold px-2 py-1"
                      onClick={(e) => {
                        if (!confirm(`Excluir "${val.name}"?`)) {
                          e.preventDefault()
                        }
                      }}
                    >
                      🗑️
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>

          {/* Form para adicionar novo valor */}
          <form ref={formRef} action={handleCreateValue} className="border-t pt-6 space-y-3">
            <h3 className="font-semibold text-gray-900 text-sm">Adicionar Novo Valor</h3>
            
            <input type="hidden" name="attribute_id" value={attribute.id} />
            
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Nome do Valor</label>
              <input 
                name="name" 
                placeholder="Ex: Extra Grande, Couché 300g" 
                required
                className="w-full border rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-black text-gray-700"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Descrição (opcional)
              </label>
              <textarea
                name="meta"
                placeholder="Descreva as características deste valor..."
                rows={2}
                className="w-full border rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-black text-gray-700 resize-none"
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-green-600 text-white px-4 py-2.5 rounded-lg text-sm hover:bg-green-700 font-medium"
            >
              + Adicionar Valor
            </button>
          </form>
        </div>
      )}

      {attribute?.id && (
         <div className="text-center pt-4">
            <form action={deleteAttribute}>
               <input type="hidden" name="id" value={attribute.id} />
               <button 
                type="submit" 
                className="text-red-600 text-xs underline hover:text-red-800"
                onClick={e => !confirm('Isso apagará o atributo e TODOS os seus valores. Continuar?') && e.preventDefault()}
               >
                 Excluir Atributo "{attribute.name}"
               </button>
            </form>
         </div>
      )}

    </div>
  )
}