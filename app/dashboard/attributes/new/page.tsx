import { AttributeForm } from '../form'
import Link from 'next/link'

export default function NewAttributePage() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <Link href="/dashboard/attributes" className="text-sm text-gray-500 mb-4 block">← Voltar</Link>
      <h1 className="text-2xl font-bold mb-6 text-center">Novo Atributo</h1>
      <AttributeForm />
    </div>
  )
}