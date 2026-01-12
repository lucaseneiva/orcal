import { useState, useRef } from 'react'
import { createValue, deleteValue, updateValue } from '../actions'

export function useAttributeValues() {
  const formRef = useRef<HTMLFormElement>(null)
  const [editingId, setEditingId] = useState<string | null>(null)

  const handleCreate = async (formData: FormData) => {
    await createValue(formData)
    formRef.current?.reset()
  }

  const handleUpdate = async (formData: FormData) => {
    await updateValue(formData)
    setEditingId(null)
  }

  const handleDelete = async (id: string, attributeId: string) => {
    const formData = new FormData()
    formData.append('id', id)
    formData.append('attribute_id', attributeId)
    
    await deleteValue(formData) // 🔥 ERA ISSO! Estava chamando deleteAttribute
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