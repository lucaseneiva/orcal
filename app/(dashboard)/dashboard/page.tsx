// app/dashboard/page.tsx
import { createClient } from '@/lib/utils/supabase/server'
import { redirect } from 'next/navigation'
import { getCurrentStore } from '@/lib/utils/get-current-store'
import Link from 'next/link'

export default async function AdminDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return redirect('/login')
  
  const store = await getCurrentStore()

  return (
    <div className="p-10 bg-white min-h-screen">
      <div className="max-w-2xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Card de Produtos */}
          <div className="p-6 border rounded-xl bg-white hover:shadow-md transition cursor-pointer flex flex-col">
            <h2 className="text-lg font-bold text-gray-900">
              Catálogo de Produtos
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Gerenciar produtos
            </p>
            <Link
              href="/dashboard/products"
              className="mt-4 inline-block bg-black text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 w-fit"
            >
              Ver Produtos
            </Link>
          </div>

          {/* Card de Atributos */}
          <div className="p-6 border rounded-xl bg-white hover:shadow-md transition cursor-pointer flex flex-col">
            <h2 className="text-lg font-bold text-gray-900">
              Atributos Cadastrados
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Gerenciar os atributos para produtos
            </p>
            <Link
              href="/dashboard/attributes"
              className="mt-4 inline-block bg-black text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 w-fit"
            >
              Ver Atributos
            </Link>
          </div>

          {/* Card de Atributos */}
          <div className="p-6 border rounded-xl bg-white hover:shadow-md transition cursor-pointer flex flex-col">
            <h2 className="text-lg font-bold text-gray-900">
              Pedidos de Orçamento
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Gerenciar os seus pedidos de orçamento
            </p>
            <Link
              href="/dashboard/orders"
              className="mt-4 inline-block bg-black text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 w-fit"
            >
              Ver Pedidos
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}