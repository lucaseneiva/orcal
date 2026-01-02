'use client'

import { createClient } from '@/lib/utils/supabase/client'
import { useState } from 'react'

interface ImageUploadProps {
  defaultUrl?: string
  onUrlChange: (url: string) => void
}

// --- FUNÇÃO MÁGICA DE OTIMIZAÇÃO ---
async function optimizeImage(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    
    reader.onload = (event) => {
      const img = new Image()
      img.src = event.target?.result as string
      
      img.onload = () => {
        // 1. Configurar dimensões máximas (1200x1200)
        const MAX_WIDTH = 1200
        const MAX_HEIGHT = 1200
        let width = img.width
        let height = img.height

        // Lógica de redimensionamento mantendo proporção
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width
            width = MAX_WIDTH
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height
            height = MAX_HEIGHT
          }
        }

        // 2. Criar Canvas para desenhar a nova imagem
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Falha ao criar contexto do canvas'))
          return
        }

        // Desenhar imagem redimensionada
        ctx.drawImage(img, 0, 0, width, height)

        // 3. Converter para Blob .AVIF com qualidade 80%
        // 'image/avif' é suportado na maioria dos browsers modernos.
        // Se o browser for muito antigo, ele pode cair para png/jpeg dependendo da implementação,
        // mas hoje em dia Chrome, Firefox, Safari (recente) aceitam.
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Falha na conversão da imagem'))
              return
            }
            
            // Criar novo arquivo com extensão correta
            const newName = file.name.replace(/\.[^/.]+$/, "") + ".avif"
            const optimizedFile = new File([blob], newName, {
              type: 'image/avif',
              lastModified: Date.now(),
            })

            resolve(optimizedFile)
          },
          'image/avif', 
          0.8 // Qualidade (0 a 1)
        )
      }
      
      img.onerror = (err) => reject(err)
    }
    
    reader.onerror = (err) => reject(err)
  })
}

export function ImageUpload({ defaultUrl, onUrlChange }: ImageUploadProps) {
  const [preview, setPreview] = useState(defaultUrl || '')
  const [uploading, setUploading] = useState(false)

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const originalFile = e.target.files?.[0]
    if (!originalFile) return

    setUploading(true)

    try {
      // 1. OTIMIZAR ANTES DE ENVIAR
      // Isso acontece no navegador do usuário
      const file = await optimizeImage(originalFile)
      
      const supabase = createClient()
      
      // Gera nome único.avif
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.avif`
      const filePath = `${fileName}`

      // 2. Upload do arquivo já leve
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file, {
          contentType: 'image/avif', // Forçar cabeçalho correto
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) throw uploadError

      // 3. Pegar URL Pública
      const { data } = supabase.storage
        .from('images')
        .getPublicUrl(filePath)

      const publicUrl = data.publicUrl

      setPreview(publicUrl)
      onUrlChange(publicUrl)

    } catch (error) {
      console.error('Erro no upload:', error)
      alert('Erro ao processar imagem. Tente outra.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative w-full h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
             <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
             <div className="text-gray-500 text-sm font-medium animate-pulse">Otimizando e enviando...</div>
          </div>
        ) : preview ? (
          <img 
            src={preview} 
            alt="Preview" 
            className="w-full h-full object-contain" 
          />
        ) : (
          <div className="text-gray-400 text-sm text-center px-4">
            <p>Nenhuma imagem selecionada</p>
            <p className="text-xs mt-1 text-gray-300">Max 1200px • Auto AVIF</p>
          </div>
        )}
      </div>

      <div>
        <label className={`cursor-pointer inline-block bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition ${uploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}>
            {uploading ? 'Processando...' : 'Escolher Imagem'}
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleUpload} 
            disabled={uploading}
            className="hidden" 
          />
        </label>
        
        {preview && !uploading && (
            <button 
                type="button"
                onClick={() => { setPreview(''); onUrlChange('') }}
                className="ml-4 text-xs text-red-500 underline"
            >
                Remover
            </button>
        )}
      </div>
    </div>
  )
}