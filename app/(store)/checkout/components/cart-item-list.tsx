import Image from 'next/image'
import { X, Image as ImageIcon } from 'lucide-react'
import { CartItem } from '@/lib/types/types'

interface CartItemListProps {
  items: CartItem[]
  onRemove: (index: number) => void
}

export function CartItemList({ items, onRemove }: CartItemListProps) {
  return (
    <div className="lg:col-span-3">
      <div className="flex justify-between items-center mb-6 border-b border-slate-200 pb-4">
        <h2 className="text-lg font-semibold text-slate-800">Seus Itens ({items.length})</h2>
      </div>

      <div className="space-y-4">
        {items.map((item, idx) => (
          <div key={idx} className="flex gap-5 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm relative group hover:border-slate-300 transition-all">
            <button
              onClick={() => onRemove(idx)}
              className="absolute top-3 right-3 text-slate-300 hover:text-red-500 hover:bg-red-50 p-1 rounded-md transition-all z-20"
              title="Remover item"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative w-28 h-28 shrink-0 bg-slate-50 rounded-xl overflow-hidden border border-slate-200">
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={item.productName}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                    <ImageIcon size={32} strokeWidth={1.5} />
                    <span className="text-[10px] mt-1 font-medium text-slate-400">Sem imagem</span>
                </div>
              )}
            </div>

            <div className="flex-1 py-1 flex flex-col justify-center">
              <h3 className="font-bold text-slate-900 text-lg leading-tight mb-2 pr-8">{item.productName}</h3>
              <div className="flex flex-wrap gap-x-4 gap-y-1 items-center">
                <p className="text-sm text-slate-500 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                  Qtd: <span className="font-bold text-slate-800">{item.quantity}</span>
                </p>
                {item.options?.map((opt, i) => (
                  <p key={i} className="text-sm text-slate-500">
                    {opt.name}: <span className="font-medium text-slate-700">{opt.value}</span>
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}