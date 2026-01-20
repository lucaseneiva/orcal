'use client'

import { useState } from 'react'
import { ImageUpload } from '../../../ui/image-upload'
import { ProductWithOptions } from '@/src/lib/types/types'

interface ProductMainInfoProps {
  product?: Partial<ProductWithOptions>
  primaryColor: string
}

export function ProductMainInfo({ product, primaryColor }: ProductMainInfoProps) {
  const [imageUrl, setImageUrl] = useState(product?.image_url || '')

  return (
    <div className="md:col-span-2 bg-white p-6 rounded-xl border shadow-sm h-fit space-y-5">
      {product?.id && <input type="hidden" name="id" value={product.id} />}

      {/* Nome */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
        <input
          name="name"
          defaultValue={product?.name}
          required
          className="w-full border rounded-lg p-2.5 outline-none text-gray-700 focus:ring-2 transition-all"
          style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
          placeholder="Ex: Cartão de Visita"
        />
      </div>

      {/* Slug */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL)</label>
        <input
          name="slug"
          defaultValue={product?.slug || ''}
          className="w-full border rounded-lg p-2.5 bg-gray-50 outline-none text-gray-700 focus:border-gray-400 transition-colors"
          placeholder="Deixe vazio para gerar automaticamente"
        />
      </div>

      {/* Descrição */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
        <textarea
          name="description"
          defaultValue={product?.description || ''}
          rows={4}
          className="w-full border rounded-lg p-2.5 outline-none text-gray-700 focus:ring-2 transition-all resize-none"
          style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
          placeholder="Descreva os detalhes técnicos e comerciais do produto..."
        />
      </div>

      {/* Imagem */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Imagem do Produto</label>
        <div className="bg-gray-50 p-4 rounded-xl border border-dashed border-gray-200">
          <ImageUpload
            defaultUrl={imageUrl}
            onUrlChange={(url) => setImageUrl(url)}
          />
          {/* Input hidden para enviar a URL no FormData */}
          <input type="hidden" name="image_url" value={imageUrl} />
        </div>
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <div className="relative">
          <select
            name="status"
            defaultValue={product?.status || 'active'}
            className="w-full border rounded-lg p-2.5 bg-white text-gray-700 appearance-none outline-none focus:ring-2 transition-all"
            style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
          >
            <option value="active">🟢 Ativo (Visível na loja)</option>
            <option value="draft">🟡 Rascunho (Oculto)</option>
            <option value="inactive">🔴 Inativo (Arquivado)</option>
          </select>
        </div>
      </div>
    </div>
  )
}