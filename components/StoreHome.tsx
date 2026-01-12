import { Search, ShoppingBag, PackageSearch } from 'lucide-react'
import { ProductCard } from '@/components/ProductCard'
import { Database } from '@/lib/types/database.types'

type Store = Database['public']['Tables']['stores']['Row']
type Product = Database['public']['Tables']['products']['Row']

interface StoreHomeProps {
  store: Store
  products: Product[]
  primaryColor: string 
}

export function StoreHome({ store, products, primaryColor }: StoreHomeProps) {
  const cartCount = 0; 

  return (
    <main className="p-0">
      <header 
        className="py-12 px-6 border-b"
        style={{ 
          backgroundColor: `${primaryColor}08`,
        }}
      >
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
            O que você precisa imprimir na <span style={{ color: primaryColor }}>{store.name}</span> hoje?
          </h1>
          <p className="text-slate-500 text-lg">
            Selecione os itens e monte seu pedido de orçamento online.
          </p>
          
          <div className="relative max-w-xl mx-auto shadow-lg rounded-xl overflow-hidden bg-white border border-slate-100">
            <input 
              type="text" 
              placeholder="Ex: Cartão de visita, Banner, Adesivo..." 
              className="w-full h-14 pl-12 pr-32 outline-none text-slate-700 placeholder:text-slate-400"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <Search size={20} />
            </div>
            <button 
              className="absolute right-2 top-2 bottom-2 px-6 rounded-lg font-bold text-white transition-all hover:brightness-110 active:scale-95"
              style={{ backgroundColor: primaryColor }}
            >
              Buscar
            </button>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto py-12 px-6">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Produtos em Destaque</h2>
            <div className="h-1 w-12 mt-1 rounded-full" style={{ backgroundColor: primaryColor }} />
          </div>
        </div>
        
        {products.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300 flex flex-col items-center justify-center">
            <PackageSearch size={48} className="text-slate-300 mb-4" strokeWidth={1.5} />
            <p className="text-slate-400 font-medium">Nenhum produto disponível no momento.</p>
            <p className="text-slate-300 text-sm">Tente voltar mais tarde ou entrar em contato.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                name={product.name}
                description={product.description || ''}
                id={product.id}
                imageUrl={product.image_url} 
                color={primaryColor}
                slug={product.slug}
              />
            ))}
          </div>
        )}
      </section>

      {cartCount > 0 && (
        <div className="fixed bottom-6 right-6 z-50">
          <button 
            className="flex items-center gap-3 px-6 py-4 rounded-full shadow-2xl text-white font-bold transition-transform hover:scale-105 active:scale-95"
            style={{ backgroundColor: primaryColor }}
          >
            <ShoppingBag size={24} />
            <span>Ver Orçamento ({cartCount})</span>
          </button>
        </div>
      )}
    </main>
  )
}