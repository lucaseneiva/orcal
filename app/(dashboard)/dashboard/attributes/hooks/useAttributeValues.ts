import { useState, useRef } from 'react'
import { createValue, deleteAttribute, updateValue,  } from '../actions'

export function useAttributeValues() {
  const formRef = useRef<HTMLFormElement>(null)
  const [editingId, setEditingId] = useState<string | null>(null)

  const handleCreate = async (formData: FormData) => {
    formData.append('_action', 'create')
    
    await createValue(formData)
    
  }

  const handleUpdate = async (formData: FormData) => {
    formData.append('_action', 'update')
    
    const result = await updateValue(formData)

  }

  const handleDelete = async (id: string, attributeId: string) => {
    const formData = new FormData()
    formData.append('_action', 'delete')
    formData.append('id', id)
    formData.append('attribute_id', attributeId)
    
    const result = await deleteAttribute(formData)
    
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