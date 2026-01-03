// app/dashboard/layout.tsx
import { createClient } from '@/lib/utils/supabase/server'
import { redirect } from 'next/navigation'
import { getCurrentStore } from '@/lib/utils/get-current-store'
import { DashboardNavbar } from '@/components/DashBoardNavbar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return redirect('/login')
  
  const store = await getCurrentStore()

  return (
    <>
      {store && (
        <DashboardNavbar 
          store={store} 
          userEmail={user.email || ''} 
        />
      )}
      {children}
    </>
  )
}