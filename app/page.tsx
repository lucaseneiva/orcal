import { createClient } from '@/utils/supabase/server'
import { Hero } from '@/components/Hero'
import { ProductCard } from '@/components/ProductCard'
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

  if (!tenant) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="text-center p-10 bg-white rounded-xl shadow-sm border max-w-md">
          <div className="text-6xl mb-4 p-20">🔍</div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            Ops! Página não encontrada
          </h1>
          <p className="text-slate-600 leading-relaxed">
            Não conseguimos encontrar o que você está procurando.
            Verifique se o endereço está correto ou entre em contato com o suporte.
          </p>
        </div>
      </div>
    )
  }

  // 2.5 Buscar produtos DESTE tenant
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('tenant_id', tenant.id)

  // 3. Se não encontrar nada, mostramos uma página genérica ou erro


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

      <section className="max-w-6xl mx-auto py-16 px-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-8">Nossos Produtos</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products?.map((product) => (
            <ProductCard
              key={product.id}
              name={product.name}
              description={product.description}
              id={product.id}
              price={product.price}
              imageUrl={product.image_url}
              color={colors.primary}
            />
          ))}
        </div>
      </section>

      <div className="max-w-6xl mx-auto p-12 text-center">
        <p className="text-slate-400 text-sm">
          Acessando como: <span className="font-mono text-slate-600 font-bold">{host}</span>
        </p>
      </div>

      <footer className="py-10 border-t text-center text-slate-400 text-sm bg-white">
        © {new Date().getFullYear()} {tenant.name} - Plataforma SaaS
      </footer>
    </main>
  )
}