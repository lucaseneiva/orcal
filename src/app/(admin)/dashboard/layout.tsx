import { createClient } from "@/src/lib/utils/supabase/server";
import { notFound, redirect } from "next/navigation";
import { getCurrentStore } from "@/src/lib/utils/get-current-store";
import { Navbar } from "@/src/components/layout/navbar";
import { Footer } from "@/src/components/layout/footer";
import { checkUserStoreAccess } from "@/src/lib/utils/check-auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const store = await getCurrentStore();

  if (!store) return notFound();

  const { isAuthorized, user } = await checkUserStoreAccess(store.id);

  if (!user) {
    return redirect("/login");
  }

  if (!isAuthorized) {
    return notFound();
  }
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">

      <Navbar mode="dashboard" store={store} userEmail={user?.email || ""} />

      <main className="flex-1 pt-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </main>

      <Footer storeName={store.name} primaryColor={store.primary_color} />
    </div>
  );
}