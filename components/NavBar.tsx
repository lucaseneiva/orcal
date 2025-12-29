"use client";

import { ArrowLeft, ShoppingBag, Menu } from "lucide-react";

type NavbarProps = {
  store: {
    name: string;
    logo_url?: string | null;
    primary_color: string;
  };
};

export function Navbar({ store }: NavbarProps) {
//   const { cartCount } = useCart();

  return (
    <>
      <nav className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 h-20 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-2">
            {store.logo_url ? (
              <img
                src={store.logo_url}
                alt={store.name}
                className="h-10 w-auto object-contain"
              />
            ) : (
              <span className="text-2xl font-bold tracking-tight text-slate-900">
                {store.name}
              </span>
            )}
          </div>

          {/* Ações */}
          <div className="flex items-center gap-6">
            <div className="hidden md:flex space-x-6 text-sm font-medium text-slate-600">
              <a href="#" className="hover:text-slate-900">Todos os Produtos</a>
              <a href="#" className="hover:text-slate-900">Categorias</a>
            </div>

            <button className="relative p-2 rounded-full hover:bg-slate-100">
              <ShoppingBag size={24} style={{ color: store.primary_color }} />
              {/* {cartCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 text-[10px] font-bold text-white px-1.5 py-0.5 rounded-full"
                  style={{ backgroundColor: store.primaryColor }}
                >
                  {cartCount}
                </span>
              )} */}
            </button>

            <button className="md:hidden text-slate-600">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
