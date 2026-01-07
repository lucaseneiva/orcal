import { AttributeForm } from '@/app/(dashboard)/dashboard/attributes/form'
import { AttributeDAO } from '@/lib/data/attribute.dao'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/utils/supabase/server'

export default async function EditAttributePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const attributeDAO = new AttributeDAO(await createClient())
  const attribute = await attributeDAO.getAttributeById(id)

  if (!attribute) return notFound()

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <Link href="/dashboard/attributes" className="text-sm text-gray-500 mb-4 block">← Voltar</Link>
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-900">Editar Atributo</h1>
      <AttributeForm attribute={attribute} />
    </div>
  )
}