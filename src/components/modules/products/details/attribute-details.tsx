'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { GroupedAttribute } from '@/src/lib/utils/product-logic'

interface AttributeDetailsProps {
  groupedOptions: GroupedAttribute[]
  brandColor?: string
}

export default function AttributeDetails({ groupedOptions, brandColor = '#000000' }: AttributeDetailsProps) {
  const [expandedAttribute, setExpandedAttribute] = useState<string | null>(null)

  // Filter groups that have at least one value with a description
  const groupsWithDescriptions = groupedOptions.filter(group => 
    group.values.some(val => val.option_description)
  )

  if (groupsWithDescriptions.length === 0) {
    return null
  }

  const toggleAttribute = (attributeId: string) => {
    setExpandedAttribute(expandedAttribute === attributeId ? null : attributeId)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:p-8 mt-8">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Detalhes das Opções</h3>
      
      <div className="space-y-3">
        {groupsWithDescriptions.map((group) => {
          const isExpanded = expandedAttribute === group.id
          
          return (
            <div key={group.id} className="border border-gray-100 rounded-lg overflow-hidden">
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

              {isExpanded && (
                <div className="p-4 bg-white space-y-4">
                  {group.values.map((val) => {
                    if (!val.option_description) return null
                    
                    return (
                      <div key={val.option_id} className="border-l-4 pl-4 py-2" style={{ borderColor: brandColor }}>
                        <h4 className="font-semibold text-gray-900 mb-1">
                          {val.option_name}
                        </h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {val.option_description}
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