import { getCurrentStore } from "@/src/lib/utils/get-current-store";
import { Navbar } from "@/src/components/layout/navbar";
import { Footer } from "@/src/components/layout/footer";

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const store = await getCurrentStore();
  if (!store) return null;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      
      <Navbar mode="store" store={store} />

      <main className="flex-1 pt-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </main>

      <Footer storeName={store.name} primaryColor={store.primary_color}/>
    </div>
  );
}
