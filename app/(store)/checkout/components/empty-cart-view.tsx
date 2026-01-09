import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'

export function EmptyCartView() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-white">
      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
          <ShoppingBag className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-4">Seu orçamento está vazio</h2>
      <p className="text-slate-500 mb-6">Adicione produtos para solicitar um orçamento.</p>
      <Link href="/" className="bg-slate-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-slate-800 transition-colors">
        Explorar Produtos
      </Link>
    </div>
  )
}