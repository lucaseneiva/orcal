import { getProductService } from '@/lib/services/product-service'
import { getCurrentStore } from '@/lib/utils/get-current-store'
import { notFound, redirect } from 'next/navigation'
import { ProductForm } from '../../form'
import Link from 'next/link'

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const store = await getCurrentStore()
  if (!store) redirect('/dashboard')

  const productService = await getProductService()
  
  // 1. Buscar Produto
  const product = await productService.getProductById(id) // O seu metodo getStoreProduct já traz os atributos selecionados?
  // NOTA: O seu getStoreProduct atual busca por SLUG. 
  // Você precisará de um getById ou adaptar o getStoreProduct para aceitar ID se o parâmetro da rota for ID.
  // Supondo que você crie um getProductById(id) ou use query direta aqui:

  if (!product) return notFound()

  // 2. Buscar Atributos Disponíveis
  const allAttributes = await productService.getStoreAttributes(store.id)

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Editar Produto</h1>
      </div>

      <ProductForm product={product} allAttributes={allAttributes} />
    </div>
  )
}