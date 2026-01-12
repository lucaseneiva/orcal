import { createClient } from '@/lib/utils/supabase/server';
import { redirect } from 'next/navigation';
import { getCurrentStore } from '@/lib/utils/get-current-store';
import { Navbar } from '@/components/Navbar'; // Reusing the same component!

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return redirect('/login');
  
  const store = await getCurrentStore();

  return (
    <>
      {store && (
        <Navbar 
          mode="dashboard" 
          store={store} 
          userEmail={user.email || ''} 
        />
      )}
      
      {/* FIX: Add Padding Top here too */}
      <main className="pt-20">
        {children}
      </main>
    </>
  );
}