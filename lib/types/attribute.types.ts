import { Database } from '@/lib/types/database.types'

type AttributeRow = Database['public']['Tables']['attributes']['Row']
type AttributeValueRow = Database['public']['Tables']['attribute_values']['Row']

// Domain Type for a Value
export type AttributeValue = AttributeValueRow

// Domain Type for an Attribute with its Values (Nested)
export interface AttributeWithValues extends AttributeRow {
  attribute_values: AttributeValue[]
}