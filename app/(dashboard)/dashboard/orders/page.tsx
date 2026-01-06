import { createClient } from '@/lib/utils/supabase/server'
import { getCurrentStore } from '@/lib/utils/get-current-store'
import { redirect } from 'next/navigation'
import { OrderCard } from './components/OrderCard'

export default async function OrdersPage() {
  const supabase = await createClient()
  const store = await getCurrentStore()
  
  if (!store) redirect('/')

  // Buscar pedidos (Do mais recente para o antigo)
  const { data: orders, error } = await supabase
    .from('quote_requests')
    .select('*')
    .eq('store_id', store.id)
    .order('created_at', { ascending: false })

  if (!orders || orders.length === 0) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-2">Pedidos de Orçamento</h1>
        <div className="p-12 border-2 border-dashed rounded-xl bg-gray-50 mt-6">
          <p className="text-gray-500">Nenhum pedido recebido ainda.</p>
        </div>
      </div>
    )
  }

  const newOrdersCount = orders.filter(o => !o.viewed).length

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Pedidos de Orçamento</h1>
          <p className="text-sm text-gray-500 mt-1">
            {newOrdersCount > 0 ? (
              <span className="text-blue-600 font-semibold">
                {newOrdersCount} novo{newOrdersCount > 1 ? 's' : ''} pedido{newOrdersCount > 1 ? 's' : ''}
              </span>
            ) : (
              'Todos os pedidos visualizados'
            )}
          </p>
        </div>

        <span className="text-sm bg-gray-100 px-3 py-1 rounded-full text-gray-600">
          Total: {orders.length}
        </span>
      </div>

      <div className="grid gap-4">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  )
}