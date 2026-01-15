import Link from 'next/link'
import { AttributeHeaderForm } from '../components/attribute-header-form'
import { getCurrentStore } from '@/lib/utils/get-current-store'
import NotFound from '@/app/not-found'

export default async function NewAttributePage() {

  const store = await getCurrentStore()
  if (!store) return NotFound()
    
  return (

    <div className="p-8 bg-gray-50 min-h-screen">

      <Link href="/dashboard/attributes" className="text-sm text-gray-500 mb-4 block">← Voltar</Link>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-900">Novo Atributo</h1>
        <AttributeHeaderForm primaryColor={store.primary_color} />
      </div>

    </div>
  )
}