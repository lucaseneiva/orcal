'use client'

import { upsertAttribute, deleteAttribute, createValue, deleteValue } from './actions'
import Link from 'next/link'
import { useRef } from 'react'

export function AttributeForm({ attribute }: { attribute?: any }) {
  const formRef = useRef<HTMLFormElement>(null)

  async function handleCreateValue(formData: FormData) {
    await createValue(formData)
    formRef.current?.reset() // Limpa o inputzinho de adicionar valor
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      
      {/* --- PARTE 1: O ATRIBUTO --- */}
      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <h2 className="text-lg font-bold mb-4">Dados do Atributo</h2>
        <form action={upsertAttribute} className="flex flex-col gap-4">
          {attribute?.id && <input type="hidden" name="id" value={attribute.id} />}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Atributo</label>
            <input
              name="name"
              defaultValue={attribute?.name}
              placeholder="Ex: Tamanho, Papel, Cor"
              required
              className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="flex gap-4 pt-2">
            <Link href="/dashboard/attributes" className="px-4 py-2 text-sm border rounded hover:bg-gray-50">
              Cancelar
            </Link>
            <button type="submit" className="px-4 py-2 text-sm bg-black text-white rounded hover:bg-gray-800 flex-1">
              {attribute ? 'Salvar Nome' : 'Criar e Adicionar Valores ->'}
            </button>
          </div>
        </form>
      </div>

      {/* --- PARTE 2: OS VALORES (Só aparece se estiver editando) --- */}
      {attribute?.id && (
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h2 className="text-lg font-bold mb-4">Valores Disponíveis</h2>
          
          {/* Lista de Valores Existentes */}
          <div className="space-y-2 mb-6">
            {attribute.attribute_values?.length === 0 && (
              <p className="text-gray-400 text-sm italic">Nenhum valor cadastrado (ex: P, M, G).</p>
            )}
            
            {attribute.attribute_values?.map((val: any) => (
              <div key={val.id} className="flex items-center justify-between p-3 bg-gray-50 rounded border">
                <span className="font-medium text-gray-800">{val.name}</span>
                
                <form action={deleteValue}>
                  <input type="hidden" name="id" value={val.id} />
                  <input type="hidden" name="attribute_id" value={attribute.id} />
                  <button type="submit" className="text-red-500 hover:text-red-700 text-sm font-bold px-2">
                    X
                  </button>
                </form>
              </div>
            ))}
          </div>

          {/* Adicionar Novo Valor */}
          <form ref={formRef} action={handleCreateValue} className="flex gap-2 border-t pt-4">
            <input type="hidden" name="attribute_id" value={attribute.id} />
            <input 
              name="name" 
              placeholder="Novo valor (ex: Extra Grande)" 
              required
              className="flex-1 border rounded p-2 text-sm outline-none focus:border-black"
            />
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 font-medium">
              + Adicionar
            </button>
          </form>
        </div>
      )}

      {/* --- DELETE ATRIBUTO --- */}
      {attribute?.id && (
         <div className="text-center pt-4">
            <form action={deleteAttribute}>
               <input type="hidden" name="id" value={attribute.id} />
               <button 
                type="submit" 
                className="text-red-600 text-xs underline"
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