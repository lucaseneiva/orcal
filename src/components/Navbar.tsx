'use client';
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from 'react';
import { ShoppingBag } from "lucide-react";
import { signout } from '@/src/actions/auth.actions'; 
import { useCart } from '@/src/components/providers/cart-provider';

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
  const [isScrolled, setIsScrolled] = useState(false);
  
  const cart = useCart(); 
  const cartCount = mode === 'store' ? cart.items.length : 0;

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;
      
      setIsScrolled(currentScrollY > 10);
      
      if (currentScrollY <= 10) {
        setIsVisible(true);
      } else {
        setIsVisible(currentScrollY < lastScrollY);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', controlNavbar);
    return () => window.removeEventListener('scroll', controlNavbar);
  }, [lastScrollY]);

  return (
    <nav
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      } ${
        isScrolled ? 'shadow-lg backdrop-blur-sm' : 'shadow-md'
      }`}
      style={{ 
        backgroundColor: isScrolled 
          ? `${store.primary_color}ee`
          : store.primary_color 
      }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex justify-between items-center">
        
        {/* Logo Area */}
        <div className="flex items-center gap-4">
          <Link href={mode === 'dashboard' ? '/dashboard' : '/'} className="hover:opacity-90 transition-opacity">
            {store.logo_url ? (
              <div className="relative h-10 w-32">
                <Image 
                  src={store.logo_url} 
                  alt={store.name} 
                  fill 
                  className="object-contain object-left" 
                />
              </div>
            ) : (
              <span className="text-xl font-bold text-white">
                {store.name}
              </span>
            )}
          </Link>
          
          {mode === 'dashboard' && (
            <span className="text-white/70 text-sm border-l border-white/30 pl-4 ml-2">
              Painel
            </span>
          )}
        </div>

        {/* Actions Area */}
        <div className="flex items-center gap-4">
          {mode === 'store' ? (
            <Link href="/checkout">
              <button className="relative p-2.5 text-white hover:bg-white/10 rounded-lg transition-all active:scale-95">
                <ShoppingBag size={22} strokeWidth={2} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-lg animate-pulse">
                    {cartCount}
                  </span>
                )}
              </button>
            </Link>
          ) : (
            <div className="flex gap-3 items-center">
              <span className="text-white/90 text-sm hidden md:block font-medium">
                {userEmail}
              </span>
              <form action={signout}>
                <button className="text-white bg-white/20 hover:bg-white/30 px-4 py-1.5 rounded-lg text-sm font-medium transition-all active:scale-95">
                  Sair
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
      
      {/* Linha sutil na parte inferior - opcional */}
      <div 
        className="h-p w-full opacity-20" 
        style={{ backgroundColor: 'white' }}
      />
    </nav>
  );
}