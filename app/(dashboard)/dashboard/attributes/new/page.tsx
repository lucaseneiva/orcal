import Link from 'next/link'
import { AttributeHeaderForm } from '../components/attribute-header-form'

export default function NewAttributePage() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">

      <Link href="/dashboard/attributes" className="text-sm text-gray-500 mb-4 block">← Voltar</Link>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-900">Novo Atributo</h1>
        <AttributeHeaderForm />
      </div>
      
    </div>
  )
}