import { useState, useRef } from 'react'
import { createOptonAction, deleteOptionAction, updateOptionAction } from '../actions'

export function useAttributeValues() {
  const formRef = useRef<HTMLFormElement>(null)
  const [editingId, setEditingId] = useState<string | null>(null)

  const handleCreate = async (formData: FormData) => {
    await createOptonAction(formData)
    formRef.current?.reset()
  }

  const handleUpdate = async (formData: FormData) => {
    await updateOptionAction(formData)
    setEditingId(null)
  }

  const handleDelete = async (id: string, attributeId: string) => {
    const formData = new FormData()
    formData.append('id', id)
    formData.append('attribute_id', attributeId)
    
    await deleteOptionAction(formData) // 🔥 ERA ISSO! Estava chamando deleteAttribute
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