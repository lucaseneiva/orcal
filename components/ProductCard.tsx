'use client'
import Link from "next/link";
import Image from "next/image";
// 1. Importamos o ícone (com alias para não conflitar com o componente Image)
import { Image as ImageIcon } from "lucide-react";

type ProductProps = {
  id: string
  name: string
  description: string
  imageUrl: string | null // Ajustado para aceitar null
  color: string
  slug: string
}

export function ProductCard({ name, description, imageUrl, color, slug }: ProductProps) {
  
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
      
      {/* Container da Imagem */}
      <div className="relative w-full h-48 bg-slate-50">
        {imageUrl ? (
          <Image 
            src={imageUrl} 
            alt={name} 
            fill 
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          /* 2. Placeholder usando Lucide */
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
            <ImageIcon size={40} strokeWidth={1.5} />
            <span className="text-xs mt-2 font-medium">Sem imagem</span>
          </div>
        )}
      </div>
      
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-lg text-slate-900 line-clamp-1">{name}</h3>
        <p className="text-slate-500 text-sm mt-1 line-clamp-2 flex-1">{description}</p>
        
        <div className="mt-4 flex items-center justify-center pt-4 border-t border-slate-100">
          <Link href={`/p/${slug}`} prefetch={false} className="w-full">
            <button
              className="w-full text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-lg text-white transition-transform hover:scale-[1.02] active:scale-95"
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