'use client'
import Link from "next/link";
import Image from "next/image"; // Importado para otimização

type ProductProps = {
  id: string
  name: string
  description: string
  imageUrl: string
  color: string
  slug: string
}

// Removido o 'id' da desestruturação para corrigir o erro "defined but never used"
export function ProductCard({ name, description, imageUrl, color, slug }: ProductProps) {
  
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
      
      {/* Container da Imagem com Next.js Image */}
      <div className="relative w-full h-48">
        <Image 
          src={imageUrl || "/placeholder.png"} 
          alt={name} 
          fill 
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      
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