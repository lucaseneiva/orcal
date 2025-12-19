import { createClient } from '@/utils/supabase/server'

export default async function Home() {
  const supabase = await createClient() 
  
  const { data: tenants } = await supabase
    .from('tenants')
    .select('*')
    .eq('slug', 'vertexgraf')
    .single()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-slate-50">
      <div className="z-10 w-full max-w-md p-8 bg-white rounded-xl shadow-lg border border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          {tenants?.name || 'Cliente não encontrado'}
        </h1>
        <p className="text-sm text-slate-500 mb-6">
          Status do Banco: <span className="text-green-600 font-bold underline">Conectado</span>
        </p>
        
        <div className="p-4 bg-blue-50 rounded-md border border-blue-100">
          <p className="text-sm text-blue-700 font-medium text-center">
            🚀 MVP Vertexgraf Online
          </p>
        </div>
      </div>
    </main>
  )
}