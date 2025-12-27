import { Hero } from '@/components/Hero'
import { ProductCard } from '@/components/ProductCard'

interface StoreLayoutProps {
  store: any
  products: any[]
  primaryColor: string 
  host: string
}

export function StoreLayout({ store, products, primaryColor, host }: StoreLayoutProps) {
  return (
    <main className="min-h-screen bg-white">
      <nav className="p-6 border-b" style={{ borderColor: primaryColor + '30' }}>
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <span className="text-xl font-bold" style={{ color: primaryColor }}>
            {store.name}
          </span>
          <div className="space-x-4 text-sm font-medium">
            <a href="#" className="hover:opacity-70">Produtos</a>
            <a href="#" className="hover:opacity-70">Sobre</a>
            <a 
              href="#" 
              className="px-4 py-2 rounded-md text-white shadow-sm transition-all hover:brightness-110" 
              style={{ backgroundColor: primaryColor }}
            >
              Orçamento
            </a>
          </div>
        </div>
      </nav>

      <Hero name={store.name} primaryColor={primaryColor} />

      <section className="max-w-6xl mx-auto py-16 px-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-8">Nossos Produtos</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              name={product.name}
              description={product.description}
              id={product.id}
              price={product.price}
              imageUrl={product.image_url}
              color={primaryColor}
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
        © {new Date().getFullYear()} {store.name} - Plataforma SaaS
      </footer>
    </main>
  )
}