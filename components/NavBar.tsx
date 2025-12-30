"use client";
import { ShoppingBag, Menu } from "lucide-react";

type NavbarProps = {
  store: {
    name: string;
    logo_url?: string | null;
    primary_color: string;
  };
};

export function Navbar({ store }: NavbarProps) {
  // test vercel deployment
  // Uncomment when cart functionality is ready
  // const { cartCount } = useCart();
  const cartCount = 0;

  return (
    <nav 
      className="border-b sticky top-0 z-50 shadow-sm"
      style={{ backgroundColor: store.primary_color }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex justify-between items-center">
        
        {/* Logo Section */}
        <div className="flex items-center">
          {store.logo_url ? (
            <img
              src={store.logo_url}
              alt={`${store.name} logo`}
              className="h-10 w-auto object-contain"
            />
          ) : (
            <span className="text-2xl font-bold tracking-tight text-white">
              {store.name}
            </span>
          )}
        </div>

        {/* Navigation Links - Desktop */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/90">
          <a href="#products" className="hover:text-white transition-colors">
            Todos os Produtos
          </a>
          <a href="#categories" className="hover:text-white transition-colors">
            Categorias
          </a>
        </div>

        {/* Actions Section */}
        <div className="flex items-center gap-4">
          
          {/* Shopping Cart Button */}
          <button 
            className="relative p-2 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Carrinho de compras"
          >
            <ShoppingBag size={24} className="text-white" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 text-xs font-bold text-white bg-red-500 px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Menu"
          >
            <Menu size={24} className="text-white" />
          </button>
        </div>
      </div>
    </nav>
  );
}
