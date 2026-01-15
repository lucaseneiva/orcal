'use client'

import { Loader2, ArrowRight, Info } from 'lucide-react'

type CheckoutFormProps = {
  onSubmit: (formData: FormData) => void
  loading: boolean

  primaryColor?: string
  submitLabel?: string
  infoText?: string
}

export function CheckoutForm({
  onSubmit,
  loading,
  primaryColor = '#0f172a',
  submitLabel = 'Solicitar Orçamento',
  infoText = 'Este é um pedido de orçamento. O pagamento e a entrega serão combinados diretamente com o vendedor após o contato.',
}: CheckoutFormProps) {
  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl lg:sticky lg:top-8">
      <h2 className="text-xl font-bold text-slate-900 mb-6">
        Informações de Contato
      </h2>

      <form action={onSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 ml-1">
            Seu Nome Completo
          </label>
          <input
            name="name"
            required
            className="w-full bg-slate-50 border border-transparent rounded-xl p-4 outline-none focus:bg-white focus:border-slate-900 transition-all text-slate-900 placeholder:text-slate-400"
            placeholder="Ex: João Silva"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 ml-1">
            Seu melhor Email
          </label>
          <input
            name="email"
            required
            type="email"
            className="w-full bg-slate-50 border border-transparent rounded-xl p-4 outline-none focus:bg-white focus:border-slate-900 transition-all text-slate-900 placeholder:text-slate-400"
            placeholder="seuemail@dominio.com"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 ml-1">
            WhatsApp para Contato
          </label>
          <input
            name="whatsapp"
            required
            type="tel"
            className="w-full bg-slate-50 border border-transparent rounded-xl p-4 outline-none focus:bg-white focus:border-slate-900 transition-all text-slate-900 placeholder:text-slate-400"
            placeholder="(00) 00000-0000"
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full text-white py-4 rounded-2xl font-bold text-lg hover:opacity-90 disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 shadow-lg active:scale-[0.98]"
            style={{ backgroundColor: primaryColor }}
          >
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                <span>{submitLabel}</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>

        <div className="flex gap-3 items-start mt-4 px-2 p-3 bg-blue-50/50 rounded-xl border border-blue-100">
          <div className="text-blue-500 mt-0.5 shrink-0">
            <Info className="w-4 h-4" />
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            {infoText}
          </p>
        </div>
      </form>
    </div>
  )
}
