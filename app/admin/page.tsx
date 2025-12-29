// app/admin/page.tsx
import { createClient } from '@/lib/utils/supabase/server'
import { redirect } from 'next/navigation'
import { signout } from '../login/actions'

export default async function AdminDashboard() {
    const supabase = await createClient()

    // 1. Pega usuário
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return redirect('/login')

    // 2. Pega o perfil pra saber quem é
    const { data: profile } = await supabase
        .from('profiles')
        .select('*, tenants(*)') // Já traz o nome da empresa se tiver
        .eq('id', user.id)
        .single()

    
    console.log('user', user.id)
    console.log(profile?.role)
    
    // Componente do Botão de Sair (pra reutilizar)
    const SignOutButton = () => (
        <form action={signout}>
            <button className="text-sm text-red-600 underline">Sair do sistema</button>
        </form>
    )

    
    // 👑 VISÃO SUPER ADMIN
    if (profile?.role === 'super_admin') {

        const { data: allTenants } = await supabase.from('tenants').select('*')

        return (
            <div className="p-10 bg-gray-50 min-h-screen">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-purple-700">Painel Mestre 👑</h1>
                    <div className="flex gap-4 items-center">
                        <span>Olá, Chefe ({user.email})</span>
                        <SignOutButton />
                    </div>
                </div>

                <div className="grid gap-4">
                    <h2 className="text-xl font-semibold">Clientes Ativos</h2>
                    {allTenants?.map(tenant => (
                        <div key={tenant.id} className="p-4 bg-white shadow rounded-lg flex justify-between items-center border-l-4 border-purple-500">
                            <div>
                                <p className="font-bold text-lg">{tenant.name}</p>
                                <p className="text-sm text-gray-500">Slug: {tenant.slug}</p>
                            </div>
                            <button className="bg-gray-100 px-4 py-2 rounded text-sm font-medium hover:bg-gray-200">
                                Gerenciar Loja
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    // 👷 VISÃO DO CLIENTE (SEU TIO)
    return (
        <div className="p-10 bg-white min-h-screen">
            <div className="flex justify-between items-center mb-8 border-b pb-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {profile?.tenants?.name || 'Minha Gráfica'}
                    </h1>
                    <p className="text-gray-500">Painel Administrativo</p>
                </div>
                <div className="flex gap-4 items-center">
                    <span className="text-sm text-gray-900">{user.email}</span>
                    <SignOutButton />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Card de Orçamentos */}
                <div className="p-6 border rounded-xl bg-blue-50 hover:shadow-md transition cursor-pointer">
                    <h2 className="text-lg font-bold text-blue-900">Orçamentos</h2>
                    <p className="text-4xl font-extrabold text-blue-600 mt-2">12</p>
                    <p className="text-sm text-blue-400 mt-1">3 não lidos</p>
                </div>

                {/* Card de Produtos */}
                <div className="p-6 border rounded-xl bg-white hover:shadow-md transition cursor-pointer">
                    <h2 className="text-lg font-bold text-gray-900">Catálogo</h2>
                    <p className="text-sm text-gray-500 mt-2">Gerenciar produtos e preços</p>
                    <button className="mt-4 w-full bg-gray-900 text-white py-2 rounded text-sm">
                        Ver Produtos
                    </button>
                </div>
            </div>
        </div>
    )
}