'use client';

import { useCart } from '@/app/context/cart-context';
import { ShoppingBag } from "lucide-react";
import Link  from "next/link";

type StoreNavbarProps = {
  store: {
    name: string;
    logo_url?: string | null;
    primary_color: string;
  };
};

export function StoreNavbar({ store }: StoreNavbarProps) {
  const cartCount = useCart().items.length;
  
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

        {/* Actions Section */}
        <div className="flex items-center gap-4">
          <Link href="/checkout" prefetch={false}>
          
          <button
            className="relative p-2 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Pedido"
          >
            <ShoppingBag size={24} className="text-white" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 text-xs font-bold text-white bg-red-500 px-1.5 py-0.5 rounded-full min-w-5 text-center">
                {cartCount}
              </span>
            )}
          </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}