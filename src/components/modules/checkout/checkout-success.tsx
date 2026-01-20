'use client'

import Link from 'next/link'
import { Check, ArrowLeft } from 'lucide-react'

type CheckoutSuccessProps = {
  primaryColor?: string
  title?: string
  description?: string
  backLabel?: string
  backHref?: string
}

export function CheckoutSuccess({
  primaryColor = '#16a34a',
  title = 'Pedido Recebido!',
  description = 'Recebemos sua solicitação. Em breve o lojista entrará em contato.',
  backLabel = 'Voltar para a Loja',
  backHref = '/',
}: CheckoutSuccessProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-slate-50">
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mb-6 animate-bounce"
        style={{
          backgroundColor: `${primaryColor}20`,
          color: primaryColor,
        }}
      >
        <Check className="w-10 h-10" />
      </div>

      <h1 className="text-3xl font-bold text-slate-900 mb-2">
        {title}
      </h1>

      <p className="text-slate-600 mb-8 max-w-md">
        {description}
      </p>

      <Link
        href={backHref}
        className="text-white px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-all flex items-center gap-2"
        style={{ backgroundColor: primaryColor }}
      >
        <ArrowLeft className="w-4 h-4" />
        {backLabel}
      </Link>
    </div>
  )
}
