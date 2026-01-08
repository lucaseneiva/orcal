'use client'
import Link from "next/link";

type ProductProps = {
  id: string
  name: string
  description: string
  imageUrl: string
  color: string
  slug: string
}

export function ProductCard({ id, name, description, imageUrl, color, slug }: ProductProps) {
  
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
      <img src={imageUrl ?? "/placeholder.png"} alt={name} className="w-full h-48 object-cover" />
      
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-lg text-slate-900">{name}</h3>
        <p className="text-slate-500 text-sm mt-1 line-clamp-2 flex-1">{description}</p>
        
        <div className="mt-4 flex items-center justify-center pt-4 border-t border-slate-100">
          <Link href={`/p/${slug}`} prefetch={false}>
            <button
              className="text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-lg text-white transition-transform hover:scale-105 active:scale-95"
              style={{ backgroundColor: color }}
            >
              Ver Detalhes
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}