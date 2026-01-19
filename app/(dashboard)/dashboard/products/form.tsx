'use client'

import { upsertProductAction } from './actions'
import { AttributeWithOptions, ProductWithOptions } from '@/lib/types/types'
import { toast } from 'sonner'
import { ProductMainInfo } from './components/product-main-info'
import { ProductSettingsSidebar } from './components/product-settings-sidebar'

type ProductFormProps = {
  product?: Partial<ProductWithOptions>
  allAttributes: AttributeWithOptions[]
  primaryColor?: string
}

export function ProductForm({
  product,
  allAttributes,
  primaryColor = '#000000',
}: ProductFormProps) {

  async function handleSubmit(formData: FormData) {
    const result = await upsertProductAction(formData)
    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success('Produto salvo com sucesso!')
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
      
      {/* Formulário Principal */}
      <form id="main-form" action={handleSubmit} className="contents">
        <ProductMainInfo 
          product={product} 
          primaryColor={primaryColor} 
        />
      </form>

      {/* Barra Lateral */}
      <ProductSettingsSidebar 
        productId={product?.id}
        allAttributes={allAttributes}
        currentOptions={product?.options}
        primaryColor={primaryColor}
      />
      
    </div>
  )
}