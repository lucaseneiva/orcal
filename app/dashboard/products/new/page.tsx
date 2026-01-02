import { ProductForm } from '../form'
import Link from 'next/link'

export default function NewProductPage() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto mb-6">
        <Link href="/dashboard/products" className="text-sm text-gray-500 hover:text-black mb-2 inline-block">
          ← Voltar para produtos
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Novo Produto</h1>
      </div>
      
      <ProductForm />
    </div>
  )
}