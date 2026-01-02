import { createClient } from '@/lib/utils/supabase/server'
import { redirect } from 'next/navigation'
import { signout } from '../login/actions'
import { getCurrentStore } from '@/lib/utils/get-current-store'
import Link from 'next/link'

export default async function AdminDashboard() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return redirect('/login')

    const store = await getCurrentStore()

    return (
        <div className="p-10 bg-white min-h-screen">
            <div className="flex justify-between items-center mb-8 border-b pb-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {store?.name || 'Minha Loja'}
                    </h1>
                    <p className="text-gray-500">Painel Administrativo</p>
                </div>
                <div className="flex gap-4 items-center">
                    <span className="text-sm text-gray-900">{user.email}</span>
                    <form action={signout}>
                        <button className="text-sm text-red-600 underline">Sair do sistema</button>
                    </form>
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-4">
                <div className="column md:grid-cols-3 gap-6">
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

                </div>
            </div>
        </div>
    )
}      