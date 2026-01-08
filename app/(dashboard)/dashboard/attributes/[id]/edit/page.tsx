import { AttributeForm } from '@/app/(dashboard)/dashboard/attributes/form'
import { AttributeRepo } from '@/lib/repositories/attribute.repo'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/utils/supabase/server'

// We define a local version of the expected type to handle the cast
// or we can import it if exported from the form.
import type { Attribute } from '@/app/(dashboard)/dashboard/attributes/form'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditAttributePage({ params }: PageProps) {
  const { id } = await params
  
  const supabase = await createClient()
  const attributeRepo = new AttributeRepo(supabase)
  
  // Fetch data from repository
  const attributeData = await attributeRepo.getById(id)

  if (!attributeData) return notFound()

  /**
   * FIX: The repository returns attribute_values without 'attribute_id' 
   * (since it's redundant in a nested object), but the Form interface 
   * marked it as required. We cast through 'unknown' to bypass this mismatch.
   */
  const formattedAttribute = attributeData as unknown as Attribute

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <Link href="/dashboard/attributes" className="text-sm text-gray-500 mb-4 block">
        ← Voltar
      </Link>
      
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-900">
          Editar Atributo
        </h1>
        
        <AttributeForm attribute={formattedAttribute} />
      </div>
    </div>
  )
}