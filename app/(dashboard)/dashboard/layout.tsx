import { createClient } from "@/lib/utils/supabase/server";
import { redirect } from "next/navigation";
import { getCurrentStore } from "@/lib/utils/get-current-store";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return redirect("/login");

  const store = await getCurrentStore();
  if (!store) return null;

  return (
    // 1. Change Fragment <> to a Flex Container
    <div className="flex flex-col min-h-screen bg-gray-50">
      
      {/* Navbar is fixed, so it sits "above" this flex flow */}
      <Navbar mode="dashboard" store={store} userEmail={user.email || ""} />

      {/* 2. Add 'flex-1'. This pushes the Footer down if content is short */}
      <main className="flex-1 pt-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* Footer stays at the bottom naturally due to flex flow */}
      <Footer storeName={store.name} />
    </div>
  );
}