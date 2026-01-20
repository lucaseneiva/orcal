'use client'

import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'

type EmptyCartViewProps = {
  primaryColor?: string
  title?: string
  description?: string
  ctaLabel?: string
  ctaHref?: string
}

export function EmptyCartView({
  primaryColor = '#0f172a',
  title = 'Seu orçamento está vazio',
  description = 'Adicione produtos para solicitar um orçamento.',
  ctaLabel = 'Explorar Produtos',
  ctaHref = '/',
}: EmptyCartViewProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-white">
      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
        <ShoppingBag className="w-8 h-8" />
      </div>

      <h2 className="text-2xl font-bold text-slate-900 mb-4">
        {title}
      </h2>

      <p className="text-slate-500 mb-6">
        {description}
      </p>

      <Link
        href={ctaHref}
        className="text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 transition"
        style={{ backgroundColor: primaryColor }}
      >
        {ctaLabel}
      </Link>
    </div>
  )
}
