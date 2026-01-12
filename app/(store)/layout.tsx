import { getCurrentStore } from '@/lib/utils/get-current-store';
import { Navbar } from '@/components/Navbar'; // The new component
import { CartProvider } from '@/app/context/cart-context';

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const store = await getCurrentStore();

  if (!store) return null; // Or handle error

  return (
    <CartProvider>
      <Navbar mode="store" store={store} />
      
      {/* FIX: Add Padding Top (pt-20) here to push content below fixed header */}
      <main className="pt-20">
        {children}
      </main>
    </CartProvider>
  );
}