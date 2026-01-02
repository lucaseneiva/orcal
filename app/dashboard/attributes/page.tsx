import Link from 'next/link'
import { getCurrentStore } from '@/lib/utils/get-current-store'
import { getProductService } from '@/lib/services/product-service'
import { redirect } from 'next/navigation'

export default async function AttributesPage() {
  const store = await getCurrentStore()
  if (!store) redirect('/dashboard')

  const productService = await getProductService()
  const attributes = await productService.getStoreAttributes(store.id)

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Atributos</h1>
          <Link href="/dashboard/attributes/new" className="bg-black text-white px-4 py-2 rounded text-sm font-bold hover:bg-gray-800">
            + Novo Atributo
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          {attributes.length === 0 ? (
            <div className="p-8 text-center text-gray-500">Nenhum atributo criado.</div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-4 text-sm font-semibold">Nome</th>
                  <th className="p-4 text-sm font-semibold">Valores</th>
                  <th className="p-4 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {attributes.map((attr: any) => (
                  <tr key={attr.id} className="hover:bg-gray-50">
                    <td className="p-4 font-medium">{attr.name}</td>
                    <td className="p-4 text-sm text-gray-500">
                      {attr.attribute_values.map((v: any) => v.name).join(', ') || '-'}
                    </td>
                    <td className="p-4 text-right">
                      <Link href={`/dashboard/attributes/${attr.id}/edit`} className="text-blue-600 hover:underline text-sm font-medium">
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