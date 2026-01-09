import { useState, useRef } from 'react'
import { manageAttributeValue } from '../actions'

export function useAttributeValues() {
  const formRef = useRef<HTMLFormElement>(null)
  const [editingId, setEditingId] = useState<string | null>(null)

  const handleCreate = async (formData: FormData) => {
    formData.append('_action', 'create')
    
    // 1. Call Server Action
    const result = await manageAttributeValue(formData)
    
    // 2. Handle Result
    if (!result.success) {
      alert(result.error) // Simple error handling
    } else {
      formRef.current?.reset() // Success
    }
  }

  const handleUpdate = async (formData: FormData) => {
    formData.append('_action', 'update')
    
    const result = await manageAttributeValue(formData)

    if (!result.success) {
      alert(result.error)
    } else {
      setEditingId(null)
    }
  }

  const handleDelete = async (id: string, attributeId: string) => {
    const formData = new FormData()
    formData.append('_action', 'delete')
    formData.append('id', id)
    formData.append('attribute_id', attributeId)
    
    const result = await manageAttributeValue(formData)
    
    if (!result.success) {
      alert(result.error)
    }
  }

  return {
    formRef,
    editingId,
    startEditing: (id: string) => setEditingId(id),
    cancelEditing: () => setEditingId(null),
    handleCreate,
    handleUpdate,
    handleDelete
  }
}