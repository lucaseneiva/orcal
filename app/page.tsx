import { createClient } from '@/utils/supabase/server'
import { Hero } from '@/components/Hero'
import { headers } from 'next/headers' // Importamos os headers

export default async function Home() {
  const supabase = await createClient()
  
  // 1. Pegamos o domínio que está sendo acessado (ex: localhost:3000 ou vertexgraf.com.br)
  const headerStack = await headers()
  const host = headerStack.get('host')

  // 2. Buscamos no banco o tenant que é dono desse domínio
  const { data: tenant } = await supabase
    .from('tenants')
    .select('*')
    .eq('domain', host) // <-- A MÁGICA ACONTECE AQUI
    .single()

  // 3. Se não encontrar nada, mostramos uma página genérica ou erro
  if (!tenant) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="text-center p-10 bg-white rounded-xl shadow-sm border">
          <h1 className="text-2xl font-bold text-slate-800">Domínio não configurado ⚠️</h1>
          <p className="text-slate-500 mt-2">Este endereço não está vinculado a nenhuma gráfica.</p>
          <p className="text-xs text-slate-400 mt-4 italic">Host detectado: {host}</p>
        </div>
      </div>
    )
  }

  // 4. Se encontrou, extraímos as cores e renderizamos o site
  const colors = tenant.colors as { primary: string; secondary: string }

  return (
    <main className="min-h-screen bg-white">
      <nav className="p-6 border-b" style={{ borderColor: colors.primary + '30' }}>
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <span className="text-xl font-bold" style={{ color: colors.secondary }}>
            {tenant.name}
          </span>
          <div className="space-x-4 text-sm font-medium">
            <a href="#" className="hover:opacity-70">Produtos</a>
            <a href="#" className="hover:opacity-70">Sobre</a>
            <a href="#" className="px-4 py-2 rounded-md text-white shadow-sm transition-all hover:brightness-110" style={{ backgroundColor: colors.primary }}>
              Orçamento
            </a>
          </div>
        </div>
      </nav>

      <Hero name={tenant.name} primaryColor={colors.primary} />
      
      <div className="max-w-6xl mx-auto p-12 text-center">
        <p className="text-slate-400 text-sm">
          Acessando como: <span className="font-mono text-slate-600 font-bold">{host}</span>
        </p>
      </div>
    </main>
  )
}