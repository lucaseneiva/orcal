import Link from 'next/link'
import { getCurrentStore } from '@/lib/utils/get-current-store'
import { getAttributesByStoreId } from '@/lib/data/queries/attributes'
import { redirect } from 'next/navigation'

export default async function AttributesPage() {
  const store = await getCurrentStore()
  if (!store) redirect('/dashboard')

  const attributes = await getAttributesByStoreId(store.id)
  const primaryColor = store.primary_color

  return (
    <div className="p-6">
      <Link href="/dashboard/" className="text-sm text-gray-500 mb-4 block">← Voltar</Link>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Seus Atributos</h1>
          <Link
            href="/dashboard/attributes/new"
            style={{ backgroundColor: primaryColor }}
            className="text-white px-4 py-2 rounded text-sm font-bold hover:opacity-90 transition-opacity"
          >
            + Novo Atributo
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          {attributes.length === 0 ? (
            <div className="p-12 text-center text-gray-500">Nenhum atributo criado.</div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-4 text-sm font-semibold text-gray-900">Nome</th>
                  <th className="p-4 text-sm font-semibold text-gray-900">Valores</th>
                  <th className="p-4 text-right text-sm font-semibold text-gray-900">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {attributes.map((attr) => (
                  <tr key={attr.id} className="hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-700">{attr.name}</td>
                    <td className="p-4 text-sm text-gray-500">
                      {attr.options.map(v => v.name).join(', ') || '-'}
                    </td>
                    <td className="p-4 text-right">
                      <Link
                        href={`/dashboard/attributes/${attr.id}/edit`}
                        className="text-sm font-medium hover:underline"
                        style={{ color: primaryColor }}
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