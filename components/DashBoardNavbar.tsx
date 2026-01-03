// components/dashboard-navbar.tsx
'use client';
import { signout } from '@/app/login/actions';

type DashboardNavbarProps = {
  store: {
    name: string;
    logo_url?: string | null;
    primary_color: string;
  };
  userEmail: string;
};

export function DashboardNavbar({ store, userEmail }: DashboardNavbarProps) {
  return (
    <nav
      className="border-b sticky top-0 z-50 shadow-sm"
      style={{ backgroundColor: store.primary_color }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex justify-between items-center">
        {/* Logo + Title Section */}
        <div className="flex items-center gap-3">
          {store.logo_url ? (
            <img
              src={store.logo_url}
              alt={`${store.name} logo`}
              className="h-10 w-auto object-contain"
            />
          ) : (
            <span className="text-xl font-bold tracking-tight text-white">
              {store.name}
            </span>
          )}
          <span className="text-sm font-semibold text-white/90">
            Painel Administrativo
          </span>
        </div>

        {/* User Actions Section */}
        <div className="flex gap-4 items-center">
          <span className="text-sm text-white/90">{userEmail}</span>
          <form action={signout}>
            <button className="text-sm text-white underline hover:text-white/80 transition-colors">
              Sair do sistema
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
}