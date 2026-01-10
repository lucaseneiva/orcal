import { getCurrentStore } from '@/lib/utils/get-current-store'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getAllProductsByStoreId } from '@/lib/data/queries/products'
import { ProductRaw } from '@/lib/types/types'

export default async function ProductsPage() {
  const store = await getCurrentStore()
  if (!store) redirect('/dashboard')

  const products = await getAllProductsByStoreId(store.id)

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Link href="/dashboard/" className="text-sm text-gray-500 mb-4 block">← Voltar</Link>

      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Seus Produtos</h1>
          </div>

          <Link
            href="/dashboard/products/new"
            className="bg-black text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800"
          >
            + Novo Produto
          </Link>
        </div>

        <div className="bg-white border rounded-xl overflow-hidden">
          {!products?.length ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Nenhum produto cadastrado</h3>
              <p className="text-gray-500 mb-6">Comece adicionando seu primeiro produto.</p>
              <Link href="/dashboard/products/new" className="inline-block bg-black text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800">
                + Cadastrar Primeiro Produto
              </Link>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Nome do Produto</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="p-4 text-right text-sm font-semibold text-gray-700">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {/* Now using the Product type generated from the database */}
                {products.map((product: ProductRaw) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <div className="font-medium text-gray-900">{product.name}</div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        product.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                          product.status === 'active' ? 'bg-green-500' : 'bg-gray-500'
                        }`} />
                        {product.status === 'active' ? 'Ativo' : product.status === 'draft' ? 'Rascunho' : 'Inativo'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Link
                        href={`/dashboard/products/${product.id}/edit`}
                        className="bg-black text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800"
                      >
                        Editar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}