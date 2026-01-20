import Link from 'next/link'
import { getCurrentStore } from '@/src/lib/utils/get-current-store'
import { notFound, redirect } from 'next/navigation'
import { ResourceEmptyState } from '@/src/components/resource-empty-state'
import { DashboardPageHeader } from '../components/dashboard-page-header'
import { createClient } from '@/src/lib/utils/supabase/server'

export default async function AttributesPage() {
  const store = await getCurrentStore()
  if (!store) redirect('/dashboard')

  const supabase = await createClient()
  const { data: attributes } = await supabase
    .from('attributes')
    .select(`
      *,
      options (*)
    `)
    .eq('store_id', store.id)
    .order('created_at', { ascending: false })
  const primaryColor = store.primary_color
  
  if(attributes == null) return notFound()

  return (
    <div className="p-6">
      <DashboardPageHeader
        title="Atributos"
        backHref="/dashboard"
      >
        <Link
          href="/dashboard/attributes/new"
          className="text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition shadow-sm active:translate-y-0.5"
          style={{ backgroundColor: primaryColor }}
        >
          + Novo Atributo
        </Link>
      </DashboardPageHeader>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {attributes.length === 0   ? (
          <ResourceEmptyState
            title="Nenhum Atributo Cadastrado"
            description="Atributos servem para definir variações como Tamanho, Cor, ou Tipo de Papel."
            actionLabel="+ Criar Primeiro Atributo"
            href="/dashboard/attributes/new"
            primaryColor={primaryColor}
          />
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
    
  )
}