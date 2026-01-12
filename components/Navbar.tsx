// components/Navbar.tsx
'use client';

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from 'react';
import { ShoppingBag } from "lucide-react";
import { signout } from '@/app/login/actions'; // Adjust path
import { useCart } from '@/app/context/cart-context';

type NavbarProps = {
  mode: 'store' | 'dashboard';
  store: {
    name: string;
    logo_url?: string | null;
    primary_color: string;
  };
  userEmail?: string;
};

export function Navbar({ mode, store, userEmail }: NavbarProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  // Use cart only if in store mode, otherwise safe fallback
  const cart = useCart(); 
  const cartCount = mode === 'store' ? cart.items.length : 0;

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY <= 10) setIsVisible(true);
      else setIsVisible(currentScrollY < lastScrollY);
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', controlNavbar);
    return () => window.removeEventListener('scroll', controlNavbar);
  }, [lastScrollY]);

  return (
    <nav
      className={`border-b fixed w-full top-0 z-50 shadow-sm transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
      style={{ backgroundColor: store.primary_color }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex justify-between items-center">
        {/* Logo Area */}
        <div className="flex items-center gap-4">
          <Link href={mode === 'dashboard' ? '/dashboard' : '/'}>
            {store.logo_url ? (
              <div className="relative h-10 w-32">
                <Image src={store.logo_url} alt={store.name} fill className="object-contain object-left" />
              </div>
            ) : (
              <span className="text-xl font-bold text-white">{store.name}</span>
            )}
          </Link>
          {mode === 'dashboard' && <span className="text-white/80 text-sm border-l pl-4 ml-2">Painel</span>}
        </div>

        {/* Actions Area */}
        <div className="flex items-center gap-4">
          {mode === 'store' ? (
            <Link href="/checkout">
              <button className="relative p-2 text-white">
                <ShoppingBag />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>
            </Link>
          ) : (
            <div className="flex gap-4 items-center">
               <span className="text-white text-sm hidden md:block">{userEmail}</span>
               <form action={signout}>
                 <button className="text-white bg-white/20 px-3 py-1 rounded text-sm">Sair</button>
               </form>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}