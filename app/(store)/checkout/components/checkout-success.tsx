import Link from 'next/link'
import { Check, ArrowLeft } from 'lucide-react'

export function CheckoutSuccess() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-slate-50">
      <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 animate-bounce">
        <Check className="w-10 h-10" />
      </div>
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Pedido Recebido!</h1>
      <p className="text-slate-600 mb-8 max-w-md">
        Recebemos sua solicitação. Em breve o lojista entrará em contato.
      </p>
      <Link 
        href="/" 
        className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar para a Loja
      </Link>
    </div>
  )
}