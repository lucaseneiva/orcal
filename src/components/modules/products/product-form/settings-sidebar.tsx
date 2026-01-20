'use client'

import Link from 'next/link'
import { AttributeWithOptions, ProductOption } from '@/src/lib/types/types'
import { deleteProductAction } from '../../../../actions/products.actions'
import { toast } from 'sonner'
import { useState } from 'react'

interface ProductSettingsSidebarProps {
  productId?: string
  allAttributes: AttributeWithOptions[]
  currentOptions?: ProductOption[]
  primaryColor: string
}

export function ProductSettingsSidebar({
  productId,
  allAttributes,
  currentOptions = [],
  primaryColor,
}: ProductSettingsSidebarProps) {
  const selectedIds = new Set(currentOptions.map((opt) => opt.option_id))

  const handleDelete = async (formData: FormData) => {
    if (!confirm('Tem certeza? Essa ação não pode ser desfeita.')) return

    const result = await deleteProductAction(formData)
    if (result?.error) toast.error(result.error)
  }

  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm h-fit space-y-6">

      { /* Seção de Atributos */}
      <div>
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          Configurações
        </h3>

        {allAttributes.length === 0 ? (
          <div className="p-4 bg-yellow-50 text-yellow-800 text-sm rounded-lg">
            Você ainda não tem atributos cadastrados (ex: Papel, Cor).
            <br />
            <Link
              href="/dashboard/attributes/new"
              className="underline font-bold mt-1 block"
            >
              Criar Atributos
            </Link>
          </div>
        ) : (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            {allAttributes.map((attr) => {
              const [open, setOpen] = useState(false);

              return (
                <div
                  key={attr.id}
                  className="border border-gray-200 rounded-lg"
                >
                  {/* Header do dropdown */}
                  <button
                    type="button"
                    onClick={() => setOpen(!open)}
                    className="w-full flex items-center justify-between px-4 py-3 text-left"
                  >
                    <span className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                      {attr.name}
                    </span>

                    <span
                      className={`transition-transform ${open ? "rotate-180" : ""
                        }`}
                    >
                      ⌄
                    </span>
                  </button>

                  {/* Conteúdo */}
                  {open && (
                    <div className="px-4 pb-4 space-y-2.5">
                      {attr.options.map((option) => (
                        <label
                          key={option.id}
                          className="flex items-start gap-3 cursor-pointer group hover:bg-gray-50 p-1.5 -ml-1.5 rounded transition-colors"
                        >
                          <input
                            type="checkbox"
                            form="main-form"
                            name="selected_values"
                            value={option.id}
                            defaultChecked={selectedIds.has(option.id)}
                            className="mt-0.5 w-4 h-4 border-gray-300 rounded focus:ring-0 cursor-pointer"
                            style={{ accentColor: primaryColor }}
                          />

                          <div className="text-sm">
                            <span className="text-gray-700 font-medium group-hover:text-gray-900">
                              {option.name}
                            </span>

                            {option.description && (
                              <p className="text-xs text-gray-400 mt-0.5 leading-snug">
                                {option.description}
                              </p>
                            )}
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>


      {/* Botões de Ação */}
      <div className="pt-6 border-t border-gray-100 space-y-3">
        <button
          type="submit"
          form="main-form" // Vincula ao form principal
          className="w-full py-3 text-sm font-bold text-white rounded-xl shadow-md hover:shadow-lg hover:opacity-95 transition-all active:scale-[0.98]"
          style={{ backgroundColor: primaryColor }}
        >
          {productId ? 'Salvar Alterações' : 'Criar Produto'}
        </button>

        <Link
          href="/dashboard/products"
          className="block w-full py-3 text-center text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
        >
          Cancelar
        </Link>
      </div>

      {/* Botão de Exclusão (Formulário Isolado) */}
      {productId && (
        <form action={handleDelete} className="pt-2 text-center">
          <input type="hidden" name="id" value={productId} />
          <button
            type="submit"
            className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors py-2 px-4 rounded hover:bg-red-50"
          >
            Excluir este produto permanentemente
          </button>
        </form>
      )}
    </div>
  )
}