'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

type ProductOption = {
  value_id: string
  value_name: string
  description: string | null
  attribute_id: string
  attribute_name: string
  attribute_slug: string
}

interface AttributeDetailsProps {
  options: ProductOption[]
  brandColor?: string
}

export default function AttributeDetails({ options, brandColor = '#000000' }: AttributeDetailsProps) {
  const [expandedAttribute, setExpandedAttribute] = useState<string | null>(null)

  // Agrupar opções por atributo
  const groupedAttributes = options.reduce((acc, opt) => {
    if (!acc[opt.attribute_id]) {
      acc[opt.attribute_id] = {
        id: opt.attribute_id,
        name: opt.attribute_name,
        slug: opt.attribute_slug,
        values: []
      }
    }
    acc[opt.attribute_id].values.push(opt)
    return acc
  }, {} as Record<string, { id: string, name: string, slug: string, values: ProductOption[] }>)

  const attributeGroups = Object.values(groupedAttributes)

  // Filtrar grupos que possuem pelo menos um valor com descrição
  const groupsWithDescriptions = attributeGroups.filter(group => 
    group.values.some(val => val.description)
  )

  // SE NÃO HOUVER DESCRIÇÕES, RETORNA NULL (A caixa branca não existirá)
  if (groupsWithDescriptions.length === 0) {
    return null
  }

  const toggleAttribute = (attributeId: string) => {
    setExpandedAttribute(expandedAttribute === attributeId ? null : attributeId)
  }

  return (
    /* O container visual agora fica aqui dentro */
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:p-8 mt-8">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Detalhes das Opções</h3>
      
      <div className="space-y-3">
        {groupsWithDescriptions.map((group) => {
          const isExpanded = expandedAttribute === group.id
          
          return (
            <div key={group.id} className="border border-gray-100 rounded-lg overflow-hidden">
              {/* Header - Clicável */}
              <button
                onClick={() => toggleAttribute(group.id)}
                className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
              >
                <span className="font-semibold text-gray-900 capitalize">
                  {group.name}
                </span>
                <ChevronDown 
                  size={20}
                  className={`text-gray-500 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Conteúdo - Expansível */}
              {isExpanded && (
                <div className="p-4 bg-white space-y-4">
                  {group.values.map((val) => {
                    if (!val.description) return null
                    
                    return (
                      <div key={val.value_id} className="border-l-4 pl-4 py-2" style={{ borderColor: brandColor }}>
                        <h4 className="font-semibold text-gray-900 mb-1">
                          {val.value_name}
                        </h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {val.description}
                        </p>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}