'use client'

import { useState } from 'react'

type ProductOption = {
  value_id: string
  value_name: string
  value_meta: string | null
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

  // Group options by attribute
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

  // Filter groups that have at least one value with description
  const groupsWithDescriptions = attributeGroups.filter(group => 
    group.values.some(val => val.value_meta)
  )

  if (groupsWithDescriptions.length === 0) {
    return null
  }

  const toggleAttribute = (attributeId: string) => {
    setExpandedAttribute(expandedAttribute === attributeId ? null : attributeId)
  }

  return (
    <div className="mt-8 border-t border-gray-200 pt-8">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Detalhes das Opções</h3>
      
      <div className="space-y-3">
        {groupsWithDescriptions.map((group) => {
          const isExpanded = expandedAttribute === group.id
          const hasAnyDescription = group.values.some(val => val.value_meta)
          
          if (!hasAnyDescription) return null

          return (
            <div key={group.id} className="border border-gray-200 rounded-lg overflow-hidden">
              {/* Header - Clickable */}
              <button
                onClick={() => toggleAttribute(group.id)}
                className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
              >
                <span className="font-semibold text-gray-900 capitalize">
                  {group.name}
                </span>
                <svg
                  className={`w-5 h-5 text-gray-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Content - Expandable */}
              {isExpanded && (
                <div className="p-4 bg-white space-y-4">
                  {group.values.map((val) => {
                    if (!val.value_meta) return null
                    
                    return (
                      <div key={val.value_id} className="border-l-4 pl-4 py-2" style={{ borderColor: brandColor }}>
                        <h4 className="font-semibold text-gray-900 mb-1">
                          {val.value_name}
                        </h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {val.value_meta}
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