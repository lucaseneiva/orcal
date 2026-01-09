'use client';

import { useCart } from '@/app/context/cart-context';
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from 'react';

type StoreNavbarProps = {
  store: {
    name: string;
    logo_url?: string | null;
    primary_color: string;
  };
};

export function StoreNavbar({ store }: StoreNavbarProps) {
  const { items } = useCart();
  const cartCount = items.length;
  
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 10) {
        setIsVisible(true);
      } else {
        if (currentScrollY < lastScrollY) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', controlNavbar);
    return () => window.removeEventListener('scroll', controlNavbar);
  }, [lastScrollY]);
  
  return (
    <nav
      className={`border-b fixed w-full top-0 z-50 shadow-sm transition-transform duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
      style={{ backgroundColor: store.primary_color }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex justify-between items-center">
        {/* Logo Section */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            {store.logo_url ? (
              <div className="relative h-10 w-32 sm:w-40">
                <Image
                  src={store.logo_url}
                  alt={`Logo ${store.name}`}
                  fill
                  className="object-contain object-left"
                  priority
                  sizes="(max-width: 768px) 128px, 160px"
                />
              </div>
            ) : (
              <span className="text-2xl font-bold tracking-tight text-white">
                {store.name}
              </span>
            )}
          </Link>
        </div>

        {/* Actions Section */}
        <div className="flex items-center gap-4">
          <Link href="/checkout" prefetch={false} aria-label="Ver meu pedido">
            <button
              className="relative p-2 rounded-full hover:bg-white/10 transition-colors group"
              type="button"
            >
              <ShoppingBag size={24} className="text-white group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 text-[10px] font-bold text-white bg-red-600 px-1.5 py-0.5 rounded-full min-w-5 h-5 flex items-center justify-center border-2 border-transparent shadow-lg animate-in zoom-in">
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