// app/admin/page.tsx
import { createClient } from '@/lib/utils/supabase/server'
import { redirect } from 'next/navigation'
import { signout } from '../login/actions'
import { getCurrentStore } from '@/lib/utils/get-current-store'
import { ProfileService } from '@/lib/services/profile-service'
import { profile } from 'console'

export default async function AdminDashboard() {
    const supabase = await createClient()
    const profileService = new ProfileService(supabase)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return redirect('/login')
    const profile = profileService.findById(user.id)
    const store = await getCurrentStore()
    
    
    // Componente do Botão de Sair (pra reutilizar)
    const SignOutButton = () => (
        <form action={signout}>
            <button className="text-sm text-red-600 underline">Sair do sistema</button>
        </form>
    )

    return (
        <div className="p-10 bg-white min-h-screen">
            <div className="flex justify-between items-center mb-8 border-b pb-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {  }  
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