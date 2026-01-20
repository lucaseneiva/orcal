import { createClient } from '@/src/lib/utils/supabase/server'
import { redirect } from 'next/navigation'
import { getCurrentStore } from '@/src/lib/utils/get-current-store'
import { DashboardCards } from '../../../components/layout/dashboard-cards'
export default async function AdminDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return redirect('/login')
  
  const store = await getCurrentStore()

  return (
    <div className="p-10">
      <div className="max-w-2xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-6">
          <DashboardCards primaryColor={store!.primary_color}></DashboardCards>
        </div>
      </div>
    </div>
  )
}