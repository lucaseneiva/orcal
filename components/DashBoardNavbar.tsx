// components/dashboard-navbar.tsx
'use client';
import { signout } from '@/app/login/actions';
import Image from 'next/image';
import Link from 'next/link'; // Import Link
import { useEffect, useState } from 'react';

type DashboardNavbarProps = {
  store: {
    name: string;
    logo_url?: string | null;
    primary_color: string;
  };
  userEmail: string;
};

export function DashboardNavbar({ store, userEmail }: DashboardNavbarProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;

      // Always show if at the top
      if (currentScrollY <= 10) {
        setIsVisible(true);
      } else {
        // Show if scrolling UP, Hide if scrolling DOWN
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
        {/* Logo + Title Section */}
        <div className="flex items-center gap-4">
          {/* Wrapped in Link to /dashboard */}
          <Link 
            href="/dashboard" 
            className="flex items-center gap-4 hover:opacity-80 transition-opacity"
          >
            {store.logo_url ? (
              <div className="relative h-10 w-32">
                <Image
                  src={store.logo_url}
                  alt={`Logo ${store.name}`}
                  fill
                  className="object-contain object-left"
                  priority
                  sizes="128px"
                />
              </div>
            ) : (
              <span className="text-xl font-bold tracking-tight text-white">
                {store.name}
              </span>
            )}
          </Link>
          
          <div className="hidden sm:block h-6 w-px bg-white/20" /> 
          
          <span className="text-sm font-semibold text-white/90">
            Painel Administrativo
          </span>
        </div>

        {/* User Actions Section */}
        <div className="flex gap-6 items-center">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-xs text-white/70 uppercase tracking-widest font-bold">Logado como</span>
            <span className="text-sm text-white font-medium">{userEmail}</span>
          </div>

          <form action={signout}>
            <button className="px-4 py-2 text-sm bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 transition-all font-medium">
              Sair
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
}