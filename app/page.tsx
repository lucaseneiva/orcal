import { createClient } from '@/utils/supabase/server'
import { Hero } from '@/components/Hero'

export default async function Home() {
  const supabase = await createClient()
  
  const { data: tenant } = await supabase
    .from('tenants')
    .select('*')
    .eq('slug', 'vertexgraf')
    .single()

  if (!tenant) return <div>Gráfica não encontrada.</div>

  // Pegamos as cores do JSON que salvamos no banco
  const colors = tenant.colors as { primary: string; secondary: string }

  return (
    <main className="min-h-screen bg-white">
      {/* Menu Simples com a cor secundária (preto) */}
      <nav className="p-6 border-b" style={{ borderColor: colors.primary + '30' }}>
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <span className="text-xl font-bold" style={{ color: colors.secondary }}>
            {tenant.name}
          </span>
          <div className="space-x-4 text-sm font-medium">
            <a href="#" className="hover:opacity-70">Produtos</a>
            <a href="#" className="hover:opacity-70">Sobre</a>
            <a href="#" className="px-4 py-2 rounded-md text-white" style={{ backgroundColor: colors.primary }}>
              Orçamento
            </a>
          </div>
        </div>
      </nav>

      {/* Nosso bloco de construção (Hero) passando os dados do banco */}
      <Hero name={tenant.name} primaryColor={colors.primary} />

      {/* Footerzinho básico */}
      <footer className="mt-20 py-10 border-t text-center text-slate-400 text-sm">
        © {new Date().getFullYear()} {tenant.name} - Plataforma Vertexgraf SaaS
      </footer>
    </main>
  )
}