import { Search, ShoppingBag, ArrowLeft, Menu } from 'lucide-react' // Instale: npm i lucide-react
import { ProductCard } from '@/components/ProductCard'

interface StoreLayoutProps {
  store: any
  products: any[]
  primaryColor: string 
  host: string
}

export function StoreLayout({ store, products, primaryColor, host }: StoreLayoutProps) {
  // Simulando contagem do carrinho (no futuro virá de um contexto/estado)
  const cartCount = 0; 

  return (
    <main className="min-h-screen bg-slate-50 font-sans">
      <header 
        className="py-12 px-6 border-b"
        style={{ 
          backgroundColor: `${primaryColor}08`, // 5% de opacidade da cor primária
        }}
      >
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
            O que você precisa imprimir hoje?
          </h1>
          <p className="text-slate-500 text-lg">
            Selecione os itens e monte seu orçamento online instantaneamente.
          </p>
          
          {/* Barra de Busca "Heroica" */}
          <div className="relative max-w-xl mx-auto shadow-lg rounded-lg overflow-hidden bg-white">
            <input 
              type="text" 
              placeholder="Ex: Cartão de visita, Banner, Adesivo..." 
              className="w-full h-14 pl-12 pr-4 outline-none text-slate-700 placeholder:text-slate-400"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <Search size={20} />
            </div>
            <button 
              className="absolute right-2 top-2 bottom-2 px-6 rounded-md font-medium text-white transition-all hover:brightness-110"
              style={{ backgroundColor: primaryColor }}
            >
              Buscar
            </button>
          </div>
        </div>
      </header>

      {/* 4. Grid de Produtos */}
      <section className="max-w-6xl mx-auto py-12 px-6">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-xl font-bold text-slate-800">Destaques</h2>
          {/* Futuro: Filtros aqui */}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              name={product.name}
              description={product.description}
              id={product.id}
              price={product.price}
              imageUrl={product.image_url}
              color={primaryColor}
              slug={product.slug}

            />
          ))}
        </div>
      </section>

      {/* Footer Simples */}
      <footer className="border-t bg-white mt-12">
        <div className="max-w-6xl mx-auto py-10 px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>© {new Date().getFullYear()} {store.name} - Todos os direitos reservados.</p>
          <div className="flex items-center gap-2">
            <span>Powered by</span>
            <span className="font-bold text-slate-700">Orçal</span>
          </div>
        </div>
      </footer>
    </main>
  )
}