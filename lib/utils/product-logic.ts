import { ProductOption } from '@/lib/types/types' // Ensure this type is exported from your types file

export type GroupedAttribute = {
  id: string
  name: string
  slug: string
  values: ProductOption[]
}

/**
 * Groups flat product options by their attribute_id
 */
export function groupProductOptions(options: ProductOption[]): GroupedAttribute[] {
  const groups: Record<string, GroupedAttribute> = {}

  options.forEach((opt) => {
    if (!groups[opt.attribute_id]) {
      groups[opt.attribute_id] = {
        id: opt.attribute_id,
        name: opt.attribute_name,
        slug: opt.attribute_slug,
        values: []
      }
    }
    groups[opt.attribute_id].values.push(opt)
  })

  return Object.values(groups)
}

/**
 * Calculates the default selected values (first valid option per attribute)
 */
export function getDefaultSelections(options: ProductOption[]): Record<string, string> {
  const defaults: Record<string, string> = {}
  const seenAttributes = new Set<string>()

  options.forEach((opt) => {
    if (!seenAttributes.has(opt.attribute_id)) {
      defaults[opt.attribute_id] = opt.option_id
      seenAttributes.add(opt.attribute_id)
    }
  })
  
  return defaults
}